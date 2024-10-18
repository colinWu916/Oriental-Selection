//进行axios二次封装:使用请求与响应拦截器
import axios, { type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

interface RequestOptions {
  url: string // 请求链接
  params?: object // 请求参数
  method: string // 请求方法
  headers?: object // 请求头
  hideAppSpinShow?: boolean // 是否隐藏请求loading
  [keyName: string]: any // 其他参数
}

interface ResponseOptions {
  config: object
  data: {
    retcode: string
    desc: string
    [propName: string]: any
  }
  status: number
  headers: object
  [propName: string]: object | number | string | []
}

class Interceptors {
  public instance: any

  constructor(baseUrl: string) {
    this.initInterceptors(baseUrl)
  }

  public initInterceptors(baseUrl: string) {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
    })

    this.instance.interceptors.request.use((config: any) => {
      const token = localStorage.getItem('TOKEN')
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })

    this.instance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        return response.data
      },
      (error: any) => {
        let message = ''
        const status = error?.response?.code || 500
        switch (status) {
          case 401:
            message = 'TOKEN过期'
            break
          case 403:
            message = '无权访问'
            break
          case 404:
            message = '请求地址错误'
            break
          case 500:
            message = '服务器出现问题'
            break
          default:
            message = '网络出现问题'
            break
        }
        //提示错误信息
        ElMessage({
          type: 'error',
          message,
        })
        return Promise.reject(error)
      },
    )
  }

  public getInterceptors() {
    return this.instance
  }
}

export class HttpService {
  public axios: any

  constructor(baseURL: string) {
    this.axios = new Interceptors(baseURL).getInterceptors()
  }

  public commonRequest(options: RequestOptions): Promise<object> {
    return new Promise((resolve, reject) => {
      this.axios(options)
        .then((res: ResponseOptions) => {
          resolve(res)
        })
        .catch((err: ResponseOptions) => {
          reject(err)
        })
    })
  }
}
