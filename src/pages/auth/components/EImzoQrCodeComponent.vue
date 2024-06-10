<script setup>
import { ref } from 'vue'
import useAuth from '@/store/auth.pinia.js'
import { EIMZOMobile } from '@/composables/e-imzo/mobile/e-imzo-mobile.js'

const emit = defineEmits(['onApprove'])

const authPinia = useAuth()

const loading = ref(false)
const qrVisible = ref(false)
const timeOut = ref()
const loadingText = ref('')

function initializeQR() {
  qrVisible.value = true
}

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

function callDeeplink(url) {
  window.open(url)
}

function makeAuth() {
  authPinia.makeAuth(
    (data) => {
      const eimzo = new EIMZOMobile(data?.siteId, 'qrcode')
      const result = eimzo.makeQRCode(data?.documentId, data?.challange)

      const qrCode = result[1]

      if (isMobileDevice()) {
        callDeeplink('eimzo://sign?qc=' + qrCode)
      }
    },
    () => {}
  )
}
</script>

<template></template>

<style scoped lang="scss"></style>
