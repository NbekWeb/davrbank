import { defineStore } from 'pinia'

const useUser = defineStore('User', {
  state: () => ({
    user: null
  }),
  actions: {}
})

export default useUser
