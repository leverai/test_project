<template>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>
    <div v-if="avatarUrl">
      <img :src="avatarUrl" alt="Avatar" class="avatar" />
    </div>
    <form @submit.prevent="uploadAvatar">
      <input type="file" @change="handleFileUpload" />
      <button type="submit">Upload Avatar</button>
    </form>
    <form @submit.prevent="">
      <button @click="logout">Logout</button>
    </form>
  </div>
</template>

<script setup>
import { useRuntimeConfig, useRouter } from 'nuxt/app';
import { ref } from 'vue';

const router = useRouter();
const config = useRuntimeConfig();
const avatarUrl = ref(null);
const selectedFile = ref(null);

// Текущий аватар пользователя
const fetchAvatar = async () => {
  var csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
  csrfToken = decodeURIComponent(csrfToken);
  const access_token = localStorage.getItem('access_token');
  try {
    const response = await $fetch(`${config.public.apiBase}/api/user`, {
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    avatarUrl.value = response.avatar ? `${config.public.apiBase}/storage/${response.avatar}` : null;
  } catch (error) {
    console.error('Failed to fetch user avatar', error);
  }
};

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadAvatar = async () => {
  if (!selectedFile.value) {
    alert('Please select a file');
    return;
  }
  var csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
  csrfToken = decodeURIComponent(csrfToken);
  const access_token = localStorage.getItem('access_token');

  const formData = new FormData();
  formData.append('avatar', selectedFile.value);

  try {
    const response = await $fetch(`${config.public.apiBase}/api/user/avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    avatarUrl.value = config.public.apiBase+response.avatar_url;
    alert('Avatar updated successfully');
  } catch (error) {
    console.error('Failed to upload avatar', error);
    alert('Failed to upload avatar');
  }
};
onMounted(fetchAvatar);

// Выход
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

<style>
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}
</style>