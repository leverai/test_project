export default defineNuxtRouteMiddleware((to, from) => {
  // const token = useCookie('XSRF-TOKEN').value;
  // if (!token && to.path !== '/login' && to.path !== '/register') {
  //   return navigateTo('/login');
  // }
  if (import.meta.client) {
    const token = localStorage.getItem('access_token');

    if (to.name === 'login' && token) {
      // Если пользователь авторизован и пытается открыть login, перенаправляем на dashboard
      return navigateTo('/dashboard');
    }

    if (to.name === 'dashboard' && !token) {
      // Если пользователь не авторизован, перенаправляем на login
      return navigateTo('/login');
    }
  }
});
