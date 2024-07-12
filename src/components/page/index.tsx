import { HeadType } from 'components/head';
import cns from 'classnames';
import Head from 'components/head';
import Footer, { FooterType } from 'components/footer';
import style from './page.module.less';
type PageConfigs = {
    head?: HeadType;
    footer?: FooterType;
    children: React.ReactNode;
};
export default function Page(props: PageConfigs) {
    const { head, footer, children: Children } = props;
    // console.log('render?', props);
    return (
        <div className={style.page}>
            {head && <Head {...head} />}
            <div className={cns([style.container, footer.fixed && style.fixed])}>
                {Children}
                {footer && <Footer {...footer}></Footer>}
            </div>
        </div>
    );
}
