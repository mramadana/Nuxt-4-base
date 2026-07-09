<template>
  <div>
    <NuxtLayout>
      <div class="main_layout_app">
        <NuxtPage />
      </div>
    </NuxtLayout>
    <Toast />
  </div>
</template>

<script setup>
  
  import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
  import { getApp, getApps, initializeApp } from "firebase/app";
  import { getMessaging, getToken, onMessage } from "firebase/messaging";

  // Auth Store
  const authStore = useAuthStore();
  const { notificationToken, token, isLoggedIn } = storeToRefs(authStore);

  // Toast
  const { customToast } = toastMsg();

  // Axios
  const axios = useApi();
  const { response } = responseApi();

  // Function to call count-notifications API
  const getNotificationsCount = async () => {
    if (!isLoggedIn.value || !token.value) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    };

    try {
      const res = await axios.get('count-notifications', config);
      
      if (response(res) === "success") {
        const count = res.data.data.count;
        console.log('Notification count updated:', count);
        // Emit event to update notification count in header
        if (process.client) {
          window.dispatchEvent(new CustomEvent('notification-count-updated', {
            detail: { count: count }
          }));
        }
        return count;
      }
    } catch (err) {
      console.error('Error getting notification count:', err);
    }
  };

  // Function to refresh order details based on notification data
  const refreshOrderDetailsIfNeeded = async (payload) => {
    if (!payload?.data) return;

    // Check if type is blocked
    const type = payload.data.type || payload.type;
    if (type === 'blocked') {
      console.log('🚫 Blocked user notification received - logging out...');
      const router = useRouter();
      // Navigate to home page first
      router.push('/');
      // Call logoutHandler from store
      // await authStore.logoutHandler();
      return;
    }

    const { order_action, order_type, order_id, special_order_id, retrieval_order_id, retrieval_order_type } = payload.data;
    
    // Get current route
    const route = useRoute();
    const currentPath = route.path;
    const currentOrderId = route.params.id;

    // Handle normal order purchase - refresh data when on orderDetails page
    if (order_action === 'purchase' && order_type === 'normal_order') {
      console.log('🔄 Normal order purchase - refreshing order details... 5555');
      if (currentPath.includes('/orders/orderDetails/')) {
        window.dispatchEvent(new CustomEvent('refresh-order-details'));
      }
    }

    // Handle special order purchase - refresh data when on specialOrder page
    if (order_action === 'purchase' && order_type === 'special_order') {
      if (currentPath.includes('/Orders/specialOrder/')) {
        window.dispatchEvent(new CustomEvent('refresh-special-order-details'));
      }
    }
    
    // Handle retrieval orders (return orders)
    if (order_action === 'retrieval' && retrieval_order_id && currentOrderId && String(retrieval_order_id) === String(currentOrderId)) {
      
      if (order_type === 'normal' || retrieval_order_type === 'normal_order') {
        // Return order (normal) - orders/returnOrders/[id]
        if (currentPath.includes('/orders/returnOrders/')) {
          window.dispatchEvent(new CustomEvent('refresh-return-order-details'));
        }
      } else if (order_type === 'special' || retrieval_order_type === 'special_order') {
        // Return order (special) - orders/specialReturnOrders/[id]
        if (currentPath.includes('/Orders/specialReturnOrders/')) {
          window.dispatchEvent(new CustomEvent('refresh-special-return-order-details'));
        }
      }
    }
  };

  onMounted(() => {
    const firebaseConfig = {
  apiKey: "AIzaSyDe7kPfYxhXdn38eiNMDtKNWVLbgn66pLk",
  authDomain: "asas-wa-tamem.firebaseapp.com",
  projectId: "asas-wa-tamem",
  storageBucket: "asas-wa-tamem.firebasestorage.app",
  messagingSenderId: "807784913498",
  appId: "1:807784913498:web:bb88bd9a1abe2175f55663",
  measurementId: "G-5SSSRKEG81"
    };
  
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    isAnalyticsSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    });
  
  const messaging = getMessaging(app);
  
  // Handle foreground messages (when app is open)
  onMessage(messaging, async (payload) => {
    console.log('Message received. ', payload);
    payload.notification ?  customToast(payload.notification.title, 'info') : '';
    // Call count-notifications API every time a message is received
    // await getNotificationsCount();
    // Emit event to refresh notifications list if user is on notifications page
    if (process.client) {
      window.dispatchEvent(new CustomEvent('new-notification-received', {
        detail: { payload: payload }
      }));
      
      // Refresh order details if user is on the order details page
      refreshOrderDetailsIfNeeded(payload);
    }
  });

  // Listen for messages from service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', async (event) => {
      // Handle background message - call API directly
      if (event.data && event.data.type === 'FCM_BACKGROUND_MESSAGE' && event.data.action === 'CALL_COUNT_API') {
        console.log('Background message received - calling count-notifications API');
        // await getNotificationsCount();
        // Emit event to refresh notifications list if user is on notifications page
        if (process.client) {
          window.dispatchEvent(new CustomEvent('new-notification-received', {
            detail: { payload: event.data }
          }));
        }
      }
    });
  }

  getToken(messaging, { vapidKey: 'BBGi6Ezns4e6TV14TadmlU7LxUOWpqFF-MZ9WGyq9s_Ks3Qe7Y-GfFEqKrN8hMnMrsWDv4_oanEk62LUqoY41wI' }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      console.log('currentToken', currentToken);
      notificationToken.value = currentToken;
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });

  });


</script>

<style>
.main_layout_app {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
