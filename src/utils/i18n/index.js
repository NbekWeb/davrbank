import { createI18n } from 'vue-i18n'
import uz from './uz'
import cr from './cr.js'
import ru from './ru'
import en from "@/utils/i18n/en.js";
import useCore from '@/store/core.pinia'

const i18nFactory = () => {
  const corePinia = useCore()
  return createI18n({
    legacy: false,
    locale: corePinia.locale,
    fallbackLocale: 'uz',
    messages: { uz, cr, ru, en }
  })
}

export default i18nFactory
