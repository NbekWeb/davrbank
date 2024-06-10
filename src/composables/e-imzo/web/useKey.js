import { ref, onMounted } from 'vue'
import { dates, EIMZOClient } from '../eImzoClient'
import useCore from '@/store/core.pinia.js'

function useEimzo(props) {
  const EIMZO_MAJOR = 3
  const EIMZO_MINOR = 37
  const items = ref([])
  const pkcs7_64 = ref(null)

  const checkKey = (item) => {
    item.expired = dates.compare(new Date(), item.validTo) > 0
    return item
  }

  const loadKeys = () => {
    const corePinia = useCore()
    EIMZOClient.listAllUserKeys(
      function (cert) {
        return cert
      },
      function (index, cert) {
        return cert
      },
      function (keys, firstId) {
        items.value = keys.map((item) => {
          return {
            ...item,
            expired: dates.compare(new Date(), item.validTo) > 0
          }
        })
      },
      function (error, reason) {
        console.log(reason)
        corePinia.eImzoError({ error, reason })
      }
    )

    // EIMZOClient.listAllUserKeys(
    //   (o, i) => {
    //     var itemId = "itm-" + o.serialNumber + "-" + i;
    //     return itemId;
    //   },
    //   (itemId, v) => {
    //     // const checkItem = checkKey({
    //     //   ...v,
    //     //   itemId: itemId,
    //     // });
    //     return itemId;
    //   },
    //   (loadedItems, firstId) => {
    //     console.log(loadedItems)
    //     items.value = loadedItems;
    //   },
    //   (e, r) => {}
    // );
  }

  const getItem = (item) => {
    EIMZOClient.loadKey(
      item,
      (id) => {
        EIMZOClient.createPkcs7(
          id,
          item.UUID,
          null,
          (pkcs7) => {
            pkcs7_64.value = pkcs7
          },
          (e, r) => {
            if (r) {
              pkcs7_64.value = 'error'
              // store.commit('setUniversal',{
              //   key:'pkcs7Error',
              //   payload:r
              // })
              // Handle createPkcs7 error
            }
            if (e) {
              // Handle createPkcs7 exception
            }
          }
        )
      },
      (e, r) => {
        if (r === 'Ввод пароля отменен') {
          pkcs7_64.value = 'ERI_PASSWORD_ENTRY_CANCELED'
          // Handle loadKey error
        } else if (r.indexOf('BadPaddingException') !== -1) {
          pkcs7_64.value = 'ERI_INVALID_PASSWORD'
        } else {
          pkcs7_64.value = 'error'
        }
        if (e) {
          // Handle loadKey exception
        }
      }
    )
  }

  const onConfirm = (key, text) => {
    EIMZOClient.loadKey(key, (id) => {
      EIMZOClient.createPkcs7(
        id,
        text,
        null,
        (pkcs7) => {
          pkcs7_64.value = pkcs7
        },
        (e, r) => {
          if (r) {
            if (r.indexOf('BadPaddingException') !== -1) {
              // Handle BadPaddingException
            } else {
              console.log(r)
              // Handle other createPkcs7 errors
            }
          } else {
            // Handle createPkcs7 success
          }
        }
      )
    })
  }

  onMounted(() => {
    EIMZOClient.API_KEYS = [
      import.meta.env.VITE_APP_SERVER,
      import.meta.env.VITE_APP_ERI_API_KEY
    ]
    EIMZOClient.checkVersion(
      (major, minor) => {
        const newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR
        const installedVersion = parseInt(major) * 100 + parseInt(minor)
        if (installedVersion < newVersion) {
          // Handle update app
        } else {
          EIMZOClient.installApiKeys(
            () => {
              loadKeys()
            },
            (e, r) => {
              if (r) {
                // Handle installApiKeys success
              } else {
                // Handle installApiKeys error
              }
            }
          )
        }
      },
      (e, r) => {
        if (r) {
          // Handle checkVersion success
        } else {
          // Handle checkVersion error
        }
      }
    )
  })

  return [items, pkcs7_64, getItem, onConfirm]
}

export default useEimzo
