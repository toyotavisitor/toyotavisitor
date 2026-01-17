import { Navigate, Outlet } from "react-router-dom";

const ROLE_DASHBOARD = {
    employee: "/employee",
    security: "/security",
    hod: "/hod",
    admin: "/admin",
};

export default function RequireAuth({ allowedRoles, loginPath }) {
    const user = JSON.parse(localStorage.getItem("vss_user"));

    // 🔴 Not logged in → redirect to login
    if (!user) {
        return <Navigate to={loginPath} replace />;
    }

    // 🔴 Logged in but wrong role → redirect to their own dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const redirectPath = ROLE_DASHBOARD[user.role] || "/";
        return <Navigate to={redirectPath} replace />;
    }

    // ✅ Allowed
    return <Outlet />;
}
