<template>
    <Dialog
        modal
        :show_inputs="show_inputs"
        :visible="props.visible"
        :lat="lat"
        :lng="lng"
        :closeModal_btn="closeModal_btn"
        class="map_style"
    >
        <div class="modal-body-main modal-pad profile-page">
            <button type="button" class="close transparent" v-if="props.closeModal_btn" @click="closeDialog">
                <i class="far fa-times-circle"></i>
            </button>

            <div class="main-text center mb-4">
                <img src="@/assets/images/main-logo.svg" alt="login-logo" class="login-logo" loading="lazy">
                <h1 class="main-title main-cl">{{ mapText.title }}</h1>
                <p class="main-desc">{{ mapText.description }}</p>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="dirmain mb-3">
                        <div class="mb-3 w-100" v-if="props.show_address_details">
                            <label class="label">{{ $t("Global.address_name") }}</label>
                            <input
                                class="main_input"
                                :placeholder="$t('Global.enter_address_name')"
                                type="text"
                                name=""
                                v-model="titleName"
                                id=""
                                v-if="props.show_inputs"
                            />
                        </div>
                        <div class="mb-3 w-100">
                            <label class="label">{{ $t("Global.location") }}</label>
                            <div class="position-relative w-100" v-if="!props.AutoComplete">
                                <img
                                    src="@/assets/images/marker.png"
                                    alt="input-img"
                                    class="map_search_img"
                                />

                                <input type="text" class="main_input" :value="address" readonly>
                            </div>
                        </div>
                        <div class="mb-3" v-if="props.show_address_details">
                            <label class="label">{{ $t("Global.title_description") }}</label>
                            <textarea  class="main_input main_area" :placeholder="$t('Global.enter_title_description')" v-model="description"></textarea>
                        </div>
                        <button
                            class="custom-btn smm bold getCurent"
                            @click="getCurrentLocatoin"
                            v-if="props.show_inputs || props.current_location_button">
                            {{ $t("Global.current_location") }}
                        </button>
                    </div>
                </div>
                <div class="col-12 map_section">

                    <div class="main_input with_icon mb-3">
                        <div class="position-relative w-100" v-if="!props.AutoComplete">
                        <GMapAutocomplete
                            :placeholder="$t('Global.search_here')"
                            @place_changed="setPlace"
                            class="search_here custum-input-icon"
                            :value="address"
                        >
                        </GMapAutocomplete>
                    </div>
                        <div class="static-btn">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>

                    <GMapMap
                        :center="center"
                        :zoom="8"
                        map-type-id="terrain"
                        class="real_map">
                        <GMapMarker
                            @dragend="getPositionmarker($event)"
                            :position="center"
                            :draggable="props.isDraggable"
                            :icon="{
                                url: markerImage,
                                scaledSize: { width: 20, height: 35, f: 'px', b: 'px' },
                            }"
                        />
                    </GMapMap>
                    
                </div>
            </div>

            <div class="flex-group-me mt-4" v-if="!props.submit_location">
                <button type="button" class="custom-btn bold" @click="closeModal">
                    <!-- {{ $t("Auth.confirmation") }} -->
                    {{ mapText.buttonText }}
                    <span class="spinner-border spinner-border-sm" v-if="props.confirm_loading" role="status" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </Dialog>
</template>


<script setup>

import markerImage from "@/assets/images/marker.png";


// props

const props = defineProps({
        show_inputs: Boolean,
        lat: Number,
        lng: Number,
        title: String,
        current_location: Boolean,
        closeModal_btn: Boolean,
        AutoComplete: Boolean,
        submit_location: Boolean,
        isDraggable: Boolean,
        resetTitle: Boolean,
        CurrentTitle: String,
        CurrentDesc: String,
        mapAddress: String,
        visible: Boolean,
        current_location_button: {
            type: Boolean,
            default: false
        },
        show_address_details: {
            type: Boolean,
            default: true
        },
        confirm_loading: Boolean,
        triggerUpdate: Boolean,
        mapText : Object
    });

// refs

const address = ref(props.mapAddress);
const titleName = ref(props.CurrentTitle);
const description = ref(props.CurrentDesc);
const selectedAddress = ref(null);
const lat = ref(null);
const lng = ref(null);

const center = ref({ lat: null, lng: null });

const emit = defineEmits(["updateAddress"]);

const closeDialog = () => {
    emit("handleClose");
}

