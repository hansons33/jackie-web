import { http } from '@ebscn/adapter';
import { requestConfig } from './index';
import { Toast } from 'antd-mobile';
const baseRequestURL = import.meta.env.VITE_PROXY_TARGET || import.meta.env.BASE_URL;
export default async <T = object>(params: requestConfig) => {
    // 统一认证版本及账号类型，定义见adapter文档，优先级低于noAuth，params中有noAuth自动忽略鉴权
    const authParams = {
        version: 1,
        account_type: 0
    };
    const errorHandler = params.noHandleError
        ? null
        : (msg: string) => {
              Toast.show(msg);
          };
    return http({ ...params, ...authParams, baseURL: baseRequestURL, errorHandler }) as Promise<T>;
};
