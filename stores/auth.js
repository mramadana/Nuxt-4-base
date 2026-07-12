import { defineStore } from "pinia";

const axios = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = useApi();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  },
);

const response = (...args) => responseApi().response(...args);

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      phone: "",
      country_code: "",
    },
    token: null,
    isLoggedIn: false,
    newPhone: null,
    mac_address: null,
    notificationToken: null,
    test: 'test key',
    currentemail: null,
    currentPasword: null,
    needActive: false,
    cartVal: 0,
    Globaldialog: false,
    returnRequests: false,
    termsContentText: null,
    privacyContentText: null,
    countries: [],
    isCountriesLoaded: false,
    isCountriesLoading: false,
    social: [],
    aboutData: null,
    updateNotificationCount: 0
  }),
  actions: {
    removeAuth() {
      this.token = null;
      this.isLoggedIn = false;
      this.needActive = false;
      this.newPhone = null;
      this.currentemail = null;
      this.currentPasword = null;
      this.notificationToken = null;
      this.user = {
        phone: "",
        country_code: "",
      };
    },


    // Sign In
    async signInHandler(formData) {
      try {
        if (process.client && formData instanceof FormData) {
          if (!formData.has("device_id")) formData.append("device_id", this.notificationToken);
          if (!formData.has("device_type")) formData.append("device_type", "web");
          if (!formData.has("lang")) formData.append("lang", localStorage.getItem("locale") || "ar");
        }

        const resData = await axios.post("provider/sign-in", formData, {
          headers: {
            Lang: process.client ? localStorage.getItem("locale") : undefined,
          },
        });

        if (resData.data.key == "needActive") {
          this.needActive = true;
          this.user = resData.data.data;
        } else {
          this.needActive = false;
        }

        if (response(resData) == "success") {
          this.user = resData.data.data;
          this.token = resData.data.data.token;
          this.isLoggedIn = true; 
          return { status: "success", msg: resData.data.msg };
        } else {
          return { status: "error", msg: resData.data.msg || "Login failed" };
        }
      } catch (error) {
        console.error("Login error:", error);

        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const errorMsg = error.response.data?.msg || error.response.data?.message || "Server error occurred";
          return { status: "error", msg: errorMsg };
        } else if (error.request) {
          // Network error
          return { status: "error", msg: "Network error. Please check your connection." };
        } else {
          // Other errors
          return { status: "error", msg: error.message || "An unexpected error occurred" };
        }
      }
    },

    // Sign Up
    async signUpHandler(formData) {
      try {
        const resData = await axios.post("provider/sign-up", formData);
        if (response(resData) == "success") {
          this.user = resData.data.data;
          return { status: "success", msg: resData.data.msg };
        } else {
          return { status: "error", msg: resData.data.msg };
        }
      } catch (error) {
        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const errorMsg = error.response.data?.msg || error.response.data?.message || "Server error occurred";
          return { status: "error", msg: errorMsg };
        } else if (error.request) {
          // Network error
          return { status: "error", msg: "Network error. Please check your connection." };
        } else {
          // Other errors
          return { status: "error", msg: error.message || "An unexpected error occurred" };
        }
      }
    },

    // Verification Code
    async verificationHandler(formData , endpoint) {

      console.log(endpoint);
      try {

        const resData = await axios.post(endpoint, formData);
        if (response(resData) == "success") {
          if(endpoint === "provider/activate?_method=patch") {
            if (resData.data.data?.token) {
              this.token = resData.data.data.token;
              this.user = resData.data.data;
              this.isLoggedIn = true;
            }
          }
          return { status: "success", msg: resData.data.msg };
        } else {
          return { status: "error", msg: resData.data.msg };
        }
      } catch (error) {
        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const errorMsg = error.response.data?.msg || error.response.data?.message || "Server error occurred";
          return { status: "error", msg: errorMsg };
        } else if (error.request) {
          // Network error
          return { status: "error", msg: "Network error. Please check your connection." };
        } else {
          // Other errors
          return { status: "error", msg: error.message || "An unexpected error occurred" };
        }
      }

    },

    // update Profile
    async profileHandler(formData) {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      try {
        const resData = await axios.post(
          "profile/update?_method=PUT",
          formData,
          config
        );
        if (response(resData) == "success") {
          this.user = resData.data.data;
          return { status: "success", msg: resData.data.msg };

        } else {
          return { status: "error", msg: resData.data.msg };
        }
      } catch (error) {
        console.error("profileHandler error:", error);
        // Rethrow so the caller (e.g., settings.vue) can display a toast with detailed message
        throw error;
      }
    },

    // New Phone
    async phoneHandler(formData, newPhone) {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      const resData = await axios.post(
        "change-phone-send-code",
        formData,
        config
      );
      if (response(resData) == "success") {
        this.newPhone = newPhone;
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }
    },

    // Logout
    async logoutHandler() {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      const resData = await axios.delete("provider/sign-out", config, {
        headers: {
          Lang: localStorage.getItem("locale"),
        },
      });
      if (
        response(resData) == "success" ||
        response(resData) == "blocked" ||
        response(resData) == "unauthenticated"
      ) {
        this.token = null;
        this.user = {
          phone: "",
          country_code: "",
        };
        this.isLoggedIn = false;
        this.needActive = false;
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }

    },

    // delete account
    async deleteAccountHandler() {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      const resData = await axios.delete("provider/delete-account", config);
      if (
        response(resData) == "success" ||
        response(resData) == "blocked" ||
        response(resData) == "unauthenticated"
      ) {
        this.token = null;
        this.needActive = false;
        this.user = {
          phone: "",
          country_code: "",
          image: null,
          email: null,
          name: null
        };
        this.isLoggedIn = false;
        // navigateTo('/');
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }
    },

    // chnage mail
    async changeMailHandler(formData, currentemail, currentPasword) {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };

      const resData = await axios.post(
        "change-email-send-code",
        formData,
        config
      );
      if (response(resData) == "success") {
        this.currentemail = currentemail;
        this.currentPasword = currentPasword;
        navigateTo('/emailActivateCode');
        return { status: "success", msg: resData.data.msg };
      } else {
        return { status: "error", msg: resData.data.msg };
      }
    },

    // get mac_address 

    checkMacAddress() {
      if (!localStorage.getItem("mac_address")) {
        const ma = Math.random().toString(36).substring(2, 9);
        localStorage.setItem("mac_address", ma);
        this.mac_address = ma;
      } else {
        this.mac_address = localStorage.getItem("mac_address");
      }
    },

    // get Countries
    async getCountriesHandler() {

      // check if countries are already loaded
      if (this.isCountriesLoaded || this.isCountriesLoading) {
        return { status: "success", data: this.countries };
      }

      try {

        this.isCountriesLoading = true;
        // Get the Lang value from localStorage
        const lang = localStorage.getItem('locale');
        const res = await axios.get("countries", {
          headers: {
            'Lang': lang
          }
        });
        if (response(res) == "success") {
          this.countries = res.data.data;
          this.isCountriesLoaded = true;
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error(error);
        return { status: "error", msg: error.message };
      } finally {
        this.isCountriesLoading = false;
      }
    },

    // Method to fetch social data
    async fetchSocialData() {
      if (this.isSocialLoaded || this.isSocialLoading) {
        return { status: "success", data: this.social };
      }

      try {
        this.isSocialLoading = true;
        const { response } = responseApi();
        const axios = useApi();

        const res = await axios.get('socials');
        if (response(res) === "success") {
          this.social = res.data.data;
          this.isSocialLoaded = true;
        } else {
          console.error("Failed to fetch social data:", res.data.msg);
        }
      } catch (error) {
        console.error("Error fetching social data:", error.message);
      } finally {
        this.isSocialLoading = false;
      }
    },

    // Get Terms
    async getTermsHandler() {
      await axios.get(`terms/users-terms`).then(res => {
        if (response(res) == "success") {
          this.termsContentText = res.data.data;
        }
      }).catch(err => {
        console.error(err);
      });
    },

    // Get Privacy Policy
    async getPrivacyHandler() {
      await axios.get(`privacy`).then(res => {
        if (response(res) == "success") {
          this.privacyContentText = res.data.data.content;
        }
      }).catch(err => {
        console.error(err);
      });
    },

  },
  persist: {
    // storage: process.client ? localStorage : "",
    storage: persistedState.cookiesWithOptions({
      sameSite: "strict",
    }),
  },
});
