import { Toast } from 'antd-mobile';
import style from './eLoading.module.less';

export default function ELoading() {
    return (
        <div className={style['ebscn-loading']}>
            <div className={style['ebscn-loading-img']}></div>
            <p>加载中</p>
        </div>
    );
}
const Loading = {
    handler: null as any,
    show: function () {
        this.handler = Toast.show({
            content: <ELoading />,
            duration: 0
        });
    },
    hide: function () {
        this.handler && this.handler.close();
        this.handler = null;
    }
};
export { Loading };
