import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import { createLibrarian } from "../services/authService";
import useRole from "../hooks/useRole";

function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [fullName, setFullName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [creating, setCreating] =
        useState(false);

    const { isAdmin } = useRole();

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getUsers();

            setUsers(
                response.data || []
            );
        } catch (error) {
            console.error(
                "Error loading users:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            loadUsers();
        }
    }, [isAdmin]);

    const handleCreateLibrarian = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !fullName.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError(
                "Please complete all fields."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setCreating(true);

            const response =
                await createLibrarian({
                    fullName:
                        fullName.trim(),
                    email:
                        email.trim(),
                    password
                });

            setSuccess(
                response.data?.message ||
                "Librarian account created successfully."
            );

            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setShowCreateForm(false);

            await loadUsers();
        } catch (error) {
            console.error(
                "Error creating librarian:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create librarian account."
            );
        } finally {
            setCreating(false);
        }
    };

    const filteredUsers =
        users.filter((user) => {
            const searchValue =
                search
                    .toLowerCase()
                    .trim();

            const fullName =
                user.fullName
                    ?.toLowerCase() || "";

            const email =
                user.email
                    ?.toLowerCase() || "";

            const roles =
                user.roles
                    ?.join(" ")
                    .toLowerCase() || "";

            return (
                fullName.includes(
                    searchValue
                ) ||
                email.includes(
                    searchValue
                ) ||
                roles.includes(
                    searchValue
                )
            );
        });

    if (!isAdmin) {
        return (
            <div className="alert alert-danger">
                You do not have permission to access the Users page.
            </div>
        );
    }

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h2 className="mb-0">
                    Users
                </h2>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowCreateForm(
                            !showCreateForm
                        );

                        setError("");
                        setSuccess("");
                    }}
                >
                    {showCreateForm
                        ? "Close"
                        : "Create Librarian"}
                </button>

            </div>

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {showCreateForm && (
                <div className="card mb-4">

                    <div className="card-header">
                        <h5 className="mb-0">
                            Create Librarian Account
                        </h5>
                    </div>

                    <div className="card-body">

                        <form
                            onSubmit={
                                handleCreateLibrarian
                            }
                        >

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
                                        setFullName(
                                            e.target.value
                                        )
                                    }
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
                                        setEmail(
                                            e.target.value
                                        )
                                    }
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
                                        setPassword(
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
                                    Confirm Password
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

                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Librarian"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowCreateForm(
                                            false
                                        );

                                        setFullName("");
                                        setEmail("");
                                        setPassword("");
                                        setConfirmPassword("");
                                        setError("");
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            <div className="mb-3">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, email or role..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

            </div>

            {loading ? (

                <div className="text-center mt-4">

                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-2">
                        Loading users...
                    </p>

                </div>

            ) : (

                <div className="table-responsive">

                    <table className="table table-bordered table-striped table-hover">

                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredUsers.length > 0 ? (

                                filteredUsers.map(
                                    (user, index) => (

                                        <tr
                                            key={
                                                user.userId
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                {user.fullName}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                {user.roles?.length > 0
                                                    ? user.roles.join(
                                                          ", "
                                                      )
                                                    : "No Role"}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center"
                                    >
                                        No users found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default Users;