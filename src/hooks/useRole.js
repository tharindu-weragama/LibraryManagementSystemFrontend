import { useSelector } from "react-redux";

function useRole() {
    const user = useSelector((state) => state.auth.user);

    const roles = user?.roles || user?.Roles || [];

    const normalizedRoles = Array.isArray(roles)
        ? roles.map((role) => role.toLowerCase())
        : [String(roles).toLowerCase()];

    const isAdmin = normalizedRoles.includes("admin");
    const isLibrarian = normalizedRoles.includes("librarian");
    const isMember = normalizedRoles.includes("member");

    const hasRole = (role) => {
        return normalizedRoles.includes(
            role.toLowerCase()
        );
    };

    const hasAnyRole = (...allowedRoles) => {
        return allowedRoles.some((role) =>
            normalizedRoles.includes(
                role.toLowerCase()
            )
        );
    };

    return {
        user,
        roles,
        isAdmin,
        isLibrarian,
        isMember,
        hasRole,
        hasAnyRole,
    };
}

export default useRole;