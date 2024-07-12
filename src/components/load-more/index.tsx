import { InfiniteScroll, List, Toast } from 'antd-mobile';
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PaginationFn } from 'service/api/public.type';
import useCacheScroll from 'hooks/useCacheScroll';
import { debounce } from '@/utils/utils';
import { isEqual } from 'lodash';
type scrollProps = {
    listData: Array<any>;
    loadFn: PaginationFn<any, any>;
    page?: number;
    pageSize?: number;
    loadParams?: any;
    ListSlot?: FC<{ listData: Array<any> }>;
    cacheId?: string; // 组件唯一key值 建议以path为准 若同path有几处，可加上自定义业务后缀 path_comp
};
function LoadMore(props: scrollProps) {
    const [data, setData] = useState<any>(props.listData);
    const scrollDataRef = useRef<any>(props.listData);
    const [hasMore, setHasMore] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [hasGetScroll, setHasGetScroll] = useState(false); // 标识，用于判断setScroll的时机，防止返回页面后默认的set行为
    const hasMoreRef = useRef(true); // 记录是否还有更多，用于存储
    const page = useRef(props.page || 2);
    const pageSize = props.pageSize || 10;
    const ListSlot = props.ListSlot;
    const hasScroll = useRef(false); // 是否已滚动到指定位置 滚动之后再设置hasmore，否则会自动加载一次
    const scrollRef = useRef<any>(null); // 标记滚动数据dom
    const { setScroll, scrollData } = useCacheScroll<{
        page: number;
        data: any;
        hasMore: boolean;
    }>();
    useEffect(() => {
        if (!props?.listData?.length) {
            // 初始化组件时无列表
            return;
        }

        if (props.cacheId) {
            if (!hasScroll.current) {
                hasScroll.current = true;
                const param = scrollData(props.cacheId);
                if (param && Object.values(param).length) {
                    // 三个ref记录初始值，用于最终存储使用
                    scrollDataRef.current = param.data.data;
                    page.current = param.data.page;
                    hasMoreRef.current = param.data.hasMore;
                    console.log(param);
                    setHasMore(false);
                    setData(param.data.data);
                    setTimeout(() => {
                        // 当前没数据，获取不到DOM，因此在setData之后的下一轮任务执行滚动，目前滚动效果加在pull-to-refresh组件上，因此需取parentNode
                        scrollRef.current.parentNode.scrollTop = param.scroll;
                        setHasMore(param.data.hasMore);
                        setHasGetScroll(true);
                    }, 16);
                    return;
                }
            }
        }
        scrollDataRef.current = props.listData;
        setHasGetScroll(true);
        // 外层传递数据变更（refresh），重置组件 推荐通过key重置
        page.current = 2;
        props.listData.length !== pageSize ? setHasMore(false) : setHasMore(true); // hasmore的值需重置
        setLoadError(false);
        setData(props.listData);
    }, [props.listData]);
    useLayoutEffect(() => {
        const listener = debounce(() => {
            if (props.cacheId) {
                if (!scrollRef.current || !scrollDataRef.current.length) {
                    return;
                } else {
                    console.log(hasMoreRef.current);
                    setScroll(props.cacheId, {
                        data: {
                            data: scrollDataRef.current,
                            page: page.current,
                            hasMore: hasMoreRef.current
                        },
                        scroll: scrollRef.current.scrollTop || scrollRef.current.parentNode.scrollTop
                    });
                }
            }
        }, 300);
        hasGetScroll && scrollRef.current.parentNode.addEventListener('scroll', listener);
        return () => {
            scrollRef.current.parentNode.removeEventListener('scroll', listener);
        };
    }, [hasGetScroll]);
    const loadmore = async () => {
        const res = await props.loadFn({ page: page.current, pageSize: pageSize, ...props.loadParams });
        if (res.code == 0) {
            loadError && setLoadError(false);
            if (res.data.length < pageSize) {
                setHasMore(false);
                hasMoreRef.current = false;
            } else {
                page.current = page.current + 1;
                setHasMore(true);
                hasMoreRef.current = true;
            }
            res.data.length && setData([...data, ...res.data]);
            scrollDataRef.current = [...data, ...res.data];
        } else {
            // 出错了
            setHasMore(false);
            setLoadError(true);
            Toast.show(res.msg || '请稍后重新再试');
        }
    };
    // 自定义loading内容，待产品确认
    const InfiniteScrollContent = ({ hasMore }: { hasMore: boolean }) => {
        return loadError ? (
            <span>
                加载失败 <a onClick={loadmore}>重新加载</a>{' '}
            </span>
        ) : hasMore ? (
            <>加载中</>
        ) : (
            <span>没有更多了</span>
        );
    };
    return (
        <>
            {ListSlot ? (
                <div ref={scrollRef}>
                    <ListSlot listData={data}></ListSlot>
                </div>
            ) : (
                <List ref={scrollRef}>
                    {data.map((item: any, index: number) => {
                        return <List.Item key={item.name + index}>{item.name}</List.Item>;
                    })}
                </List>
            )}
            {data.length ? (
                <InfiniteScroll loadMore={loadmore} hasMore={hasMore} threshold={10}>
                    <InfiniteScrollContent hasMore={hasMore}></InfiniteScrollContent>
                </InfiniteScroll>
            ) : (
                <></>
            )}
        </>
    );
}

export default React.memo(LoadMore, (prev, next) => {
    return isEqual(prev, next);
});
