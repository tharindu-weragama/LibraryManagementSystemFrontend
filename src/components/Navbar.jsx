import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import api from "../services/api";

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
        try {
            await api.post("/Account/revoke");
        } catch (error) {
            console.error("Logout revoke failed:", error);
        } finally {
            dispatch(logout());
            navigate("/login");
        }
    };

    const displayName =
        user?.fullName ||
        user?.FullName ||
        "User";

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container-fluid">

                <Link
                    className="navbar-brand fw-bold"
                    to="/dashboard"
                >
                    Library Management System
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse justify-content-end"
                    id="navbarContent"
                >
                    <ul className="navbar-nav align-items-center">

                        <li className="nav-item">
                            <span className="nav-link text-white">
                                Welcome, {displayName}
                            </span>
                        </li>

                        <li className="nav-item ms-lg-2">
                            <button
                                className="btn btn-outline-light"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;