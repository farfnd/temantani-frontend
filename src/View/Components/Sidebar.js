import { DesktopOutlined, FileOutlined, HomeOutlined, PaperClipOutlined, LogoutOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Modal, message } from 'antd';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import Cookies from 'js-cookie';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function getItem(label, key, icon, path = null, children) {
    return {
        key,
        icon,
        children,
        label,
        path,
    };
}

const items = [
    getItem('Dashboard', '1', <HomeOutlined />, '/admin/dashboard'),
    getItem('Projects', '2', <PaperClipOutlined />, '#', [
        getItem('Hire Worker', '3', <PaperClipOutlined />, '/admin/projects/hiring'),
        getItem('Ongoing Projects', '3', <PaperClipOutlined />, '/admin/projects/ongoing'),
    ]),
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const history = useHistory();
    const {
        loginStatus, setLoginStatus,
        role, setRole,
    } = useContext(UserContext);

    const handleLogout = () => {
        Modal.confirm({
            title: 'Logout',
            content: 'Are you sure you want to logout?',
            onOk: () => {
                setLoginStatus(false);
                setRole([]);
                Cookies.remove('token');
                history.push('/');

                message.success('Successfully logged out!');
                history.push('/');
            },
        });
    };

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <Link to="/">
                <div className="logo" style={{ height: '32px', background: 'rgba(255, 255, 255, 0.2)', margin: '16px' }} />
            </Link>
            <Menu theme="dark" selectedKeys={[location.pathname]} defaultOpenKeys={['sub1']} mode="inline">
                {items.map(item => (
                    item.children ? (
                        <SubMenu key={item.key} icon={item.icon} title={item.label}>
                            {item.children.map(child => (
                                <Menu.Item key={child.path}>
                                    <Link to={child.path}>{child.label}</Link>
                                </Menu.Item>
                            ))}
                        </SubMenu>
                    ) : (
                        <Menu.Item key={item.path} icon={item.icon}>
                            <Link to={item.path}>{item.label}</Link>
                        </Menu.Item>
                    )
                ))}
            </Menu>
            <div className='mt-3' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button variant="danger" onClick={handleLogout} className='w-75'>
                    { collapsed ? <LogoutOutlined /> : 'Logout'}
                </Button>
            </div>
        </Sider>
    )
}

export default Sidebar;
