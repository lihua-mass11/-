/** 家属账号信息 */
export interface User {
  id: string
  username: string
  password: string
  name: string
  phone: string
  avatar?: string
}

/** 登录表单 */
export interface LoginForm {
  username: string
  password: string
}
