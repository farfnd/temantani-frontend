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
            <Layout>
                {
                    Cookies.get('token') !== undefined && (
                        <>
                            <Sidebar />
                        </>
                    )
                }
                <Layout>

                    <Navbar />
                    <div className="row">
                        <div className="section">
                            {props.body}
                        </div>
                    </div>

                    <Footer style={{ textAlign: 'center' }}>Final Project ReactJS Sanbercode<br />Made with ❤ by Farhan</Footer>
                </Layout>
            </Layout>
        </>
    )

}

export default LayoutComponent