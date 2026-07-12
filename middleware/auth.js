
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const { isLoggedIn, Globaldialog, returnRequests } = storeToRefs(authStore);

  // General Orders (myorders)
  if (to.path === '/myorders' || to.path === '/myorders/purchaseOrders') {
    if (to.path !== '/myorders/purchaseOrders/new') {
      returnRequests.value = false;
      return navigateTo('/myorders/purchaseOrders/new');
    }
  }

  if (to.path === '/myorders/returnOrders') {
    if (to.path !== '/myorders/returnOrders/news') {
      returnRequests.value = true;
      return navigateTo('/myorders/returnOrders/news');
    }
  }

  // Private Orders (specialOrder)
  if (to.path === '/specialOrder' || to.path === '/specialOrder/purchaseOrders') {
    if (to.path !== '/specialOrder/purchaseOrders/waitPriceOffer') {
      returnRequests.value = false;
      return navigateTo('/specialOrder/purchaseOrders/waitPriceOffer');
    }
  }

  if (to.path === '/specialOrder/returnOrders') {
    if (to.path !== '/specialOrder/returnOrders/news') {
      returnRequests.value = true;
      return navigateTo('/specialOrder/returnOrders/news');
    }
  }

  if (!isLoggedIn.value && to.meta.middleware == "auth") {
    Globaldialog.value = true;
    return navigateTo("/");
  }

  if (to.fullPath == from.fullPath && isLoggedIn.value == true && to.meta.middleware == "auth") {
    return navigateTo(`${from.fullPath}`);
  }
});


