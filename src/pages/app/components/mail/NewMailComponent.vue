<script setup>
import useMail from '@/store/mails.pinia.js'
import useMailType from '@/store/mailsType.pinia.js'
import useCore from '@/store/core.pinia.js'
import useModal from '@/store/modal.pinia.js'
import useBank from '@/store/bank.pinia.js'
import useFile from '@/store/file.pinia.js'
import { useI18n } from 'vue-i18n'

import { message } from 'ant-design-vue'

import IconPaperClip from '@/components/icons/IconPaperClip.vue'
import IconPlus from '@/components/icons/IconPlus.vue'

import { storeToRefs } from 'pinia'

import { onMounted, ref, reactive } from 'vue'

import ModalCardComponent from '@/components/ModalCardComponent.vue'

const { t } = useI18n()
const organizationName = ref('')
const fileProgress = ref(0)


const hashId = ref(null)

const mailPinia = useMail()
const mailTypePinia = useMailType()
const corePinia = useCore()
const modalPinia = useModal()
const bankPinia = useBank()
const filePinia = useFile()

const { loadingUrl } = storeToRefs(corePinia)
const { branchList } = storeToRefs(bankPinia)
const { allMailType } = storeToRefs(mailTypePinia)

const props = defineProps({ modalKey: String })

const filesName = ref([])
const formRef = ref()

const formState = reactive({
  branchId: null,
  typeId: null,
  files: []
})

const rules = {
  branchId: [
    {
      required: true,
      message: 'Пожалуйста, выберите Наименование!',
      trigger: 'change'
    }
  ],
  typeId: [
    {
      required: true,
      message: 'Пожалуйста, выберите получатель!',
      trigger: 'change'
    }
  ]
}

const uploadFile = (file) => {
  if (file.size / 1024 / 1024 > 20) {
    corePinia.setToast({
      type: 'error',
      message: 'Размер файла не должен превышать 20 МБ!'
    })
  } else {
    filePinia.upload(
      file,
      (data) => {
        formState.files.push({ hashId: data.hashId, name: file.name })
        fileProgress.value = 0
      },
      (progress) => {
        fileProgress.value = progress
      }
    )
    return false
  }
}

function handleCloseFile(index) {
  formState.files.splice(index, 1)
}

function submitForm() {
  formRef.value.validate().then(() => {
    mailPinia.createMail(
      {
        branchId: formState.branchId,
        typeId: formState.typeId,
        files: formState.files.map((item) => item?.hashId)
      },
      () => {
        formState.branchId = null
        formState.typeId = null
        formState.files = []
        formRef.value.resetFields()
        message.success(t('mails_component.appeal_added'))
      }
    )
  })
}

onMounted(() => {
  organizationName.value = JSON.parse(
    localStorage.getItem('organization')
  ).organizationName
  bankPinia.getAllBranch('BRANCH')
  mailTypePinia.getAllMailType()
})
</script>

