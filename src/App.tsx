import RouterView from './router/router';
import { HashRouter } from 'react-router-dom';
export default function App() {
    return (
        <>
            <HashRouter>
                <RouterView></RouterView>
            </HashRouter>
        </>
    );
}
