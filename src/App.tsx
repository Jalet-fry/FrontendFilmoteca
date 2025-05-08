// // App.tsx
// import { ActorList, ActorForm, DirectorList, DirectorForm } from "./components";
//
// function App() {
//     return (
//         <div>
//             <h1>Фильмотека</h1>
//
//             <h2>Актёры</h2>
//             <ActorForm />
//             <ActorList />
//
//             <h2>Режиссёры</h2>
//             <DirectorForm />
//             <DirectorList />
//         </div>
//     );
// }
//
// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined, VideoCameraOutlined, TeamOutlined } from '@ant-design/icons';
import ActorsPage from './page/ActorPage';
import DirectorsPage from './page/DirectorPage';
// import FilmsPage from './page/FilmPage';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible>
                    <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            <Link to="/actors">Actors</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<TeamOutlined />}>
                            <Link to="/directors">Directors</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<VideoCameraOutlined />}>
                            <Link to="/films">Films</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Routes>
                                <Route path="/actors" element={<ActorsPage />} />
                                <Route path="/directors" element={<DirectorsPage />} />
                                {/*<Route path="/films" element={<FilmsPage />} />*/}
                                {/*<Route path="/" element={<FilmsPage />} />*/}
                            </Routes>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Film Management System ©2023
                    </Footer>
                </Layout>
            </Layout>
        </Router>
    );
};

export default App;