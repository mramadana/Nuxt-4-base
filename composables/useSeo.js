// const isSeoDataLoaded = ref(false);
// const isSeoDataLoading = ref(false);
// const SeoData = ref([]);

// const getSeoData = async () => {

//   const cachedData = process.client ? localStorage.getItem('SeoData') : null;

//   if (cachedData) {
//     SeoData.value = JSON.parse(cachedData);
//     isSeoDataLoaded.value = true;
//     return { status: "success", data: SeoData.value };
//   }

//   if (isSeoDataLoaded.value || isSeoDataLoading.value) {
//     return { status: "success", data: SeoData.value };
//   }

//   try {
//     isSeoDataLoading.value = true;
//     const { response } = responseApi();
//     const axios = useApi();

//     const res = await axios.get('seos');

//     if (response(res) === "success") {
//       SeoData.value = res.data.data;
//       if (process.client) {
//         localStorage.setItem("SeoData", JSON.stringify(SeoData.value));
//       }
//       isSeoDataLoaded.value = true;
//     } else {
//       console.error("Failed to fetch SEO data:", res.data.msg);
//     }
//   } catch (error) {
//     console.error("Error fetching SEO data:", error.message);
//   } finally {
//     isSeoDataLoading.value = false;
//   }
// };

// const checkSeoKey = (key) => {
//   if (!isSeoDataLoaded.value) {
//     return false;
//   }

//   for (let i = 0; i < SeoData.value.length; i++) {
//     if (SeoData.value[i].key === key) {
//       return SeoData.value[i];
//     }
//   }
//   return false;
// };

// export const useSeo = () => {
//   return {
//     getSeoData,
//     checkSeoKey,
//   };
// };


// ********************** second way **********************


const isSeoDataLoaded = ref(false);
const isSeoDataLoading = ref(false);
const SeoData = ref([]);

// This will fetch the SEO data once and cache it in local storage for client-side
const getSeoData = async () => {
  // Check if data is already loaded in composable state
  if (isSeoDataLoaded.value || isSeoDataLoading.value) {
    return { status: "success", data: SeoData.value };
  }

  // Attempt to load from localStorage only on client-side
  const cachedData = localStorage.getItem('SeoData');
  if (cachedData) {
    SeoData.value = JSON.parse(cachedData);
    isSeoDataLoaded.value = true;
    return { status: "success", data: SeoData.value };
  }

  // If no cached data, fetch from the API
  try {
    isSeoDataLoading.value = true;
    const { response } = responseApi();
    const axios = useApi();

    const res = await axios.get('seos');

    if (response(res) === "success") {
        SeoData.value = res.data.data;
      
      // Cache in localStorage if on client-side
      if (process.client) {
        localStorage.setItem("SeoData", JSON.stringify(SeoData.value));
      }
      
      isSeoDataLoaded.value = true;
    } else {
      console.error("Failed to fetch SEO data:", res.data.msg);
    }
  } catch (error) {
    console.error("Error fetching SEO data:", error.message);
  } finally {
    isSeoDataLoading.value = false;
  }
};

const checkSeoKey = (key) => {
  if (!isSeoDataLoaded.value) {
    return false;
  }

  return SeoData.value.find(item => item.key === key) || false;
};

export const useSeo = () => {
  return {
    getSeoData,
    checkSeoKey,
  };
};
