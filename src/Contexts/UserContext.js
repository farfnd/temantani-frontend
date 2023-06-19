import Cookies from "js-cookie";
import React, { useState, createContext } from "react";
import jwt_decode from 'jwt-decode'
import config from "../config";

export const UserContext = createContext();

export const UserProvider = props => {
    const [loginStatus, setLoginStatus] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [user, setUser] = useState({});
    const [role, setRole] = useState(() => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = jwt_decode(token);
            return decoded.roles || [];
        }
        return [];
    });

    const fetchUser = async () => {
        try {
            const response = await fetch(`${config.api.userService}/me`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + Cookies.get('token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserIfEmpty = async () => {
        if (Object.keys(user).length === 0 && user.constructor === Object) {
            await fetchUser();
        }
    };

    return (
        <UserContext.Provider value={{
            loginStatus, setLoginStatus,
            collapsed, setCollapsed,
            role, setRole,
            user, setUser,
            fetchUser, fetchUserIfEmpty
        }}>
            {props.children}
        </UserContext.Provider>
    );
};
