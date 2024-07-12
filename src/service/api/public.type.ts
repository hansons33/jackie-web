import { httpResponse } from 'service/service.type';

// 分页接口类型
export type PaginationFn<T = any, U = any> = (
    params?: { pageSize?: number; page?: number } & T
) => Promise<httpResponse<U>>;
