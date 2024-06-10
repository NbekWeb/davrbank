<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useKey from '@/composables/e-imzo/web/useKey.js'
import useCore from '@/store/core.pinia.js'

const [keys, pkcs7_64, getItem] = useKey()
const corePinia = useCore()
const { eimzoError } = storeToRefs(corePinia)

const emits = defineEmits(['sign', 'cancel'])
const props = defineProps({
  hash: {
    type: Object
  }
})
const selectedKeyModel = defineModel('eriKey')
const loading = defineModel('loading', { default: false })

const error = ref()
const open = ref(false)
const selectedKey = ref()

const key = computed(() =>
  keys.value.find((key) => key.serialNumber === selectedKey.value)
)

const generatePkcs7 = () => {
  loading.value = true
  error.value = null
  pkcs7_64.value = null
  const a = keys.value?.filter((k) => k.serialNumber === selectedKey.value)
  getItem({
    ...a[0],
    UUID: JSON.stringify(props.hash)
  })
}

function handleChangeSelect() {
  selectedKeyModel.value = selectedKey.value
  error.value = null
}

watch(pkcs7_64, () => {
  loading.value = false
  if (
    pkcs7_64.value === 'error' ||
    pkcs7_64.value === 'ERI_PASSWORD_ENTRY_CANCELED' ||
    pkcs7_64.value === 'ERI_INVALID_PASSWORD'
  ) {
    error.value = pkcs7_64.value
  } else if (pkcs7_64.value) {
    console.log(pkcs7_64.value)
    emits('sign', pkcs7_64.value)
  }
})
defineExpose({
  generatePkcs7
})
</script>

