import styles from './footer.module.less';
import cns from 'classnames';
export type FooterType = {
    text: string;
    fixed?: boolean;
    click?: () => void;
    style?: React.CSSProperties &
        Partial<{
            '--btn-color': string;
            '--btn-bg': string;
        }>;
    visibility?: boolean;
    disabled?: boolean;
};
const styleMap = {
    '--btn-color': 'color',
    '--btn-bg': 'backgroundColor'
};
export default function Footer({ text, fixed, click, style, visibility = true, disabled = false }: FooterType) {
    function handleStyle(style) {
        if (!style) return;
        const stylesheet: any = {};
        Object.keys(style).map(i => {
            if (style[i]) {
                stylesheet[styleMap[i]] = style[i];
            }
        });
        return stylesheet;
    }
    return (
        visibility && (
            <div className={cns(fixed ? [styles.footer, styles.fixed] : styles.footer)}>
                <div onClick={click} style={{ ...handleStyle(style), opacity: disabled ? 0.5 : 1 }}>
                    {text}
                </div>
            </div>
        )
    );
}
