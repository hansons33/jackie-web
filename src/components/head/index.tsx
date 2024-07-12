import React, { useEffect, useState } from 'react';
import styles from './head.module.less';
import cns from 'classnames';
import MobileDetect from 'mobile-detect';
import { useLocation, useNavigate } from 'react-router-dom';
export type HeadType = {
    title?: string | null;
    colorStyle?: number | null; // 0 白色 1 黑色  （字体 图标颜色）
    children?: React.ReactNode;
    right?: React.ReactNode;
    style?: {
        backgroundColor: string;
    };
    customClass?: {
        header?: string;
    };
    customBack?: Function;
};
function Head({ title, colorStyle = 1, children, right, style, customClass, customBack }: HeadType): JSX.Element {
    const [showHeader, setShowHeader] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    function goBackPage() {
        if (location.pathname !== '/home') {
            customBack && customBack();
            navigate(-1);
        }
    }
    useEffect(() => {
        const md = new MobileDetect((window as any).navigator.userAgent);
        if (md.mobile() && md.userAgent().indexOf('wxwork') > -1) {
            // 移动端企微自带导航，PC端没有
            setShowHeader(false);
        }
        async function init() {
            //设置html title
            (window as any).document.title = title || children;
            //微信ios返回刷新问题
            (window as any).onpageshow = function (e: any) {
                if (e.persisted) {
                    (window as any).location.reload(true);
                }
            };
        }
        if (showHeader) init(); //与客户端的异步交互需要负状态管理
    }, []);
    useEffect(() => {
        (window as any).document.title = title;
    }, [title]);
    return showHeader ? (
        <header
            className={cns(styles.header, customClass?.header || styles['header-default'])}
            style={{
                ...style,
                backgroundColor: style?.backgroundColor === 'unset' ? 'unset' : style?.backgroundColor
            }}
        >
            <div
                className={cns(styles[colorStyle ? 'back-icon-black' : 'back-icon'], styles[`visible`])}
                onClick={goBackPage}
            ></div>

            <div className={cns(styles[colorStyle ? 'title-black' : 'title'])}>{title || children}</div>

            <div className={cns(styles['right-icon'], styles[right ? `visible` : `hidden`])}>{right}</div>
        </header>
    ) : (
        <></>
    );
}
export default React.memo(Head);
