import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import api from "../services/api";
import useRole from "../hooks/useRole";

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(
        (state) => state.auth.user
    );

    const {
        isAdmin,
        isLibrarian,
        isMember
    } = useRole();

    const displayName =
        user?.fullName ||
        user?.FullName ||
        "User";

    const roleLabel =
        isAdmin
            ? "Admin"
            : isLibrarian
                ? "Librarian"
                : isMember
                    ? "Member"
                    : "User";

    const homePath =
        isMember
            ? "/books"
            : "/dashboard";

    const handleLogout = async () => {
        try {
            await api.post(
                "/Account/revoke"
            );
        } catch (error) {
            console.error(
                "Logout revoke failed:",
                error
            );
        } finally {
            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "refreshToken"
            );

            localStorage.removeItem(
                "user"
            );

            dispatch(
                logout()
            );

            navigate(
                "/login",
                {
                    replace: true
                }
            );
        }
    };

    return (
        <nav className="navbar navbar-dark bg-dark shadow-sm py-3">

            <div className="container-fluid px-3 px-md-4">

                <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between w-100 gap-3">

                    <Link
                        className="navbar-brand fw-bold mb-0"
                        to={homePath}
                    >
                        Library Management System
                    </Link>

                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 ms-lg-auto">

                        <div className="text-white">

                            <div className="fw-semibold">
                                {displayName}
                            </div>

                            <div className="small text-white-50">
                                {roleLabel}
                            </div>

                        </div>

                        <Link
                            to="/profile"
                            className="btn btn-outline-light"
                        >
                            Profile
                        </Link>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={
                                handleLogout
                            }
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;