import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Cookies from "js-cookie";

function RenderAuthButtons(props) {
    const role = props.role;
    const isLoggedIn = Cookies.get("token") !== undefined;

    if (isLoggedIn) {
        return (
            <>
                {role.some(role => role.toLowerCase().startsWith('admin')) && (
                    <Link to="/admin">
                        <Button variant="primary" className="w-100 mt-3">
                            Admin Dashboard
                        </Button>
                    </Link>
                )}
                {role.includes("WORKER") && (
                    <Link to="/worker">
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
                        </Button>
                    </Link>
                </div>

                <div className="d-grid gap-2">
                    <Link to="/register">
                        <Button variant="outline-success" className="w-100">
                            Daftar
                        </Button>
                    </Link>
                </div>
            </>
        );
    }
}

export default RenderAuthButtons;
