import React, { useContext } from "react"
import { Layout } from 'antd';
import { UserContext } from "../../Contexts/UserContext";
import Cookies from "js-cookie";
import WorkerNavbar from "./WorkerNavbar";

const { Content, Footer } = Layout;

const WorkerLayout = (props) => {

    const { user, setLoginStatus } = useContext(UserContext)

    return (
        <>
            <Layout style={{ minHeight: '100vh'}}>
                <Layout>

                    <WorkerNavbar />
                    <Content className="mx-3">
                        {props.body}
                    </Content>
                </Layout>
            </Layout>
        </>
    )

}

export default WorkerLayout