export type httpResponse<T = any> = {
    data: T;
    code: number;
    msg: string;
};
