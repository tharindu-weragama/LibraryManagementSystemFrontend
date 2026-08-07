import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="bg-light border-end vh-100 p-3">

      <h5 className="mb-4">Menu</h5>

      <ul className="nav flex-column">

        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/books">
            Books
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/categories">
            Categories
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/publishers">
            Publishers
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/loans">
            Loans
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/fines">
            Fines
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/users">
            Users
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>

      </ul>

    </aside>
  );
}

export default Sidebar;