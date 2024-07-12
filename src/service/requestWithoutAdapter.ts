import axios, { AxiosError, AxiosResponse } from 'axios';
import { httpResponse } from './service.type';
import { Loading } from 'components/e-loading';
import { Toast } from 'antd-mobile';
import { requestConfig } from './index';
const axiosInstance = axios.create();

// 非标处理，根据项目实际情况调整
axiosInstance.interceptors.request.use((config: requestConfig) => {
    !config.noAuth && (config.headers['Authorization'] = `Bearer ${fetchData.token}`);
    fetchData.showLoading(config.noLoading);
    return config;
});
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        fetchData.hideLoading();
        return Promise.resolve(response);
    },
    (error: AxiosError) => {
        fetchData.hideLoading();
        if (error?.response?.status === 401 || error?.response?.status === 402) {
            // token过期按正常处理
            return Promise.resolve(error.response);
        }
        return Promise.reject(error);
    }
);

// 注册全局的请求头路径
const baseRequestURL = import.meta.env.MODE === 'development' ? '/api' : location.origin;
class FetchData {
    private requestNum = 0;
    private toggleTimer: any = null;
    public token = '';
    request = async <T>(config: requestConfig, retry = 0): Promise<T & httpResponse<T>> => {
        try {
            let res = await axiosInstance.request<T & httpResponse<T>>({
                baseURL: baseRequestURL,
                ...config
            });
            if (res.status === 401 || res.status === 402) {
                if (await this.login(retry)) {
                    res = await axiosInstance.request<T & httpResponse<T>>({
                        baseURL: baseRequestURL,
                        ...config
                    });
                } else {
                    return res.data;
                }
            }
            if (res.data.code != 0 && !config.noHandleError) {
                Toast.show(res.data.msg);
            }
            return res.data;
        } catch (e: any) {
            return e.response;
        }
    };
    login = async (retry = 0) => {
        // todo 登录方法
        return true;
    };
    showLoading = (noLoading = false) => {
        this.requestNum++;
        if (!this.toggleTimer && !noLoading) {
            this.toggleTimer = setTimeout(() => {
                Loading.show();
            }, 500);
        }
    };
    hideLoading = () => {
        if (--this.requestNum <= 0) {
            this.toggleTimer && clearTimeout(this.toggleTimer);
            this.toggleTimer = null;
            Loading.hide();
            this.requestNum = 0;
        }
    };
}
const fetchData = new FetchData();
export default fetchData.request;
