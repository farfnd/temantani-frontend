import React, { useContext } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { Layout } from 'antd';
import { UserContext } from "../../Contexts/UserContext";
import Cookies from "js-cookie";

const { Footer } = Layout;

const LayoutComponent = (props) => {

    const { setLoginStatus } = useContext(UserContext)

    return (
        <>
            <Layout style={{ minHeight: '100vh'}}>
                <Sidebar />
                <Layout>

                    <Navbar />
                    {props.body}
                </Layout>
            </Layout>
        </>
    )

}

export default LayoutComponent