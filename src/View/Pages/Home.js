import React, { useEffect, useState, useContext } from "react"
import { MoviesContext } from "../../Contexts/MoviesContext";
import { GamesContext } from "../../Contexts/GamesContext"
import { message } from 'antd';
import { Link, useHistory } from "react-router-dom"
import Logo from "../../assets/img/logo.png"
import Button from 'react-bootstrap/Button';
import { UserContext } from "../../Contexts/UserContext";
import Cookies from "js-cookie";

function LoginForm(props) {
    const role = props.role;
    console.log(role);

    const isLoggedIn = Cookies.get("token") !== undefined;

    if (isLoggedIn) {
        return (
            <>
                {role.some(role => role.toLowerCase().startsWith('admin')) && (
                    <Link to="/admin-dashboard">
                        <Button variant="primary" className="w-100 mt-3">
                            Admin Dashboard
                        </Button>
                    </Link>
                )}
                {role.includes("WORKER") && (
                    <Link to="/worker-dashboard">
                        <Button variant="success" className="w-100 mt-3">
                            Worker Dashboard
                        </Button>
                    </Link>
                )}
                {role.includes("BUYER") && (
                    <Link to="/store">
                        <Button variant="warning" className="w-100 mt-3">
                            Store
                        </Button>
                    </Link>
                )}
                <Button variant="danger" className="w-100 mt-3" onClick={props.onLogOut}>
                    Logout
                </Button>
            </>
        );
    } else {
        return (
            <>
                <div className="d-grid gap-2 mb-3">
                    <Link to="/login">
                        <Button variant="success" className="w-100">
                            Masuk
                        </Button>{" "}
                    </Link>
                </div>

                <div className="d-grid gap-2">
                    <Link to="/register">
                        <Button variant="outline-success" className="w-100">
                            Daftar
                        </Button>{" "}
                    </Link>
                </div>
            </>
        );
    }
}


const Home = () => {
    const {
        loginStatus, setLoginStatus,
        role, setRole,
    } = useContext(UserContext)

    useEffect(() => {
        document.title = 'Home'
        console.log(role)
    }, [])


    let history = useHistory()

    const handleLogout = () => {
        setLoginStatus(false)
        setRole([])
        Cookies.remove('token')
        history.push('/')

        message.success('Successfully logged out!');
    }

    return (
        <LoginForm onLogOut={handleLogout} role={role} />
    )
}

export default Home