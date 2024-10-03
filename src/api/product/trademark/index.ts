import { HttpService } from '@/utils/request'
const $HttpService: any = new HttpService('/api');

export const reqAddTrademark = (data:any) => {
  return $HttpService.commonRequest({
    url: '/user/addtrade',
    method: 'post',
    data
  });
}

export const reqUpdateTrademark = (data:any) => {
  return $HttpService.commonRequest({
    url: '/user/updatetrade',
    method: 'post',
    data
  });
}

export const reqDeleteTrademark = (data:any) => {
  return $HttpService.commonRequest({
    url: '/user/delete/trade',
    method: 'post',
    data
  });
}

export const reqHasTrademark = (data:any) => {
  return $HttpService.commonRequest({
    url: '/user/gettrades',
    method: 'post',
    data
  });
}