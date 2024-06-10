<script setup>
import { onMounted, ref } from 'vue'

const value = defineModel('value')
const status = defineModel('status')

const props = defineProps({
  disabled: Boolean,
  status: String
})
const inputIndex = ref(null)
const digits = ref([])

const counterInput = () => {
  for (let i = 0; i < 6; i++) {
    digits.value.push('')
  }
}

const handlePaste = (e) => {
  const pasteData = e.clipboardData.getData('text')
  const onlyNumbers = pasteData.match(/^\d+$/)

  if (onlyNumbers) {
    digits.value = pasteData.split('')
    value.value = pasteData
  }
}
const handleInput = (e) => {
  if (new RegExp('^([0-9])$').test(e.data)) {
    digits.value[inputIndex.value] = e.data
    if (e.target.nextElementSibling) e.target.nextElementSibling.focus()
  }
  value.value = digits.value.join('')
}

const handleKeydown = (e) => {
  if (!new RegExp('^([0-9])$').test(e.key)) {
    e.preventDefault()
  }
  if (e.target.previousElementSibling && e.keyCode === 37) {
    e.target.previousElementSibling.focus()
    e.target.previousElementSibling.select()
  } else if (e.target.nextElementSibling && e.keyCode === 39) {
    e.target.nextElementSibling.focus()
    e.target.nextElementSibling.select()
  }
  if (e.key === 'Backspace') {
    digits.value[inputIndex.value] = ''
    if (e.target.previousElementSibling) {
      e.target.previousElementSibling.focus()
      e.target.previousElementSibling.select()
    }
  }
  value.value = digits.value.join('')
}

const handleFocus = (index) => {
  inputIndex.value = index
}
onMounted(() => {
  counterInput()
})
</script>

<template>
  <div
    class="otp-container p-2"
    @keydown="handleKeydown"
    @input="handleInput"
    @paste="handlePaste"
  >
    <a-input
      v-for="(item, i) in digits"
      :key="i"
      :disabled="disabled"
      @focus="handleFocus(i)"
      type="text"
      class="otp-item before"
      :class="[status, { highlighted: inputIndex === i }]"
      size="large"
      :value="item"
      :autofocus="i === 0"
      :status="status"
      placeholder="_"
      :maxlength="1"
    >
    </a-input>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';

.otp-container {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  max-width: 350px;

  .otp-item {
    position: relative;
    transition: all 0.2s ease-in-out;
    text-align: center;
    font-weight: 600;

    &::placeholder {
      font-weight: 700;
      font-size: 24px;
      color: rgb($body, 0.5);
    }
  }
}

.error {
  color: $danger;
  animation-name: error;
  animation-duration: 0.3s;

  &::placeholder {
    color: $danger !important;
  }
}

@keyframes error {
  25% {
    transform: translateX(2px);
  }
  50% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
