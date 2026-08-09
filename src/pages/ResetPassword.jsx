import { useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    resetPassword
} from "../services/authService";

function ResetPassword() {
    const [searchParams] = useSearchParams();

    const userId =
        searchParams.get("userId") || "";

    const token =
        searchParams.get("token") || "";

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!userId || !token) {
            setError(
                "Invalid password reset link."
            );
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError(
                "Please complete all password fields."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await resetPassword({
                    userId,
                    token,
                    newPassword
                });

            setSuccess(
                response.data?.message ||
                "Password reset successfully."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to reset password."
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

                        <h3 className="text-center mb-2">
                            Library Management System
                        </h3>

                        <h5 className="text-center mb-4">
                            Reset Password
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

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label
                                    htmlFor="newPassword"
                                    className="form-label"
                                >
                                    New Password
                                </label>

                                <input
                                    id="newPassword"
                                    type="password"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label
                                    htmlFor="confirmPassword"
                                    className="form-label"
                                >
                                    Confirm New Password
                                </label>

                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading
                                    ? "Resetting..."
                                    : "Reset Password"}
                            </button>

                        </form>

                        <div className="text-center mt-3">
                            <Link to="/login">
                                Back to Login
                            </Link>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;