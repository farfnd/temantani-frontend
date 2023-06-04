import React, { useState, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = props => {
    const [loginStatus, setLoginStatus] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    return (
        <UserContext.Provider value={{
            loginStatus, setLoginStatus,
            collapsed, setCollapsed
        }}>
            {props.children}
        </UserContext.Provider>
    );
};
