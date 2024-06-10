import axios from 'axios'
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_AOO_BASE_API_VERSION}/`
})

export const api = ({ url, open = false, ...props }) => {
  let token = localStorage.getItem('access_token')
    ? `${localStorage.getItem('access_token')}`
    : null
  if (token) token = `Bearer ${token}`
  if (!open) {
    props.headers = {
      ...props.headers,
      Authorization:
        props.headers && props.headers.Authorization
          ? props.headers.Authorization
          : token
    }
  }
  if ('pk' in props && props.pk) {
    url = `${url}/${props.pk}`
  }
  return instance({
    url: url,
    ...props
  })
}

function createAxiosResponseInterceptor() {
  const interceptor = instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status !== 401) {
        return Promise.reject(error)
      }
      axios.interceptors.response.eject(interceptor)
      return refreshAccessToken(error)
    }
  )
}

function refreshAccessToken(error) {
  const refresh_token = localStorage.getItem('refresh_token')
  if (refresh_token) {
    return axios({
      url: `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_AOO_BASE_API_VERSION}/auth`,
      method: 'POST',
      data: {
        grantType: 'refreshToken',
        refreshToken: refresh_token
      }
    })
      .then(({ data }) => {
        localStorage.setItem('access_token', data?.accessToken)
        localStorage.setItem('refresh_token', data?.refreshToken)
        return axios({
          ...error.response.config,
          headers: {
            ...error.response.config.headers,
            Authorization: `Bearer ${data?.accessToken}`
          }
        })
      })
      .catch((error2) => {
        Clear()
        return Promise.reject(error2)
      })
      .finally(createAxiosResponseInterceptor)
  }
  Clear()
  return Promise.reject('Error')
}

function Clear() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.href = '/'
  return null
}

createAxiosResponseInterceptor()
