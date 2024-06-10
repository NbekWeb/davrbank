import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useAuth = defineStore('Auth', {
  state: () => ({
    mobilePersonData: null,
    otpData: null
  }),
  actions: {
    getMobilePersonData(documentId) {
      const corePinia = useCore()
      corePinia.loadingUrl.add('/auth/eimzo')
      api({
        url: '/auth/eimzo',
        pk: documentId,
        method: 'GET',
        open: true
      })
        .then(({ data }) => {
          this.mobilePersonData = data
        })
        .catch((error) => {
          corePinia.switchStatus(error)
        })
        .finally(() => {
          corePinia.loadingUrl.delete('/auth/eimzo')
        })
    },
    loginEimzoMobile() {
      const corePinia = useCore()
      corePinia.loadingUrl.add('/auth/eimzo')
      api({
        url: '/user/login/e-imzo-mobile',
        method: 'POST',
        open: true,
        data: {
          docId: this.mobilePersonData.id
        }
      })
        .then(({ data }) => {
          this.otpData = data
        })
        .catch((error) => {
          corePinia.switchStatus(error)
        })
        .finally(() => {
          corePinia.loadingUrl.delete('/auth/eimzo')
        })
    },
    makeAuth(successCallback, failCallback) {
      const corePinia = useCore()
      corePinia.loadingUrl.add('/eimzo/frontend/mobile/auth')
      api({
        url: '/eimzo/frontend/mobile/auth',
        method: 'POST'
      })
        .then(({ data }) => {
          if (data.status === 1) {
            successCallback(data)
          } else {
            failCallback()
          }
        })
        .catch((error) => {
          failCallback()
        })
    },
    checkStatus(documentId, acceptedCallback, callback) {
      const corePinia = useCore()
      corePinia.loadingUrl.add('/eimzo/frontend/mobile/status')
      api({
        url: '/eimzo/frontend/mobile/status',
        method: 'POST',
        open: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          documentId
        }
      })
        .then(({ data }) => {
          if (data.status === 1) {
            acceptedCallback(true, data?.message)
          } else {
            callback(data)
          }
        })
        .catch((error) => {})
        .finally(() => {
          corePinia.loadingUrl.delete('/eimzo/frontend/mobile/status')
        })
    }
  }
})

export default useAuth
