<template>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>
    <form @submit.prevent="">
      <button @click="logout">Logout</button>
    </form>
  </div>
</template>

<script setup>
import { useRuntimeConfig, useRouter } from 'nuxt/app';

const router = useRouter();
const config = useRuntimeConfig();

const logout = async () => {
  try {
    var csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    csrfToken = decodeURIComponent(csrfToken);
    const access_token = localStorage.getItem('access_token');
    await $fetch(`${config.public.apiBase}/api/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    localStorage.removeItem('access_token');

    router.push('/login');
  } catch (error) {
    alert('Logout failed');
  }
};
</script>
