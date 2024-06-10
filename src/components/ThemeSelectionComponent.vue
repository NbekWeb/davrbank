<script setup>
import FlagEnglish from '@/components/flags/FlagEnglish.vue'
import { ref } from 'vue'
import IconLight from '@/components/icons/IconLight.vue'

const selectedLocale = ref('light')
</script>

<template>
  <a-select
    class="w-full bg-muted-opacity rounded-4 p-1"
    size="large"
    :bordered="false"
    v-model:value="selectedLocale"
  >
    <a-select-option value="light">
      <span class="align-center">
        <IconLight class="theme-icon text-2xl" />
        <span class="justify-between mx-2 w-full">
          <span class="text-body">Тема</span>
          <span class="text-muted">Светлое</span>
        </span>
      </span>
    </a-select-option>
  </a-select>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';

.theme-icon {
  color: $primary;
}
</style>
