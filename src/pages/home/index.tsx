import Page from 'components/page';
import { useState } from 'react';
import { useDebounceEffect } from 'hooks/useDebounceEffect';
// import Pdfh5 from 'pdfh5/js/pdfh5.js';
import 'pdfh5/css/pdfh5.css';
export default function Home() {
    const [disabled, setDisabled] = useState(true);
    const [value, setValue] = useState('');
    const [records, setRecords] = useState<string[]>([]);
    useDebounceEffect(
        () => {
            setRecords(records => [...records, value]);
        },
        [value],
        1000
    );
    return (
        <Page
            head={{
                title: '主页',
                customBack: () => {
                    console.log('back');
                }
            }}
            footer={{
                text: '下一步',
                fixed: true,
                disabled,
                click: () => {
                    console.log('123');
                }
            }}
        >
            <input
                type="text"
                onChange={(e: any) => {
                    setValue(e.target.value);
                }}
            />
            {records.map((item, index) => {
                return <div key={item + index}>{item}</div>;
            })}
        </Page>
    );
}
