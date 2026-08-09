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
            setError("Please enter your email.");
            return;
        }

        try {
            setLoading(true);

            const response =
                await forgotPassword(email.trim());

            setSuccess(
                response.data?.message ||
                "Password reset instructions have been sent."
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to process the request."
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
                            Forgot Password
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
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send Reset Link"}
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

export default ForgotPassword;