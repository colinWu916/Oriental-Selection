import { HttpService } from '@/utils/request'
const $HttpService: any = new HttpService('/api');


export const reqAddOrUpdateMenu = (data: any) => {
  // return $HttpService.commonRequest({
  //   url: '/manage/permission/doAssign',
  //   method: 'post',
  //   data
  // });
}

export const reqAllPermisstion = () => {
  return $HttpService.commonRequest({
    url: '/manage/acl/permission',
    method: 'get',
  });
}
