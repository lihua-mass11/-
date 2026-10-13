import axios from 'axios'
import { ElMessage } from 'element-plus'

/** 统一的 axios 实例：请求本地 mock json 数据 */
const request = axios.create({
  baseURL: '/mock',
  timeout: 10000,
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    ElMessage.error('数据加载失败，请稍后重试')
    return Promise.reject(error)
  },
)

export default request