<template>
  <modal-card-component
    :modal-key="modalKey"
    :title="$t('mails_component.new_appeal')"
    :description="organizationName"
    class="mailsWraper"
  >
    <template #body>
      <div class="w-full pt-4 mail-body">
        <a-form
          layout="vertical"
          ref="formRef"
          :model="formState"
          :rules="rules"
        >
          <a-card class="sub-card">
            <a-form-item
              :label="$t('mails_component.naming')"
              class="custom-select"
              :required="true"
            >
              <a-select
                class="document-select"
                size="large"
                v-model:value="organizationName"
                disabled
              />
            </a-form-item>
            <a-form-item
              :label="$t('mails_component.reciver')"
              class="custom-select"
              ref="branchId"
              name="branchId"
            >
              <a-select
                :placeholder="$t('mails_component.select_branch')"
                class="document-select"
                size="large"
                v-model:value="formState.branchId"
              >
                <a-select-option
                  :value="branch.id"
                  v-for="branch of branchList"
                  :key="branch.id"
                  >{{ branch.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
            <a-form-item
              :label="$t('mails_component.theme')"
              class="custom-select"
              ref="typeId"
              name="typeId"
            >
              <a-select
                :placeholder="$t('mails_component.select_theme')"
                class="document-select"
                size="large"
                v-model:value="formState.typeId"
              >
                <a-select-option
                  :value="mailType.id"
                  v-for="mailType of allMailType"
                  :key="mailType.id"
                  >{{ mailType.type }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-card>
          <h3 class="form-title !mt-6">{{ $t('mails_component.pined') }}</h3>
          <div class="pb-3 mail-upload">
            <a-form-item ref="files" name="files">
              <a-card :bordered="false" class="sub-card">
                <page-loader-component
                  :loading="loadingUrl.has('/file/upload')"
                >
                  <div class="min-h-[160px]">
                    <template v-if="formState.files.length > 0">
                      <a-row :gutter="[8, 8]" class="mb-4">
                        <a-col
                          v-for="(item, index) in formState.files"
                          :span="12"
                          :key="index"
                        >
                          <div class="file-item">
                            <div
                              class="relative overflow-hidden border file-item rounded-xl"
                            >
                              <img
                                src="@/assets/images/mail-doc.svg"
                                class="object-cover w-full"
                              />
                              <p
                                class="file-type w-full p-0 uppercase text-primary absolute bottom-3 text-center text-xs leading-[14px]"
                              >
                                {{ item.name.split('.').pop() }}
                              </p>
                            </div>
                            <p
                              class="text-center text-xs leading-[14px] text-muted !mb-0"
                            >
                              {{ item.name }}
                            </p>
                            <div
                              class="absolute top-0 left-0 flex items-start justify-end w-full h-full pt-3 pr-4 transition close-file"
                            >
                              <a-button
                                type="text"
                                size="small"
                                class="text-xl"
                                @click="handleCloseFile(index)"
                              >
                                <template #icon>
                                  <IconClose />
                                </template>
                              </a-button>
                            </div>
                          </div>
                        </a-col>
                      </a-row>
                    </template>
                    <template v-else-if="!loadingUrl.has('/file/upload')">
                      <a-empty />
                    </template>
                  </div>
                </page-loader-component>

                <template #actions>
                  <a-upload
                    :disabled="loadingUrl.has('/file/upload')"
                    class="flex w-full px-3"
                    :action="null"
                    :multiple="false"
                    :before-upload="uploadFile"
                    :file-list="null"
                    :accept="
                      formState.files.length === 0
                        ? '.pdf,.jpg,.jpeg'
                        : `.${formState.files[0].name.split('.').pop()}`
                    "
                    v-if="
                      (formState.files?.[0]?.name.split('.').pop() === 'pdf' &&
                        formState.files.length < 1) ||
                      (formState.files?.[0]?.name.split('.').pop() !== 'pdf' &&
                        formState.files.length < 5) ||
                      formState.files.length === 0
                    "
                  >
                    <div
                      class="flex items-center !w-full text-base font-medium text-body justify-between"
                    >
                      <div class="flex items-center gap-4">
                        <span class="text-2xl text-primary">
                          <IconPaperClip />
                        </span>
                        <p class="mb-0">{{ $t('mails_component.pin') }}</p>
                      </div>
                      <span class="text-2xl text-muted">
                        <IconPlus />
                      </span>
                    </div>
                  </a-upload>
                </template>
              </a-card>
              <!-- <p class="m-0 my-2 mb-10 text-xs text-muted">
                {{
                  $t(
                    'counterparties_view.you_can_add_files_no_larger_than_20_MB_in_size_and_no_more_than_5_files'
                  )
                }}
              </p> -->
            </a-form-item>
          </div>
        </a-form>
      </div>
    </template>
    <template #footer>
      <div class="flex items-end justify-end">
        <a-button @click="submitForm" size="large" type="primary" shape="round">
          {{ $t('employees_view.add') }}
        </a-button>
      </div>
    </template>
  </modal-card-component>
</template>

<style lang="scss" scoped>
.mailsWraper {
  width: 614px !important;
}

:deep(.ant-select-selection-placeholder) {
  padding-top: 7px !important;
}

:deep(.ant-upload-wrapper .ant-upload-select, .ant-upload) {
  width: 100% !important;
}
</style>
