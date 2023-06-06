import React from "react"
import { Layout } from 'antd';
import Logo from "../../assets/img/logo.png"

const AuthLayout = (props) => {
    return (
        <>
            <Layout>
                <section
                    className="min-vh-100 gradient-form"
                    style={{
                        background: "linear-gradient(rgba(3, 41, 9,0.8),rgba(3, 41, 9,0.8)),url('https://sipeta-kedaireka.com/img/sawah-1.jpg')",
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-xl-8">
                            <div className="card rounded-3 text-black" style={{ marginTop: 0 }}>
                                <div className="row g-0 m-auto">
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
                                            <h4 className="mb-4 text-center">
                                                Selamat datang di TemanTani!
                                            </h4>
                                            <p className="mb-0 text-justify">
                                                Platform investasi dan manajemen proyek pertanian dengan e-commerce hasil pertanian. Kami menyediakan layanan untuk mempertemukan investor dengan petani,
                                                serta memudahkan petani dalam menjual hasil pertaniannya.
                                            </p>
                                            <br />
                                            <p className="mb-0 text-center">
                                                TemanTani, teman terbaik petani Indonesia.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </Layout>
        </>
    )

}

export default AuthLayout