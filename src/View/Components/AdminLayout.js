import React, { useContext } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { Layout } from 'antd';
import { UserContext } from "../../Contexts/UserContext";
import Cookies from "js-cookie";

const { Content, Footer } = Layout;

const AdminLayout = (props) => {

    const { setLoginStatus } = useContext(UserContext)

    return (
        <>
            <Layout style={{ minHeight: '100vh'}}>
                <Sidebar />
                <Layout>
                    <Content className="mx-3">
                        {props.body}
                    </Content>
                </Layout>
            </Layout>
        </>
    )

}

export default AdminLayout