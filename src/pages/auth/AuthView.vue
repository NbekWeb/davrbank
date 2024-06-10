<script setup></script>

<template>
  <div class="p-4 h-screen">
    <a-row :gutter="[20, 0]" class="h-full">
      <a-col :span="14">
        <a-card class="bg-muted-opacity h-full rounded-4" :bordered="false">
          Carousel
        </a-card>
      </a-col>
      <a-col :span="10" class="h-full">
        <div class="view h-full px-2">
          <router-view />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';

.view {
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 2px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    //box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: rgb($primary, 0.3);
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: rgb($primary, 0.3);
  }
}
</style>
