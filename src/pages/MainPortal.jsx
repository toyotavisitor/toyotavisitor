import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const roles = [
    {
        title: "Visitor",
        desc: "Register & enter the facility",
        path: "/visitor",
        color: "from-indigo-600 to-indigo-800",
        primary: true,
    },
    {
        title: "Employee",
        desc: "Approve & manage visitors",
        path: "/employee/login",
        color: "from-blue-600 to-blue-800",
    },
    {
        title: "Security",
        desc: "Verify & scan visitors",
        path: "/security/login",
        color: "from-green-600 to-green-800",
    },
    {
        title: "HOD",
        desc: "Department visitor overview",
        path: "/hod/login",
        color: "from-purple-600 to-purple-800",
    },
    {
        title: "Admin",
        desc: "System & user management",
        path: "/admin/login",
        color: "from-red-600 to-red-800",
    },
    {
        title: "Sign Up",
        desc: "Create a new account",
        path: "/signup",
        color: "from-gray-600 to-gray-800",
    },
];

export default function MainPortal() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-4 py-10">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    Visitor Safety System
                </h1>
                <p className="text-gray-400 text-base sm:text-lg">
                    Select your role to continue
                </p>
            </motion.div>

            {/* Cards */}
            <div className="w-full max-w-md sm:max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {roles.map((role, index) => (
                    <motion.div
                        key={role.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: index * 0.06,
                            duration: 0.3,
                            ease: "easeOut",
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(role.path)}
                        className={`
              transform-gpu will-change-transform
              cursor-pointer rounded-xl p-5
              bg-gradient-to-r ${role.color}
              shadow-lg hover:shadow-2xl
              transition-all duration-200 ease-out
              ${role.primary ? "sm:col-span-2 lg:col-span-3" : ""}
            `}
                    >
                        <h2 className="text-xl font-semibold mb-1">
                            {role.title}
                        </h2>
                        <p className="text-gray-200 text-sm">
                            {role.desc}
                        </p>

                        {role.primary && (
                            <p className="mt-2 text-xs text-indigo-200">
                                For external visitors & guests
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-10 text-gray-500 text-xs text-center">
                © {new Date().getFullYear()} Visitor Safety System
            </div>
        </div>
    );
}
