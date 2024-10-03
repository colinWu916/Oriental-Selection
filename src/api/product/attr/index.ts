import { HttpService } from '@/utils/request'
const $HttpService: any = new HttpService('/api');


export const reqC1 = () => {
  return $HttpService.commonRequest({
    url: '/user/category/one',
    method: 'get',
  });
}

export const reqC2 = (data:any) => {
  return $HttpService.commonRequest({
    url: '/user/category/two',
    method: 'get',
    params: data
  });
}

export const reqC3 = (data:any) => {
  return $HttpService.commonRequest({
    url: '/user/category/three',
    method: 'get',
    params: data
  });
}