import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import libraryLoginImage from "../assets/images/library-login.jpg";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getRedirectPath = (user) => {
        const roles =
            user?.roles ||
            user?.Roles ||
            [];

        const normalizedRoles =
            Array.isArray(roles)
                ? roles.map((role) =>
                    String(role).toLowerCase()
                )
                : [
                    String(roles).toLowerCase()
                ];

        if (
            normalizedRoles.includes("admin") ||
            normalizedRoles.includes("librarian")
        ) {
            return "/dashboard";
        }

        if (
            normalizedRoles.includes("member")
        ) {
            return "/books";
        }

        return "/profile";
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (
            !email.trim() ||
            !password
        ) {
            setError(
                "Please enter both email and password."
            );

            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await login({
                email: email.trim(),
                password
            });

            const user =
                response.data.user;

            localStorage.setItem(
                "accessToken",
                response.data.accessToken
            );

            localStorage.setItem(
                "refreshToken",
                response.data.refreshToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            dispatch(
                loginSuccess(user)
            );

            navigate(
                getRedirectPath(user),
                {
                    replace: true
                }
            );
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center px-3 py-4">

            <div
                className="w-100"
                style={{
                    maxWidth: "1120px"
                }}
            >
                <div className="row g-0 bg-white shadow-lg rounded-4 overflow-hidden">

                    <div
                        className="col-lg-7 d-none d-lg-flex position-relative text-white"
                        style={{
                            minHeight: "610px",
                            backgroundImage: `url(${libraryLoginImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                        }}
                    >
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                background:
                                    "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.72))"
                            }}
                        />

                        <div className="position-relative d-flex flex-column h-100 p-5">

                            <div>
                                <div className="small text-uppercase fw-semibold mb-3 text-white-50">
                                    Digital Library Portal
                                </div>

                                <h1
                                    className="fw-bold"
                                    style={{
                                        fontSize: "2.6rem",
                                        lineHeight: "1.1",
                                        maxWidth: "520px"
                                    }}
                                >
                                    Library Management System
                                </h1>
                            </div>

                            <div className="mt-auto">
                                <p
                                    className="fs-5 mb-0 text-white-50"
                                    style={{
                                        maxWidth: "480px"
                                    }}
                                >
                                    Manage books, borrowing, returns and fines securely.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="col-12 col-lg-5">

                        <div className="h-100 d-flex align-items-center justify-content-center p-4 p-md-5">

                            <div
                                className="w-100"
                                style={{
                                    maxWidth: "410px"
                                }}
                            >

                                <div className="mb-4">

                                    <h2 className="fw-bold mb-2 text-dark">
                                        Welcome Back
                                    </h2>

                                    <p className="text-muted mb-0">
                                        Sign in to continue to your account.
                                    </p>

                                </div>

                                {error && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {error}
                                    </div>
                                )}

                                <form
                                    onSubmit={
                                        handleLogin
                                    }
                                >
                                    <div className="mb-3">

                                        <label
                                            htmlFor="email"
                                            className="form-label fw-semibold"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="email"
                                            required
                                            style={{
                                                minHeight: "48px"
                                            }}
                                        />

                                    </div>

                                    <div className="mb-2">

                                        <label
                                            htmlFor="password"
                                            className="form-label fw-semibold"
                                        >
                                            Password
                                        </label>

                                        <input
                                            id="password"
                                            type="password"
                                            className="form-control"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="current-password"
                                            required
                                            style={{
                                                minHeight: "48px"
                                            }}
                                        />

                                    </div>

                                    <div className="text-end mb-4">

                                        <Link
                                            to="/forgot-password"
                                            className="text-decoration-none"
                                        >
                                            Forgot Password?
                                        </Link>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Logging in..."
                                            : "Login"}
                                    </button>

                                </form>

                                <div className="text-center my-4">
                                    <span className="text-muted">
                                        Don't have an account?
                                    </span>
                                </div>

                                <Link
                                    to="/register"
                                    className="btn btn-outline-primary w-100 py-2"
                                >
                                    Create Account
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}

export default Login;