import { Navigate } from "react-router-dom";
import useRole from "../hooks/useRole";

function ProtectedRoute({
    children,
    allowedRoles = []
}) {
    const token =
        localStorage.getItem("accessToken");

    const { roles } = useRole();

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (allowedRoles.length > 0) {
        const userRoles = Array.isArray(roles)
            ? roles
            : [roles];

        const hasPermission =
            userRoles.some((role) =>
                allowedRoles.includes(role)
            );

        if (!hasPermission) {
            return (
                <div className="container mt-5">
                    <div className="alert alert-danger text-center">
                        <h4>
                            Access Denied
                        </h4>

                        <p className="mb-0">
                            You do not have permission to access this page.
                        </p>
                    </div>
                </div>
            );
        }
    }

    return children;
}

export default ProtectedRoute;