<template>
  <a-card
    class="eimzo-component m-4"
    :class="[
      { danger: eimzoError || key?.expired || error },
      { 'eimzo-success': key && !key?.expired }
    ]"
  >
    <div v-show="!selectedKey" class="eimzo-icon">
      <svg
        class="eimzo-icon-svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          :class="{ 'eimzo-icon-svg-danger': eimzoError || error }"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.98413 0C3.1269 0 0 3.12694 0 6.98413V17.7778C0 17.9531 0.142132 18.0952 0.31746 18.0952H2.53968C2.71501 18.0952 2.85714 17.9531 2.85714 17.7778V9.84127C2.85714 5.98408 5.98404 2.85714 9.84127 2.85714H30.1587C34.016 2.85714 37.1429 5.98408 37.1429 9.84127V17.7778C37.1429 17.9531 37.285 18.0952 37.4603 18.0952H39.6825C39.8579 18.0952 40 17.9531 40 17.7778V6.98413C40 3.12694 36.8731 0 33.0159 0H6.98413ZM40 22.2222C40 22.0469 39.8579 21.9048 39.6825 21.9048H37.4603C37.285 21.9048 37.1429 22.0469 37.1429 22.2222V30.1587C37.1429 34.0159 34.016 37.1429 30.1587 37.1429H9.84127C5.98404 37.1429 2.85714 34.0159 2.85714 30.1587V22.2222C2.85714 22.0469 2.71501 21.9048 2.53968 21.9048H0.31746C0.142132 21.9048 0 22.0469 0 22.2222V33.0159C0 36.8731 3.1269 40 6.98413 40H33.0159C36.8731 40 40 36.8731 40 33.0159V22.2222ZM30.1587 3.1746H9.84127C6.15937 3.1746 3.1746 6.1594 3.1746 9.84127V17.7778C3.1746 17.9531 3.31674 18.0952 3.49206 18.0952H4.59947C4.75961 18.0952 4.8944 17.9752 4.91714 17.8167C5.97618 10.4352 12.3256 4.7619 20 4.7619C27.6745 4.7619 34.0238 10.4352 35.0829 17.8167C35.1056 17.9752 35.2404 18.0952 35.4005 18.0952H36.5079C36.6833 18.0952 36.8254 17.9531 36.8254 17.7778V9.84127C36.8254 6.1594 33.8406 3.1746 30.1587 3.1746ZM32.8322 18.0952C33.0254 18.0952 33.174 17.9235 33.1414 17.733C32.0651 11.449 26.591 6.66667 20 6.66667C13.409 6.66667 7.93494 11.449 6.8586 17.733C6.82598 17.9235 6.97458 18.0952 7.16779 18.0952H9.43209C9.5853 18.0952 9.7162 17.9853 9.7477 17.8354C10.745 13.0882 14.9562 9.52381 20 9.52381C25.0438 9.52381 29.255 13.0882 30.2523 17.8354C30.2838 17.9853 30.4147 18.0952 30.5679 18.0952H32.8322ZM6.8586 22.267C6.82598 22.0765 6.97458 21.9048 7.16779 21.9048H9.43209C9.5853 21.9048 9.7162 22.0147 9.7477 22.1646C10.745 26.9118 14.9562 30.4762 20 30.4762C25.0438 30.4762 29.255 26.9118 30.2523 22.1646C30.2838 22.0147 30.4147 21.9048 30.5679 21.9048H32.8322C33.0254 21.9048 33.174 22.0765 33.1414 22.267C32.0651 28.551 26.591 33.3333 20 33.3333C13.409 33.3333 7.93494 28.551 6.8586 22.267ZM4.59947 21.9048C4.75961 21.9048 4.8944 22.0248 4.91714 22.1833C5.97618 29.5648 12.3256 35.2381 20 35.2381C27.6745 35.2381 34.0238 29.5648 35.0829 22.1833C35.1056 22.0248 35.2404 21.9048 35.4005 21.9048H36.5079C36.6833 21.9048 36.8254 22.0469 36.8254 22.2222V30.1587C36.8254 33.8406 33.8406 36.8254 30.1587 36.8254H9.84127C6.15937 36.8254 3.1746 33.8406 3.1746 30.1587V22.2222C3.1746 22.0469 3.31674 21.9048 3.49206 21.9048H4.59947ZM20 26.6667C23.6819 26.6667 26.6667 23.6819 26.6667 20C26.6667 16.3181 23.6819 13.3333 20 13.3333C16.3181 13.3333 13.3333 16.3181 13.3333 20C13.3333 23.6819 16.3181 26.6667 20 26.6667ZM19.3651 18.0952C18.3131 18.0952 17.4603 18.948 17.4603 20C17.4603 21.052 18.3131 21.9048 19.3651 21.9048H22.381C22.5563 21.9048 22.6984 22.0469 22.6984 22.2222V22.8571C22.6984 23.0325 22.5563 23.1746 22.381 23.1746H19.3651C17.6118 23.1746 16.1905 21.7533 16.1905 20C16.1905 18.2467 17.6118 16.8254 19.3651 16.8254H22.381C22.5563 16.8254 22.6984 16.9675 22.6984 17.1429V17.7778C22.6984 17.9531 22.5563 18.0952 22.381 18.0952H19.3651ZM22.5397 20.3175C22.5397 20.4928 22.3976 20.6349 22.2222 20.6349H19.6825C19.5072 20.6349 19.3651 20.4928 19.3651 20.3175V19.6825C19.3651 19.5072 19.5072 19.3651 19.6825 19.3651H22.2222C22.3976 19.3651 22.5397 19.5072 22.5397 19.6825V20.3175Z"
          fill="#9BA2B1"
        />
      </svg>
      <template v-if="eimzoError">
        <p :class="{ 'text-danger': eimzoError || error }">
          <template
            v-if="eimzoError?.reason === 'API-key для домена недействителен.'"
          >
            {{ eimzoError.reason }}
          </template>
          <template v-else>
            {{ $t('installEriModule') }}
          </template>
        </p>
      </template>
      <template v-else>
        <p :class="{ 'text-danger': eimzoError || error }">
          {{ $t('selectEriKey') }}
        </p>
      </template>
    </div>
    <a-select
      v-model:value="selectedKey"
      @dropdown-visible-change="open = !open"
      @change="handleChangeSelect"
      allow-clear
      class="eimzo-select"
      size="large"
      :disabled="!keys.length"
      :loading="!eimzoError && !keys.length"
      :bordered="false"
      popup-class-name="eimzo-select-popup"
    >
      <a-select-option
        v-for="key in keys"
        :class="[{ 'expired-option': eimzoError || key.expired }]"
        :disabled="key.expired"
        :key="key.serialNumber"
        :value="key.serialNumber"
      >
        <div class="eimzo-select-option p-0">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              :class="{ 'expired-svg': key?.expired || error }"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.98413 0C3.1269 0 0 3.12694 0 6.98413V17.7778C0 17.9531 0.142132 18.0952 0.31746 18.0952H2.53968C2.71501 18.0952 2.85714 17.9531 2.85714 17.7778V9.84127C2.85714 5.98408 5.98404 2.85714 9.84127 2.85714H30.1587C34.016 2.85714 37.1429 5.98408 37.1429 9.84127V17.7778C37.1429 17.9531 37.285 18.0952 37.4603 18.0952H39.6825C39.8579 18.0952 40 17.9531 40 17.7778V6.98413C40 3.12694 36.8731 0 33.0159 0H6.98413ZM40 22.2222C40 22.0469 39.8579 21.9048 39.6825 21.9048H37.4603C37.285 21.9048 37.1429 22.0469 37.1429 22.2222V30.1587C37.1429 34.0159 34.016 37.1429 30.1587 37.1429H9.84127C5.98404 37.1429 2.85714 34.0159 2.85714 30.1587V22.2222C2.85714 22.0469 2.71501 21.9048 2.53968 21.9048H0.31746C0.142132 21.9048 0 22.0469 0 22.2222V33.0159C0 36.8731 3.1269 40 6.98413 40H33.0159C36.8731 40 40 36.8731 40 33.0159V22.2222ZM30.1587 3.1746H9.84127C6.15937 3.1746 3.1746 6.1594 3.1746 9.84127V17.7778C3.1746 17.9531 3.31674 18.0952 3.49206 18.0952H4.59947C4.75961 18.0952 4.8944 17.9752 4.91714 17.8167C5.97618 10.4352 12.3256 4.7619 20 4.7619C27.6745 4.7619 34.0238 10.4352 35.0829 17.8167C35.1056 17.9752 35.2404 18.0952 35.4005 18.0952H36.5079C36.6833 18.0952 36.8254 17.9531 36.8254 17.7778V9.84127C36.8254 6.1594 33.8406 3.1746 30.1587 3.1746ZM32.8322 18.0952C33.0254 18.0952 33.174 17.9235 33.1414 17.733C32.0651 11.449 26.591 6.66667 20 6.66667C13.409 6.66667 7.93494 11.449 6.8586 17.733C6.82598 17.9235 6.97458 18.0952 7.16779 18.0952H9.43209C9.5853 18.0952 9.7162 17.9853 9.7477 17.8354C10.745 13.0882 14.9562 9.52381 20 9.52381C25.0438 9.52381 29.255 13.0882 30.2523 17.8354C30.2838 17.9853 30.4147 18.0952 30.5679 18.0952H32.8322ZM6.8586 22.267C6.82598 22.0765 6.97458 21.9048 7.16779 21.9048H9.43209C9.5853 21.9048 9.7162 22.0147 9.7477 22.1646C10.745 26.9118 14.9562 30.4762 20 30.4762C25.0438 30.4762 29.255 26.9118 30.2523 22.1646C30.2838 22.0147 30.4147 21.9048 30.5679 21.9048H32.8322C33.0254 21.9048 33.174 22.0765 33.1414 22.267C32.0651 28.551 26.591 33.3333 20 33.3333C13.409 33.3333 7.93494 28.551 6.8586 22.267ZM4.59947 21.9048C4.75961 21.9048 4.8944 22.0248 4.91714 22.1833C5.97618 29.5648 12.3256 35.2381 20 35.2381C27.6745 35.2381 34.0238 29.5648 35.0829 22.1833C35.1056 22.0248 35.2404 21.9048 35.4005 21.9048H36.5079C36.6833 21.9048 36.8254 22.0469 36.8254 22.2222V30.1587C36.8254 33.8406 33.8406 36.8254 30.1587 36.8254H9.84127C6.15937 36.8254 3.1746 33.8406 3.1746 30.1587V22.2222C3.1746 22.0469 3.31674 21.9048 3.49206 21.9048H4.59947ZM20 26.6667C23.6819 26.6667 26.6667 23.6819 26.6667 20C26.6667 16.3181 23.6819 13.3333 20 13.3333C16.3181 13.3333 13.3333 16.3181 13.3333 20C13.3333 23.6819 16.3181 26.6667 20 26.6667ZM19.3651 18.0952C18.3131 18.0952 17.4603 18.948 17.4603 20C17.4603 21.052 18.3131 21.9048 19.3651 21.9048H22.381C22.5563 21.9048 22.6984 22.0469 22.6984 22.2222V22.8571C22.6984 23.0325 22.5563 23.1746 22.381 23.1746H19.3651C17.6118 23.1746 16.1905 21.7533 16.1905 20C16.1905 18.2467 17.6118 16.8254 19.3651 16.8254H22.381C22.5563 16.8254 22.6984 16.9675 22.6984 17.1429V17.7778C22.6984 17.9531 22.5563 18.0952 22.381 18.0952H19.3651ZM22.5397 20.3175C22.5397 20.4928 22.3976 20.6349 22.2222 20.6349H19.6825C19.5072 20.6349 19.3651 20.4928 19.3651 20.3175V19.6825C19.3651 19.5072 19.5072 19.3651 19.6825 19.3651H22.2222C22.3976 19.3651 22.5397 19.5072 22.5397 19.6825V20.3175Z"
              fill="#34C759"
            />
          </svg>
          <div class="eimzo-info mx-2">
            <span class="pnfl">
              {{ key.PINFL }}
            </span>
            <p class="line-clamp m-0 organization">{{ key.O }}</p>
            <span class="user">{{ key.CN }} </span>
          </div>
        </div>
      </a-select-option>
    </a-select>
    <span class="eimzo-error-message" :class="{ 'on-error': error }">
      {{ error ? $t(error?.toLowerCase()) : '' }}
    </span>
  </a-card>
