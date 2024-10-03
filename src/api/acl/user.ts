import { HttpService } from '@/utils/request'
const $HttpService: any = new HttpService('/api');


export const reqUserInfo = (data: any) => {
  return $HttpService.commonRequest({
    url: '/manage/user/list',
    method: 'post',
    data
  });
}

export const reqSetUserRole = (data: any) => {
  return $HttpService.commonRequest({
    url: '/manage/user/updateRole',
    method: 'post',
    data
  });
}

export const reqAddOrUpdateUser = (data: any) => {
  return $HttpService.commonRequest({
    url: '/manage/user/addUser',
    method: 'post',
    data
  });
}

export const reqAllRole = () => {
  return $HttpService.commonRequest({
    url: '/namege/user/allRoles',
    method: 'get'
  });
}