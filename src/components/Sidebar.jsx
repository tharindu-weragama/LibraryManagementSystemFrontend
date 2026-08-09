import { NavLink } from "react-router-dom";
import useRole from "../hooks/useRole";

function Sidebar() {
    const {
        isAdmin,
        isLibrarian,
        isMember
    } = useRole();

    const getLinkClass = ({ isActive }) => {
        return `
            nav-link
            rounded-3
            px-3
            py-2
            mb-2
            fw-medium
            ${isActive
                ? "bg-primary text-white shadow-sm"
                : "text-dark"
            }
        `;
    };

    return (
        <aside
            className="
                bg-white
                border-end
                p-3
                p-lg-4
                sidebar-panel
            "
        >
            <h4 className="fw-bold mb-4">
                Menu
            </h4>

            <nav className="nav flex-column">

                {(isAdmin || isLibrarian) && (
                    <NavLink
                        to="/dashboard"
                        className={getLinkClass}
                    >
                        Dashboard
                    </NavLink>
                )}

                <NavLink
                    to="/books"
                    className={getLinkClass}
                >
                    Books
                </NavLink>

                {(isAdmin || isLibrarian) && (
                    <>
                        <NavLink
                            to="/categories"
                            className={getLinkClass}
                        >
                            Categories
                        </NavLink>

                        <NavLink
                            to="/publishers"
                            className={getLinkClass}
                        >
                            Publishers
                        </NavLink>

                        <NavLink
                            to="/loans"
                            className={getLinkClass}
                        >
                            Loans
                        </NavLink>

                        <NavLink
                            to="/fines"
                            className={getLinkClass}
                        >
                            Fines
                        </NavLink>
                    </>
                )}

                {isAdmin && (
                    <NavLink
                        to="/users"
                        className={getLinkClass}
                    >
                        Users
                    </NavLink>
                )}

                {isMember && (
                    <>
                        <NavLink
                            to="/my-loans"
                            className={getLinkClass}
                        >
                            My Loans
                        </NavLink>

                        <NavLink
                            to="/my-fines"
                            className={getLinkClass}
                        >
                            My Fines
                        </NavLink>
                    </>
                )}

                <NavLink
                    to="/profile"
                    className={getLinkClass}
                >
                    Profile
                </NavLink>

            </nav>
        </aside>
    );
}

export default Sidebar;