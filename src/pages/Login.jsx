import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await login({
                email,
                password,
            });

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
                JSON.stringify(response.data.user)
            );

            dispatch(
                loginSuccess(response.data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">
            <div className="row justify-content-center w-100">
                <div className="col-sm-10 col-md-6 col-lg-4">

                    <div className="card shadow-sm p-4">

                        <h3 className="text-center mb-4">
                            Library Management System
                        </h3>

                        <h5 className="text-center mb-4">
                            Login
                        </h5>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>

                            <div className="mb-3">
                                <label
                                    htmlFor="email"
                                    className="form-label"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="password"
                                    className="form-label"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"}
                            </button>

                        </form>

                        <div className="text-center mt-3">
                            <Link to="/forgot-password">
                                Forgot Password?
                            </Link>
                        </div>

                        <hr className="my-4" />

                        <div className="text-center">

                            <p className="mb-2">
                                Don't have an account?
                            </p>

                            <Link
                                to="/register"
                                className="btn btn-outline-primary w-100"
                            >
                                Create Account
                            </Link>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;