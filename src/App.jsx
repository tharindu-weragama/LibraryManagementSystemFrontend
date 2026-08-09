import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Publishers from "./pages/Publishers";
import Loans from "./pages/Loans";
import Fines from "./pages/Fines";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import MyLoans from "./pages/MyLoans";
import MyFines from "./pages/MyFines";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

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
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Librarian"
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
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
                "Librarian"
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
                "Librarian"
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
          path="/my-loans"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Member"
              ]}
            >
              <MyLoans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-fines"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Member"
              ]}
            >
              <MyFines />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Librarian",
                "Member"
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
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