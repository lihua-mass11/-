/** 登录表单 */
export interface LoginDTO {
  username: string
  password: string
}

/** 注册表单 */
export interface RegisterDTO {
  name: string
  phone: string
  username: string
  password: string
  confirmPassword: string
}
