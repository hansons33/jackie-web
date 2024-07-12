export type State = {
    token: string;
    loadingStatus: boolean;
    // cachedRequests: Map<object, { data: any; expireTime: number }>;
    cachedRequests: { [key: string]: { data: any; expireTime: number } };
    title: string;
    cacheTab: {
        [key: string]: string;
    };
    customBack: Map<string, Array<Function>>;
    cacheScroll: {
        [key: string]: {
            data: any;
            scroll: number;
        };
    };
};

export const initState = {
    token: '',
    loadingStatus: false,
    redirectRouter: '',
    cachedRequests: {},
    title: '', // 当前页面的title 动态跳转用到
    cacheTab: {},
    customBack: new Map(),
    cacheScroll: {}
};
