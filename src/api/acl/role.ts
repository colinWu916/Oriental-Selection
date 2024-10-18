import { HttpService } from '@/utils/request'
const $HttpService: any = new HttpService('/api')

export const reqAllRoleList = (data: any) => {
  return $HttpService.commonRequest({
    url: '/manage/role/list',
    method: 'post',
    data,
  })
}

export const reqSetPermisstion = (data: any) => {
  return $HttpService.commonRequest({
    url: '/manage/permission/doAssign',
    method: 'post',
    data,
  })
}

export const reqAllMenuList = (data: any) => {
  return $HttpService.commonRequest({
    url: '/manage/menu/list',
    method: 'get',
    params: data,
  })
}
