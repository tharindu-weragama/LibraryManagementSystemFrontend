import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const response =
                await forgotPassword(email.trim());

            setSuccess(
                response.data?.message ||
                "Password reset instructions have been sent to your email."
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to process your request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">

            <div className="row justify-content-center w-100">

                <div className="col-sm-10 col-md-6 col-lg-5">

                    <div className="card shadow-lg border-0 rounded-4 p-4">

                        <div className="text-center mb-4">

                            <h5 className="text-primary fw-semibold mb-2">
                                Library Management System
                            </h5>

                            <h2 className="fw-bold mb-2">
                                Forgot Password
                            </h2>

                            <p className="text-muted mb-0">
                                Enter your registered email address and we'll send you a password reset link.
                            </p>

                        </div>

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
                                        setEmail(e.target.value)
                                    }
                                    style={{
                                        minHeight: "48px"
                                    }}
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2"
                                disabled={loading}
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send Reset Link"}
                            </button>

                        </form>

                        <div className="text-center mt-4">

                            <Link
                                to="/login"
                                className="text-decoration-none"
                            >
                                ← Back to Login
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;