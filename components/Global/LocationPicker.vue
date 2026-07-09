<template>
    <Dialog
        v-model:visible="visibleProxy"
        modal
        :header="header"
        :style="{ width: '615px' }"
        :breakpoints="{ '1199px': '75vw', '575px': '92vw' }"
        :draggable="false"
        @hide="$emit('hide')"
    >
        <div class="location-picker">
            <div class="position-relative mb-3">
                <input
                    ref="autocompleteRef"
                    type="text"
                    class="form-control location-picker-search"
                    :placeholder="searchPlaceholder"
                />
                <i class="fa-solid fa-search location-picker-search-icon"></i>
            </div>

            <div ref="mapRef" class="location-picker-map"></div>

            <div class="mt-3 position-relative">
                <input
                    v-model="currentAddress"
                    type="text"
                    class="form-control location-picker-address"
                    :placeholder="searchPlaceholder"
                    readonly
                />
                <i class="fa-solid fa-location-dot location-picker-marker-icon"></i>
            </div>

            <div v-if="optionalButton" class="d-flex justify-content-center mt-3">
                <button type="button" class="custom-btn location-picker-confirm" @click="closeDialog">
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </Dialog>

    <Dialog
        v-model:visible="locationErrorVisible"
        modal
        :closable="true"
        :dismissableMask="true"
        :closeOnEscape="true"
        :style="{ width: '460px' }"
        :header="locationErrorHeader"
    >
        <div class="text-secondary">
            {{ locationErrorMessage }}
        </div>
    </Dialog>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: "global" });
const config = useRuntimeConfig();

const props = defineProps({
    visible: { type: Boolean, default: false },
    location: { type: Object, default: null },
    header: { type: String, default: "" },
    zoom: { type: Number, default: 14 },
    defaultCenter: {
        type: Object,
        default: () => ({ lat: 24.7136, lng: 46.6753, map_desc: "" }),
    },
    autoLocateOnOpen: { type: Boolean, default: true },
    optionalButton: { type: Boolean, default: true },
});

const emit = defineEmits(["update:visible", "update:location", "hide"]);

const visibleProxy = computed({
    get: () => props.visible,
    set: (val) => emit("update:visible", val),
});

const searchPlaceholder = computed(() => t("Global.search_here") || (locale.value === "ar" ? "ابحث هنا" : "Search here"));
const confirmText = computed(() => t("products.confirm_location") || (locale.value === "ar" ? "تأكيد" : "Confirm"));
const locationErrorHeader = computed(() => locale.value === "ar" ? "تفعيل الموقع" : "Enable location");

const mapRef = ref(null);
const autocompleteRef = ref(null);
const center = ref(props.location ?? { ...props.defaultCenter });
const currentAddress = ref(props.location?.map_desc || "");
const locationErrorVisible = ref(false);
const locationErrorMessage = ref("");
const permissionState = ref(null);
const warnedNoKey = ref(false);

let mapInstance = null;
let markerInstance = null;
let autocompleteInstance = null;
let permissionStatus = null;

const closeDialog = () => {
    visibleProxy.value = false;
};

