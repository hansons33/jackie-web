import React, { ReactElement, Suspense } from 'react';
import { useLocation, Navigate, useNavigationType, Routes, Route } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Cover from 'components/cover';
// 组件
const dynamicRouters = import.meta.glob('pages/*/*.tsx');
const routeFactory = (route: string) => React.lazy(dynamicRouters[`/src/pages/${route}/index.tsx`] as any);
const Home = routeFactory('home');
export type route = {
    path: string;
    element: ReactElement;
    children?: Array<route>;
};

const routes: Array<route> = [
    {
        path: '/',
        element: <Navigate to="/home" replace={true}></Navigate>
    },
    {
        path: '/home',
        element: <Home />
    }
];
const ANIMATION_MAP: any = {
    PUSH: 'forward',
    POP: 'back'
};

// 处理组件
const generateRoutes = (routeList: Array<route>) => {
    return routeList.map(item => {
        return (
            <Route
                path={item.path}
                element={<Suspense fallback={<Cover></Cover>}>{item.element}</Suspense>}
                key={item.path}
            >
                {item?.children && generateRoutes(item.children)}
            </Route>
        );
    });
};

const router = generateRoutes(routes);
// 生成最终的路由表，附带动画效果
const handleRoutes = () => {
    const location = useLocation();
    const navigatorType = useNavigationType();
    // 生成后的router
    return (
        <TransitionGroup
            style={{ width: '100%', height: '100%' }}
            className="transition-page"
            key={location.pathname === '/login' || location.pathname === '/' ? location.pathname : ''} // 跳登录页不做动画，防止重定向问题
        >
            <CSSTransition
                timeout={200}
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#F5F6F9'
                }}
                classNames={ANIMATION_MAP[navigatorType]}
                key={location.key}
            >
                <div>
                    <Routes location={location}>{router}</Routes>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default handleRoutes;
