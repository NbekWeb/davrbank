<script setup>
import OtpInputComponent from '@/components/OtpInputComponent.vue'
import EimzoComponent from '@/components/EimzoComponent.vue'
import { ref } from 'vue'

const value = ref()
const status = ref()
const eriRef = ref()
const eriKey = ref()

function handleSign() {
  eriRef.value?.generatePkcs7()
}

async function handleEmitSign(pkcs7) {
  console.log(pkcs7)
}
</script>

<template>
  <div class="p-4"></div>
</template>

<style scoped lang="scss"></style>
