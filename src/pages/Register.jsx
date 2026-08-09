import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please complete all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/Account/register", {
                fullName: fullName.trim(),
                email: email.trim(),
                password,
            });

            setSuccess(
                response.data?.message ||
                "Account created successfully."
            );

            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create the account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">
            <div className="row justify-content-center w-100">
                <div className="col-sm-10 col-md-7 col-lg-5">
                    <div className="card shadow-sm p-4">
                        <h3 className="text-center mb-2">
                            Library Management System
                        </h3>

                        <h5 className="text-center mb-4">
                            Create Member Account
                        </h5>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label
                                    htmlFor="fullName"
                                    className="form-label"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    type="text"
                                    className="form-control"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    autoComplete="name"
                                    required
                                />
                            </div>

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
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="confirmPassword"
                                    className="form-label"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        <hr className="my-4" />

                        <div className="text-center">
                            <span>
                                Already have an account?{" "}
                            </span>

                            <Link to="/login">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;