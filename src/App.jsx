import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Publishers from "./pages/Publishers";
import Loans from "./pages/Loans";
import Fines from "./pages/Fines";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/books"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "Admin",
                                "Librarian",
                                "Member"
                            ]}
                        >
                            <Books />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "Admin",
                                "Librarian"
                            ]}
                        >
                            <Categories />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/publishers"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "Admin",
                                "Librarian"
                            ]}
                        >
                            <Publishers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/loans"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "Admin",
                                "Librarian",
                                "Member"
                            ]}
                        >
                            <Loans />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/fines"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "Admin",
                                "Librarian",
                                "Member"
                            ]}
                        >
                            <Fines />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "Admin"
                            ]}
                        >
                            <Users />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />
            </Route>

            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
}

export default App;