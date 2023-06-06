import React, { useEffect, useContext } from "react";
import { message } from 'antd';
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import Cookies from "js-cookie";
import RenderAuthButtons from "../Components/RenderAuthButtons";

const Home = () => {
    const {
        loginStatus, setLoginStatus,
        role, setRole,
    } = useContext(UserContext);

    useEffect(() => {
        document.title = 'Home';
    }, []);

    let history = useHistory();

    const handleLogout = () => {
        setLoginStatus(false);
        setRole([]);
        Cookies.remove('token');
        history.push('/');

        message.success('Successfully logged out!');
    }

    return (
        <RenderAuthButtons onLogOut={handleLogout} role={role} />
    );
}

export default Home;
