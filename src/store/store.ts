import { create } from 'zustand';
import { initState, State } from './state';
import { Selector } from './selector';
import { eRequest, requestConfig } from 'service/index';
import { isEqual } from 'lodash';
export type Action = {
    toggleLoading: (status: boolean) => void;
    setCachedRequests: (key: any, data: any, staleTime?: number) => void;
    getCachedRequests: (key: any) => { data: any | undefined };
    useCacheRequest: (config: requestConfig) => Promise<any>;
    setCacheTab: (path: string, tab: string) => void;
    getCacheTab: (path: string) => string;
    clearCacheTab: (path: string) => void;
    getCustomBack: (path: string) => Array<Function>;
    setCustomBack: (path: string, cb: Function) => void;
    getCacheScroll<T = any>(id: string): { data: T; scroll: number } | undefined;
    setCacheScroll<T = any>(id: string, param: { data?: T; scroll: number }): void;
    deleteCacheScroll: (id: string) => void;
};
export type Store = Action & State;
// const store = persist<Store>(
export const useStore = create<Store>((set, get) => ({
    // state
    ...initState,
    // actions
    toggleLoading: (status: boolean) => {
        set({ loadingStatus: status });
    },
    // 缓存接口数据
    setCachedRequests: (key: any, data: any, staleTime?: number) => {
        const cachedRequests = get().cachedRequests;
        const cacheKey = typeof key === 'object' ? JSON.stringify(key) : key;
        // 默认缓存5分钟
        cachedRequests[cacheKey] = { data, expireTime: Date.now() + (staleTime || 5 * 60 * 1e3) };
        set({ cachedRequests });
    },
    // 获取缓存接口数据
    getCachedRequests: (key: any) => {
        const cachedRequests = get().cachedRequests;
        const cacheKey = typeof key === 'object' ? JSON.stringify(key) : key;
        const cacheData = cachedRequests[cacheKey];
        if (cacheData) {
            const { data, expireTime } = cacheData;
            if (expireTime >= Date.now()) {
                return data;
            } else {
                // 过期，清理掉
                delete cachedRequests[cacheKey];
                set({ cachedRequests });
                return undefined;
            }
        } else {
            return undefined;
        }
    },
    // 缓存请求方法，staleTime为缓存时间，当前默认缓存5分钟
    useCacheRequest: async (config: requestConfig) => {
        const getCachedRequests = get().getCachedRequests;
        const setCachedRequests = get().setCachedRequests;
        const cacheKey = JSON.stringify({ url: config.url, ...config.params, ...config.data });
        const cacheData = getCachedRequests(cacheKey);
        console.log(cacheData, '读取一次');
        if (cacheData) {
            return cacheData;
        } else {
            const res = await eRequest(config);
            // 目前没有规范输出
            if (res) {
                setCachedRequests(cacheKey, res, config.staleTime || 10000);
            }
            return res;
        }
    },
    // 处理tab缓存相关api
    setCacheTab(path: string, tab: string) {
        const cacheTab = get().cacheTab;
        cacheTab[path] = tab;
        set({
            cacheTab
        });
    },
    getCacheTab(path: string) {
        const cacheTab = get().cacheTab;
        return cacheTab[path];
    },
    clearCacheTab(path: string) {
        const cacheTab = get().cacheTab;
        delete cacheTab[path];
    },
    // 处理自定义返回相关api
    setCustomBack(path: string, cb: Function) {
        const customBack = get().customBack;
        if (!cb) {
            return;
        }
        const cbs = customBack.get(path);
        if (!cbs?.length) {
            customBack.set(path, [cb]);
        } else {
            let idx = undefined;
            // 同名函数覆盖，非同名添加进数组
            for (let i = 0; i < cbs.length; i++) {
                if (cbs[i].name === cb.name) {
                    idx = i;
                    break;
                }
            }
            idx !== undefined ? (cbs[idx] = cb) : cbs.push(cb);
            customBack.set(path, cbs);
        }
        set({
            customBack
        });
    },
    getCustomBack(path: string) {
        const customBack = get().customBack;
        return customBack.get(path) || [];
    },
    // 处理列表数据及滚动位置缓存相关api
    getCacheScroll(id: string) {
        return get().cacheScroll[id];
    },
    setCacheScroll(id: string, param) {
        const cacheScroll = get().cacheScroll;
        cacheScroll[id] = { ...cacheScroll[id], ...param };
        set({
            cacheScroll
        });
    },
    deleteCacheScroll(id: string) {
        const cache = get().cacheScroll;
        cache[id] = {} as any;
        console.log(cache, '删除后', id);
        set({
            cacheScroll: cache
        });
    }
}));
// {
//     name: 'ebscn-crm',
//     storage: createJSONStorage(() => sessionStorage)
// }
// );

// export const useStore = create<Store, [['zustand/persist', Store]]>(store);

export const useSelector = (selector: Selector) => useStore(state => selector(state), isEqual);
