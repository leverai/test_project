export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const token = localStorage.getItem('access_token');

    // Если пользователь авторизован
    if (token) {
      if (to.path === '/' || to.name === 'login' || to.name === 'register') {
        return navigateTo('/dashboard');
      }
    } else {
      // Если пользователь не авторизован
      if (to.path === '/' || to.name === 'dashboard') {
        return navigateTo('/login');
      }
    }
  }
});