const waitForGoogleMaps = async () => {
    const start = Date.now();

    while (Date.now() - start < 5000) {
        if (window.google?.maps?.Map && window.google.maps.places?.Autocomplete && window.google.maps.Geocoder) {
            return true;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return false;
};

const loadGoogleMaps = async () => {
    if (typeof window === "undefined") return false;

    if (await waitForGoogleMaps()) return true;

    const key = config.public.googleMapsKey || config.public.googleMapsApiKey;
    if (!key) {
        if (!warnedNoKey.value) {
            console.warn("Missing public Google Maps key");
            warnedNoKey.value = true;
        }
        return false;
    }

    if (!window.__googleMapsLoadingPromise) {
        window.__googleMapsLoadingPromise = new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');

            if (existingScript) {
                if (window.google?.maps) {
                    resolve(true);
                    return;
                }

                existingScript.addEventListener("load", () => resolve(true), { once: true });
                existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps")), { once: true });
                return;
            }

            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&language=${encodeURIComponent(locale.value)}`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error("Failed to load Google Maps"));
            document.head.appendChild(script);
        });
    }

    try {
        await window.__googleMapsLoadingPromise;
        return await waitForGoogleMaps();
    } catch {
        return false;
    }
};

const initMap = async (position) => {
    const ready = await loadGoogleMaps();
    if (!ready || !mapRef.value) return false;

    destroyMap();

    const nextCenter = { lat: Number(position.lat), lng: Number(position.lng) };

    mapInstance = new window.google.maps.Map(mapRef.value, {
        center: nextCenter,
        zoom: props.zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    markerInstance = new window.google.maps.Marker({
        position: nextCenter,
        map: mapInstance,
        draggable: true,
    });

    mapInstance.addListener("click", async (event) => {
        await setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });

    markerInstance.addListener("dragend", async (event) => {
        await setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });

    if (autocompleteRef.value && window.google.maps.places?.Autocomplete) {
        autocompleteInstance = new window.google.maps.places.Autocomplete(autocompleteRef.value, {
            fields: ["geometry", "formatted_address", "name"],
        });
        autocompleteInstance.addListener("place_changed", onPlaceChanged);
    }

    return true;
};

const destroyMap = () => {
    if (autocompleteInstance) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteInstance);
        autocompleteInstance = null;
    }

    if (markerInstance) {
        window.google?.maps?.event?.clearInstanceListeners(markerInstance);
        markerInstance.setMap(null);
        markerInstance = null;
    }

    if (mapInstance) {
        window.google?.maps?.event?.clearInstanceListeners(mapInstance);
        mapInstance = null;
    }
};

const reverseGeocode = async (lat, lng) => {
    try {
        const ready = await loadGoogleMaps();
        if (!ready) return "";

        const geocoder = new window.google.maps.Geocoder();
        return await new Promise((resolve) => {
            geocoder.geocode({ location: { lat, lng }, language: locale.value }, (results, status) => {
                if (status === "OK" && Array.isArray(results) && results.length > 0) {
                    resolve(results[0]?.formatted_address || "");
                    return;
                }
                resolve("");
            });
        });
    } catch {
        return "";
    }
};

const reverseGeocodeRest = async (lat, lng) => {
    try {
        const key = config.public.googleMapsKey || config.public.googleMapsApiKey;
        if (!key) return "";

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(`${lat},${lng}`)}&language=${encodeURIComponent(locale.value)}&key=${encodeURIComponent(key)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json?.status === "OK" && Array.isArray(json.results) && json.results.length > 0) {
            return json.results[0]?.formatted_address || "";
        }

        return "";
    } catch {
        return "";
    }
};

const setLocation = async (next) => {
    if (!next) return;

    const normalized = { lat: Number(next.lat), lng: Number(next.lng) };
    center.value = normalized;

    if (markerInstance) markerInstance.setPosition(normalized);
    if (mapInstance) mapInstance.panTo(normalized);

    let map_desc = next.map_desc || await reverseGeocode(normalized.lat, normalized.lng);
    if (!map_desc) map_desc = await reverseGeocodeRest(normalized.lat, normalized.lng);

    currentAddress.value = map_desc || "";

    if (autocompleteRef.value) {
        autocompleteRef.value.value = currentAddress.value;
    }

    emit("update:location", { ...normalized, map_desc });
};

const onPlaceChanged = async () => {
    if (!autocompleteInstance) return;

    const place = autocompleteInstance.getPlace();
    if (!place?.geometry?.location) return;

    await setLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        map_desc: place.formatted_address || place.name || "",
    });
};

const showLocationError = (msg) => {
    locationErrorMessage.value = msg;
    locationErrorVisible.value = true;
};

const getUserLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
        showLocationError(locale.value === "ar" ? "المتصفح لا يدعم تحديد الموقع" : "Your browser does not support geolocation");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const next = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            const initialized = await initMap(next);
            if (!initialized) {
                showLocationError(locale.value === "ar" ? "تعذر تحميل الخريطة" : "Unable to load the map");
                return;
            }
            await setLocation(next);
        },
        async () => {
            const msg = permissionState.value === "denied"
                ? (locale.value === "ar" ? "تم رفض إذن الموقع. فعّل الموقع من إعدادات المتصفح ثم أعد المحاولة." : "Location permission was denied. Enable it from browser settings and try again.")
                : (locale.value === "ar" ? "يرجى السماح بإذن الموقع من المتصفح لتحديد موقعك الحالي." : "Please allow location permission from your browser to detect your current location.");
            showLocationError(msg);
            center.value = { ...props.defaultCenter };
            await initMap(center.value);
        },
    );
};

watch(
    () => props.location,
    (val) => {
        if (val?.lat != null && val?.lng != null) {
            center.value = val;
            currentAddress.value = val.map_desc || "";

            if (autocompleteRef.value) {
                autocompleteRef.value.value = currentAddress.value;
            }

            if (markerInstance) markerInstance.setPosition({ lat: Number(val.lat), lng: Number(val.lng) });
            if (mapInstance) mapInstance.panTo({ lat: Number(val.lat), lng: Number(val.lng) });
        }
    },
    { deep: true },
);

watch(
    () => props.visible,
    async (isOpen) => {
        if (!isOpen) {
            if (permissionStatus) permissionStatus.onchange = null;
            destroyMap();
            return;
        }

        if (typeof navigator !== "undefined" && navigator.permissions?.query) {
            try {
                permissionStatus = await navigator.permissions.query({ name: "geolocation" });
                permissionState.value = permissionStatus.state;
                permissionStatus.onchange = () => {
                    permissionState.value = permissionStatus.state;
                };
            } catch {
                permissionState.value = null;
                permissionStatus = null;
            }
        }

        await nextTick();

        if (props.location?.lat != null && props.location?.lng != null) {
            center.value = props.location;
            currentAddress.value = props.location.map_desc || "";
            if (autocompleteRef.value) {
                autocompleteRef.value.value = currentAddress.value;
            }
            await initMap(center.value);
            if (!currentAddress.value) await setLocation(center.value);
            return;
        }

        if (props.autoLocateOnOpen) {
            getUserLocation();
            return;
        }

        center.value = { ...props.defaultCenter };
        const initialized = await initMap(center.value);
        if (!initialized) {
            showLocationError(locale.value === "ar" ? "تعذر تحميل الخريطة" : "Unable to load the map");
        }
    },
);

onBeforeUnmount(() => {
    if (permissionStatus) permissionStatus.onchange = null;
    destroyMap();
});
</script>

<style scoped lang="scss">
.location-picker-map {
    width: 100%;
    height: 400px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.location-picker-search,
.location-picker-address {
    height: 48px;
    border-radius: 8px;
    padding-inline-start: 42px;
}

.location-picker-search-icon,
.location-picker-marker-icon {
    position: absolute;
    inset-inline-start: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--main);
    pointer-events: none;
}

.location-picker-confirm {
    width: 75%;
    max-width: 320px;
}
</style>
