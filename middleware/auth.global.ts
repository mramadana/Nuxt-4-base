
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  // Read auth cookie directly to avoid Pinia hydration timing issues
  const authCookie = useCookie<string | null>('auth');
  const authValue = authCookie.value;
  let isLoggedIn = false;

  if (typeof authValue === 'string') {
    try {
      const parsed = JSON.parse(authValue);
      isLoggedIn = Boolean(parsed?.isLoggedIn);
    } catch {
      isLoggedIn = false;
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/signuptoplan',
    '/auth/terms',
    '/auth/restorepassword',
    '/auth/restorepassword-check-code',
    '/auth/confirmpassword',
    '/auth/changephone',
    '/auth/activateaccount',
    "/"
  ];
  const currentPath = to.path.toLowerCase();
  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

  // If user is logged in and trying to access auth pages, redirect to home
  if (isLoggedIn && isPublicRoute) {
    return navigateTo('/');
  }

  // If user is not logged in and trying to access protected pages, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    return navigateTo('/Auth/login');
  }
});



