import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">

        <Link className="navbar-brand fw-bold" to="/dashboard">
           Library Management System
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarContent"
        >
          <ul className="navbar-nav align-items-center">

            <li className="nav-item">
              <span className="nav-link text-white">
                Welcome, Admin
              </span>
            </li>

            <li className="nav-item ms-2">
              <button className="btn btn-outline-light">
                Logout
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;