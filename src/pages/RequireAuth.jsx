import { Navigate, Outlet } from "react-router-dom";

const ROLE_DASHBOARD = {
    employee: "/employee",
    security: "/security",
    hod: "/hod",
    admin: "/admin",
};

export default function RequireAuth({ allowedRoles, loginPath }) {
    const user = JSON.parse(localStorage.getItem("vss_user"));

    console.log("AUTH CHECK:", user, allowedRoles);

    if (!user || !user.role) {
        localStorage.removeItem("vss_user");
        return <Navigate to={loginPath} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to={ROLE_DASHBOARD[user.role] || "/portal"}
                replace
            />
        );
    }

    return <Outlet />;
}
