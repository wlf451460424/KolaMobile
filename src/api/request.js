import axios from 'axios'
import router from '@router'
import store from '@store'
import Toast from '@common/toast'
import base from '@api/base'

const errorHandler = (status, other) => {
  if (status >= 400 && status < 500) {
    Toast.showText('请求发生错误')
  } else if (status >= 500 && status < 600) {
    Toast.showText('服务器异常,请稍后再试')
  } else {
    Toast.showText('未知异常')
  }
}

let instance = axios.create({
  baseURL: base.address,
  time: 1000 * 12,
  headers: {
    'Content_Type': 'application/json;charset=UTF-8'
  }
})

// 请求列表
const requestList = []
// 取消列表
const CancelToken = axios.CancelToken
let sources = {}

// 请求拦截器
instance.interceptors.request.use(
  config => {
    console.log(`请求的数据：${JSON.stringify(config.data)}`)

    const request = JSON.stringify(config.url) + JSON.stringify(config.data)
    config.cancelToken = new CancelToken((cancel) => {
      sources[request] = cancel
    })

    if (requestList.includes(request)) {
      sources[request]('取消重复请求')
    } else {
      requestList.push(request)
      if (window.navigator.onLine) {
        config.showLoading && Toast.showFullScreenLoading()
      }
    }

    const token = store.state.userInfo.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
  res => {
    const request = JSON.stringify(res.config.url) + JSON.stringify(res.config.data)
    requestList.splice(requestList.findIndex(item => item === request), 1)

    if (requestList.length === 0) {
      res.config.showLoading && Toast.tryHideFullScreenLoading()
    }

    if (res.data.code === 401) {
      router.push('/login')
    }
    console.log(`返回的数据：${JSON.stringify(res.data.data)}`)
    return res.data.code === 200 ? Promise.resolve(res) : Promise.reject(res)
  },
  error => {
    if (!window.navigator.onLine) {
      Toast.showText('当前无网络')
    } else {
      // 处理取消请求
      if (axios.isCancel(error)) {
        throw new axios.Cancel('cancel request')
      } else {
        error.config.showLoading && Toast.tryHideFullScreenLoading()
        const { response } = error
        console.log(`返回错误信息：${JSON.stringify(error.response)}`)
        if (response) {
          errorHandler(response.status, response.data.message)
        } else {
          Toast.showText('网络请求失败')
        }
        return Promise.reject(response)
      }
    }
  }
)

const defaultConfig = { showLoading: true }
export default {
  sources,
  get: (url, config) => instance.get(url, { ...defaultConfig, ...config }),
  put: (url, data, config) => instance.put(url, data, { ...defaultConfig, ...config }),
  post: (url, data, config) => instance.post(url, data, { ...defaultConfig, ...config }),
  patch: (url, data, config) => instance.patch(url, data, { ...defaultConfig, ...config }),
  all: promises => instance.all(promises)
}
