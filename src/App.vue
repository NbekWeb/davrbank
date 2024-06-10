<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { message } from 'ant-design-vue'
import theme from '@/utils/ant/theme.js'
import useCore from '@/store/core.pinia.js'

const { t } = useI18n()
const corePinia = useCore()
const { redirectUrl, toastContent } = storeToRefs(corePinia)
const router = useRouter()
watch(redirectUrl, () => {
  if (redirectUrl.value && redirectUrl.value !== '') {
    router.push(`${redirectUrl.value}`)
    corePinia.redirect(null)
  }
})

watch(toastContent, () => {
  if (toastContent.value) {
    const toastMessage = toastContent.value?.message
    const type = toastContent.value?.type || 'success'
    const localeMessage = toastContent.value?.locale

    if (type === 'error') {
      return message.error(toastMessage ? toastMessage : t(`${localeMessage}`))
    }
    if (type === 'success') {
      message.success(toastMessage ? toastMessage : t(`${localeMessage}`))
    }
    if (type === 'info') {
      message.info(toastMessage ? toastMessage : t(`${localeMessage}`))
    }
    if (type === 'warning') {
      message.warning(toastMessage ? toastMessage : t(`${localeMessage}`))
    }
  }
})
</script>

<template>
  <a-config-provider :theme="theme">
    <router-view />
  </a-config-provider>
</template>

<style scoped></style>
