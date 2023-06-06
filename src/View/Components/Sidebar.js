import { DesktopOutlined, FileOutlined, HomeOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
    getItem('Projects', '2', <PaperClipOutlined />, '/admin/projects'),
    // getItem('User', 'sub1', <UserOutlined />, [
    //     getItem('Tom', '3'),
    //     getItem('Bill', '4'),
    //     getItem('Alex', '5'),
    // ]),
    // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    // getItem('Files', '9', <FileOutlined />),
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="logo" style={{ height: '32px', background: 'rgba(255, 255, 255, 0.2)', margin: '16px' }} />
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
        </Sider>
    )
}

export default Sidebar;
