import React, { useContext, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Cookies from "js-cookie";
import { UserContext } from "../../Contexts/UserContext";
import { Layout, Menu, message } from 'antd';
import SubMenu from "antd/lib/menu/SubMenu";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

const Navbar = () => {

    const { loginStatus, setLoginStatus, collapsed, setCollapsed } = useContext(UserContext)
    const { Header } = Layout;

    let history = useHistory()

    const handleLogout = () => {
        setLoginStatus(false)
        Cookies.remove('user')
        Cookies.remove('email')
        Cookies.remove('token')
        history.push('/login')

        message.success('Successfully logged out!');
    }

    const toggleSidebar = (e) => collapsed ? setCollapsed(false) : setCollapsed(true)

    return (
        <>
            <Header className="topnav">
                <Menu theme="dark" mode="horizontal" style={{ marginLeft: "auto" }} disabledOverflow="true">
                    {
                        Cookies.get('token') !== undefined && (
                            <>
                                <SubMenu key="SubMenu" title={Cookies.get('user')}>
                                    <Menu.Item key="4">
                                        <Link to="/change-password">Change Password</Link>
                                    </Menu.Item>
                                    <Menu.Item key="5" onClick={handleLogout}>
                                        <Link to="/#">Logout</Link>
                                    </Menu.Item>
                                </SubMenu>
                            </>
                        )
                    }
                </Menu>
            </Header>
        </>
    )
}

export default Navbar