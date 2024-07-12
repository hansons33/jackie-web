import { AxiosRequestConfig } from 'axios';
import requestWithApp from './requestWithAdapter';
import requestWithoutApp from './requestWithoutAdapter';

const authorization_type = import.meta.env.VITE_AUTHORIZATION_TYPE;
export type requestConfig = AxiosRequestConfig & {
    baseType?: 'ydcrm' | 'wxwg'; // 不同服务key
    noLoading?: boolean; // 是否loading
    noAuth?: boolean; // 是否鉴权
    staleTime?: number; // 过期时间 缓存型接口使用
    noHandleError?: boolean; // 是否页面自行处理报错
};

export const eRequest = authorization_type === 'adapter' ? requestWithApp : requestWithoutApp;
