import { Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/books" element={<Books />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/publishers" element={<Publishers />} />
      <Route path="/loans" element={<Loans />} />
      <Route path="/fines" element={<Fines />} />
      <Route path="/users" element={<Users />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;