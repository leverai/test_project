<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
      <button class="link-button" @click="goToRegister">Don't have an account? Register</button>
    </form>
  </div>
</template>

<script setup>
import { useRuntimeConfig, useRouter } from 'nuxt/app';
import { ref, onMounted } from 'vue';

const email = ref('');
const password = ref('');
const router = useRouter();
const config = useRuntimeConfig();

const login = async () => {
  try {
    await $fetch(`${config.public.apiBase}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    });
    var csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    csrfToken = decodeURIComponent(csrfToken);

    const response = await $fetch(`${config.public.apiBase}/api/login`, {
      method: 'POST',
      body: { email: email.value, password: password.value },
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
      },
    });
    
    const { access_token } = response;
    localStorage.setItem('access_token', access_token);

    router.push('/dashboard');
  } catch (error) {
    if (error.response && error.response._data) {
      console.error(`Error: ${error.response._data.message}`);
    } else {
      console.error('Login failed');
    }
  }
};

const goToRegister = () => {
  router.push('/register');
};

onMounted(() => {
  const token = localStorage.getItem('access_token');
  if (token) {
    router.push('/dashboard');
  }
});
</script>