const closeModal = () => {
    emit("closeModal", titleName.value, description.value);
    lat.value = center.value.lat;
    lng.value = center.value.lng;
};


watch(() => props.visible, (newVal) => {

    if (newVal && props.triggerUpdate) {  // إذا كان triggerTitleUpdate هو true
        titleName.value = props.CurrentTitle || '';    
        description.value = props.CurrentDesc || '';
    } else {  // If dialog is closed
        titleName.value = '';    // Reset titleName
        description.value = '';  // Reset description
    }
});




// watch props changes to update center
watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
    if (typeof newLat === 'number' && typeof newLng === 'number' && isFinite(newLat) && isFinite(newLng)) {
        center.value = { lat: newLat, lng: newLng };
    }
}, { immediate: true });

watch(() => props.mapAddress, (newVal) => {
    address.value = newVal;
}, { immediate: true });


function getLanguage() {
    const locale = localStorage.getItem("locale");
    return (locale === null || locale === "ar") ? "ar" : "en";
};

function setPlace(e) {
    address.value = e.formatted_address;
    lat.value = e.geometry.location.lat();
    lng.value = e.geometry.location.lng();

    console.log('setPlace', e)

    let city = '';
    let country = '';

    if (e.address_components) {
        e.address_components.forEach(component => {
            if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                city = component.long_name;
            }
            if (component.types.includes('country')) {
                country = component.long_name;
            }
        });
    }

    selectedAddress.value = `${country}, ${city}`;

    center.value.lat = e.geometry.location.lat();
    center.value.lng = e.geometry.location.lng();

    emit("updateAddress", address.value);
    handleMapUpdate(center.value.lat, center.value.lng, address.value);
}

function getPositionmarker(e) {
    center.value.lat = e.latLng.lat();
    center.value.lng = e.latLng.lng();
    
    // location.value.lat = e.latLng.lat();
    // location.value.lng = e.latLng.lng();
    getaddressfromlatlng();
}

function getaddressfromlatlng() {
    const geocoder = new google.maps.Geocoder();
    const language = getLanguage();
    geocoder.geocode(
        { location: center.value, language: language },
        (results, status) => {
            if (status === "OK" && results[0]) {
                address.value = results[0].formatted_address;

                let city = '';
                let country = '';

                if (results[0].address_components) {
                    results[0].address_components.forEach(component => {
                        if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                            city = component.long_name;
                        }
                        if (component.types.includes('country')) {
                            country = component.long_name;
                        }
                    });
                }

                selectedAddress.value = `${country}, ${city}`;

                document.querySelector(".pac-target-input").value = results[0].formatted_address;
                emit("updateAddress", address.value);
                handleMapUpdate(center.value.lat, center.value.lng, address.value);
            } else {
                address.value = "No results found";
            }
        }
    );
}

function getCurrentLocatoin() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                center.value.lat = position.coords.latitude;
                center.value.lng = position.coords.longitude;
                lat.value = position.coords.longitude;
                lng.value = position.coords.longitude;
                getaddressfromlatlng();
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

onMounted(() => {
  if (props.current_location) {
    getCurrentLocatoin();

  } 
});

watch(() => props.current_location, (newVal) => {
  if (newVal) {
    getCurrentLocatoin();
  }
});


// function to handle map update lat and lng
function handleMapUpdate(newLat, newLng, newAddress) {
    center.value = { lat: newLat, lng: newLng };
    address.value = newAddress;
    emit('updateAddress', { lat: newLat, lng: newLng, address: newAddress });
}



</script>


<style lang="scss">

    .dirmain {
        .main_input {
            width: 100%;
        }
    }

    .main_input {
        &.search_here {
            border: 1px solid #eee;
            background-color: #eee;
        }
    }

    .flex-group-me {
        justify-content: center;
    }
    .map_search_img {
        height: 30px;
        width: 30px;
        position: absolute;
        top: 50%;
        transform: translate(0%, -50%);
    }
</style>

<style lang="scss">
    // hidden close modal button
    .map_style {
        border: 1px solid #eee;
        width: 900px;
        max-width: calc(100% - 20px);
        .p-dialog-header {
            .p-dialog-header-icons {
                display: none;
            }
        }
        .close {
            background: #F0516D;
            color: #fff;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 13px;
            margin-inline-start: auto;
        }
    }

    .real_map {
        width: 100%;
        height: 330px;
        border: 1px solid #dddddd;
        border-radius: 10px;
        overflow: hidden;
    }
</style>
