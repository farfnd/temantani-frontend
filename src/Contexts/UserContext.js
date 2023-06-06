import Cookies from "js-cookie";
import React, { useState, createContext } from "react";
import jwt_decode from 'jwt-decode'

export const UserContext = createContext();

export const UserProvider = props => {
    const [loginStatus, setLoginStatus] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [role, setRole] = useState(() => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = jwt_decode(token);
            return decoded.roles || [];
        }
        return [];
    });

    return (
        <UserContext.Provider value={{
            loginStatus, setLoginStatus,
            collapsed, setCollapsed,
            role, setRole
        }}>
            {props.children}
        </UserContext.Provider>
    );
};
