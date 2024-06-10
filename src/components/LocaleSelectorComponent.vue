<script setup>
import FlagEnglish from '@/components/flags/FlagEnglish.vue'
import FlagRussian from '@/components/flags/FlagRussian.vue'
import FlagUzbek from '@/components/flags/FlagUzbek.vue'
import { ref } from 'vue'

const selectedLocale = ref('uz')
</script>

<template>
  <a-select
    class="w-full bg-muted-opacity rounded-4 p-1"
    size="large"
    :bordered="false"
    v-model:value="selectedLocale"
  >
    <a-select-option value="uz">
      <span class="align-center">
        <FlagEnglish />
        <span class="justify-between mx-2 w-full">
          <span class="text-body">Язык</span>
          <span class="text-muted">O'zbek</span>
        </span>
      </span>
    </a-select-option>
    <a-select-option value="ru">
      <span class="align-center">
        <FlagRussian />
        <span class="justify-between mx-2 w-full">
          <span class="text-body">Язык</span>
          <span class="ml-2">Russian</span>
        </span>
      </span>
    </a-select-option>
    <a-select-option value="en">
      <span class="align-center">
        <FlagEnglish />
        <span class="justify-between mx-2 w-full">
          <span class="text-body">Язык</span>
          <span class="ml-2">English</span>
        </span>
      </span>
    </a-select-option>
    <a-select-option value="cr">
      <span class="align-center">
        <FlagUzbek />
        <span class="justify-between mx-2 w-full">
          <span class="text-body">Язык</span>
          <span class="ml-2">Kiril</span>
        </span>
      </span>
    </a-select-option>
  </a-select>
</template>

<style scoped lang="scss"></style>
