<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/app/bank')
}
</script>

<template>
  <div class="error-page">
    <h1 class="error-code">500</h1>
    <p class="error-sub-title">Server bilan bog'liq xatolik</p>
    <a-button @click="goHome" type="primary" size="large"> Go Home</a-button>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.error-code {
  font-weight: bolder;
  font-size: 120px;
  color: #0020c2;
}

.error-sub-title {
  font-size: 32px;
  font-weight: 500;
}
</style>
