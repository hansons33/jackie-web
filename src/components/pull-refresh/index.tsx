import { PullToRefresh, PullToRefreshProps } from 'antd-mobile';
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh';
import React, { ReactNode } from 'react';
interface pullRefreshProps extends PullToRefreshProps {
    cacheId?: string;
}
function PullRefresh(props: pullRefreshProps) {
    const { canReleaseText, pullingText, refreshingText, completeText } = props;
    const statusRecord: Record<PullStatus, string | ReactNode> = {
        pulling: pullingText || '松开刷新',
        canRelease: canReleaseText || '请松开',
        refreshing: refreshingText || '加载中',
        complete: completeText || '已更新至最新'
    };
    return (
        <PullToRefresh
            {...props}
            headHeight={30}
            onRefresh={props.onRefresh}
            renderText={status => <>{statusRecord[status]}</>}
        >
            {props.children}
        </PullToRefresh>
    );
}

export default React.memo(PullRefresh);
