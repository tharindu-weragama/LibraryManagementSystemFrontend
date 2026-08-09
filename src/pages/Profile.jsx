import { useState } from "react";
import { changePassword } from "../services/authService";
import useRole from "../hooks/useRole";

function Profile() {
    const { user, roles } = useRole();

    const [showPasswordForm, setShowPasswordForm] =
        useState(false);

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");

    const fullName =
        user?.fullName ||
        user?.FullName ||
        "Not available";

    const email =
        user?.email ||
        user?.Email ||
        "Not available";

    const role =
        Array.isArray(roles)
            ? roles.join(", ")
            : roles || "Not available";

    const resetPasswordForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError(
                "Please complete all password fields."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "New password and confirmation password do not match."
            );
            return;
        }

        if (currentPassword === newPassword) {
            setError(
                "New password must be different from the current password."
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await changePassword({
                    currentPassword,
                    newPassword
                });

            setSuccess(
                response.data?.message ||
                "Password changed successfully."
            );

            resetPasswordForm();
            setShowPasswordForm(false);
        } catch (error) {
            console.error(
                "Error changing password:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    Profile
                </h2>

                <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                        setShowPasswordForm(
                            !showPasswordForm
                        );

                        setError("");
                        setSuccess("");

                        if (showPasswordForm) {
                            resetPasswordForm();
                        }
                    }}
                >
                    {showPasswordForm
                        ? "Cancel"
                        : "Change Password"}
                </button>
            </div>

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            <div className="card mb-4 shadow-sm">
                <div className="card-header">
                    <h5 className="mb-0">
                        Account Information
                    </h5>
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4 fw-bold">
                            Full Name
                        </div>

                        <div className="col-md-8">
                            {fullName}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4 fw-bold">
                            Email
                        </div>

                        <div className="col-md-8">
                            {email}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 fw-bold">
                            Role
                        </div>

                        <div className="col-md-8">
                            <span className="badge bg-primary">
                                {role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordForm && (
                <div className="card shadow-sm">
                    <div className="card-header">
                        <h5 className="mb-0">
                            Change Password
                        </h5>
                    </div>

                    <div className="card-body">

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={
                                handleChangePassword
                            }
                        >
                            <div className="mb-3">
                                <label
                                    htmlFor="currentPassword"
                                    className="form-label"
                                >
                                    Current Password
                                </label>

                                <input
                                    id="currentPassword"
                                    type="password"
                                    className="form-control"
                                    value={
                                        currentPassword
                                    }
                                    onChange={(e) =>
                                        setCurrentPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

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
                                    value={
                                        newPassword
                                    }
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="new-password"
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
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Changing Password..."
                                    : "Change Password"}
                            </button>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;