</template>

<style lang="scss">
@import '@/assets/styles/variable';

.eimzo-component {
  width: 100%;
  max-width: 435px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease-in-out;
  position: relative;

  .ant-card-body {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 0;
    position: relative;

    .ant-select-selector {
      padding-left: 0 !important;
      height: 56px !important;
      border: none;

      .ant-select-selection-item {
        display: flex;
        align-items: center;
      }

      .expired-svg {
        fill: $danger !important;
      }
    }

    .eimzo-icon {
      display: flex;
      align-items: center;
      gap: 8px;
      position: absolute;
      left: 8px;
      bottom: 8px;

      p {
        margin: 0;
        font-size: 16px;
        line-height: 18px;
        color: $muted;
      }
    }

    .eimzo-error-message {
      position: absolute;
      bottom: -5px;
      left: 8px;
      line-height: normal;
      opacity: 0;
      color: $danger;
      transition: all 0.3s ease-in-out;
    }

    .on-error {
      opacity: 1;
      transform: translateY(15px);
    }
  }

  .eimzo-select {
    min-width: 300px;
    width: 100%;
  }
}

.eimzo-select-popup {
  width: 100%;
  padding: 8px;
}

.eimzo-select-option {
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;

  .eimzo-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    line-height: normal;

    .pnfl {
      font-size: 12px;
      color: $muted;
    }

    .user {
      font-size: 8px;
      color: $muted;
    }

    .organization {
      font-size: 16px;
      font-weight: 600;
      line-height: 18px;
      color: $body;
    }
  }
}

.eimzo-icon-svg {
  display: block;
  transition: all 0.3s ease-in-out;
}

.eimzo-success {
  border-color: $success !important;
}

.eimzo-icon-svg-danger {
  fill: $danger !important;
}

.danger {
  border-color: $danger !important;
}

.expired-option {
  filter: grayscale(100%);
}

.cared-down-icon {
  font-size: 24px;
  transition: all 0.3s ease-in-out;
  margin-left: 2px;
}

.open {
  transform: rotate(180deg);
}
</style>
