<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label>Name</label>
        <input v-model="name" type="text" required />
      </div>
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Register</button>
      <button class="link-button" @click="goToLogin">Already have an account? Login</button>
    </form>
  </div>
</template>

<script setup>
import { useRuntimeConfig, useRouter } from 'nuxt/app';
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const config = useRuntimeConfig();

const register = async () => {
  try {
    // Получаем CSRF-cookie
    console.log('Requesting CSRF cookie...');
    await $fetch(`${config.public.apiBase}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    });
    var csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    csrfToken = decodeURIComponent(csrfToken);

    // Отправляем запрос регистрации
    console.log('Sending registration data...');
    const response = await $fetch(`${config.public.apiBase}/api/register`, {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
      },
    });

    alert('Registration successful');
    router.push('/login');
  } catch (error) {
    if (error.response && error.response._data) {
      var report = ""
      for (var k in error.response._data.errors){
        report +=`${error.response._data.errors[k][0]} `
      }
      alert(report)
    } else {
      console.error('Registration failed');
    }
  }
};
const goToLogin = () => {
  router.push('/login');
};
</script>
