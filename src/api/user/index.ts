import { HttpService } from '@/utils/request'
import type { loginFormData } from './type'
const $HttpService: any = new HttpService('/api')

export const reqLogin = (data: loginFormData) => {
  return $HttpService.commonRequest({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export const reqUserInfo = (data: any) => {
  return $HttpService.commonRequest({
    url: '/user/info',
    method: 'get',
    params: data,
  })
}

export const reqLogout = () => {
  return $HttpService.commonRequest({
    url: '/user/logout',
    method: 'post',
  })
}
