import { useState } from "react";
import { changePassword } from "../services/authService";
import useRole from "../hooks/useRole";
import AlertMessage from "../components/AlertMessage";

function PasswordForm({
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    onSubmit
}) {
    return (
        <form onSubmit={onSubmit}>

            <AlertMessage
                type="danger"
                message={error}
            />

            <div className="mb-3">
                <label
                    htmlFor="currentPassword"
                    className="form-label fw-semibold"
                >
                    Current Password
                </label>

                <input
                    id="currentPassword"
                    type="password"
                    className="form-control"
                    value={currentPassword}
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
                    className="form-label fw-semibold"
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
                    autoComplete="new-password"
                    required
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="confirmPassword"
                    className="form-label fw-semibold"
                >
                    Confirm Password
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
                    ? "Updating..."
                    : "Update Password"}
            </button>

        </form>
    );
}

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

    const memberId =
        user?.memberCode ||
        user?.MemberCode ||
        user?.memberNumber ||
        user?.MemberNumber ||
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

    const openPasswordForm = () => {
        setSuccess("");
        setError("");
        setShowPasswordForm(true);
    };

    const closePasswordForm = () => {
        resetPasswordForm();
        setShowPasswordForm(false);
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

    const passwordFormProps = {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        error,
        onSubmit: handleChangePassword
    };

    return (
        <div>

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">

                <div>
                    <h2 className="mb-1">
                        Profile
                    </h2>

                    <p className="text-muted mb-0">
                        View your account information.
                    </p>
                </div>

                <button
                    type="button"
                    className={
                        showPasswordForm
                            ? "btn btn-outline-secondary px-4"
                            : "btn btn-outline-primary px-4"
                    }
                    onClick={
                        showPasswordForm
                            ? closePasswordForm
                            : openPasswordForm
                    }
                >
                    {showPasswordForm
                        ? "Cancel"
                        : "Change Password"}
                </button>

            </div>

            <AlertMessage
                type="success"
                message={success}
            />

            <div className="row g-4">

                <div
                    className={
                        showPasswordForm
                            ? "col-12 col-lg-8"
                            : "col-12"
                    }
                >
                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">
                                Account Information
                            </h5>
                        </div>

                        <div className="card-body p-4">

                            <div className="row py-3 border-bottom">
                                <div className="col-sm-4 text-muted fw-semibold">
                                    Member ID
                                </div>

                                <div className="col-sm-8 fw-semibold">
                                    {memberId}
                                </div>
                            </div>

                            <div className="row py-3 border-bottom">
                                <div className="col-sm-4 text-muted fw-semibold">
                                    Full Name
                                </div>

                                <div className="col-sm-8 fw-semibold">
                                    {fullName}
                                </div>
                            </div>

                            <div className="row py-3 border-bottom">
                                <div className="col-sm-4 text-muted fw-semibold">
                                    Email
                                </div>

                                <div className="col-sm-8 text-break">
                                    {email}
                                </div>
                            </div>

                            <div className="row py-3">
                                <div className="col-sm-4 text-muted fw-semibold">
                                    Role
                                </div>

                                <div className="col-sm-8">
                                    <span className="badge bg-primary px-3 py-2">
                                        {role}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {showPasswordForm && (
                    <div className="col-lg-4 d-none d-lg-block">

                        <div className="card shadow-sm border-0 h-100">

                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0">
                                    Change Password
                                </h5>
                            </div>

                            <div className="card-body p-4">

                                <PasswordForm
                                    {...passwordFormProps}
                                />

                            </div>

                        </div>

                    </div>
                )}

            </div>

            {showPasswordForm && (
                <div
                    className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
                    style={{
                        backgroundColor:
                            "rgba(0, 0, 0, 0.5)",
                        zIndex: 1050,
                        overflowY: "auto"
                    }}
                >
                    <div className="d-flex justify-content-center align-items-start min-vh-100 p-3">

                        <div
                            className="card shadow-lg border-0 w-100 mt-4"
                            style={{
                                maxWidth: "420px"
                            }}
                        >

                            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">

                                <h5 className="mb-0">
                                    Change Password
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={
                                        closePasswordForm
                                    }
                                />

                            </div>

                            <div className="card-body p-4">

                                <PasswordForm
                                    {...passwordFormProps}
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100 mt-2"
                                    onClick={
                                        closePasswordForm
                                    }
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Profile;