import styles from './cover.module.less';
import cns from 'classnames';
import { FC } from 'react';

const Cover: FC = () => {
    return (
        <div className={cns(styles['cover-bg'], styles['gd-load'])}>
            <div className={styles.log}></div>
        </div>
    );
};

export default Cover;
