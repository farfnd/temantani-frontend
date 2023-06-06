import React, { useContext } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { Layout } from 'antd';
import { UserContext } from "../../Contexts/UserContext";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo.png"
import Button from 'react-bootstrap/Button';

const { Footer } = Layout;

const LayoutComponent = (props) => {

    const { setLoginStatus } = useContext(UserContext)

    return (
        <>
            <Layout>
                <section className="h-100 gradient-form" style={{ backgroundColor: '#eee' }}>
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-xl-10">
                            <div className="card rounded-3 text-black">
                                <div className="row g-0">
                                    <div className="col-lg-6 my-auto">
                                        <div className="card-body p-md-5 mx-md-4">

                                            <div className="text-center">
                                                <img src={Logo} style={{ width: '100px' }} alt="logo" />
                                                <h4 className="mt-1 mb-5 pb-1">TemanTani</h4>
                                            </div>

                                            {props.body}

                                        </div>
                                    </div>
                                    <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                        <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                            <h4 className="mb-4 text-center">Selamat datang di TemanTani!</h4>
                                            <p className="mb-0 text-justify">Platform investasi dan manajemen proyek pertanian dengan e-commerce hasil pertanian.
                                                Kami menyediakan layanan untuk mempertemukan investor dengan petani,
                                                serta memudahkan petani dalam menjual hasil pertaniannya.</p>
                                            <br />
                                            <p className="mb-0">TemanTani, teman terbaik petani Indonesia.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer style={{ textAlign: 'center', color: 'white' }}>TemanTani ©2023 Created by TemanTani Team</Footer>
            </Layout>
        </>
    )

}

export default LayoutComponent