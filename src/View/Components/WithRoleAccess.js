import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";

const withRoleAccess = (allowedRoles) => (WrappedComponent) => {
    const WithRoleAccess = () => {
        const [role] = useContext(UserContext);

        const userRole = role;
        const isRoleAllowed = allowedRoles.includes(userRole);

        if (!isRoleAllowed) {
            return <Redirect to="/" />;
        }

        return <WrappedComponent />;
    };

    return WithRoleAccess;
};

export default withRoleAccess;
