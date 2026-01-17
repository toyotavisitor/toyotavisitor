import { useEffect, useState } from "react";
import { signupUser, getSignupStatus } from "../services/sheetsApi";

export default function Signup() {
    const [signupEnabled, setSignupEnabled] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        employee_id: "",
        username: "",
        employee_name: "",
        email: "",
        department: "",
        designation: "",
        phone: "",
        role: "employee",
        password: "",
    });

    /* ================= CHECK SIGNUP STATUS ================= */
    useEffect(() => {
        const checkSignupStatus = async () => {
            try {
                console.log("Checking signup status from backend...");
                const res = await getSignupStatus();

                if (res.status === "OK") {
                    const isEnabled = res.enabled === true || res.enabled === "true";
                    setSignupEnabled(isEnabled);
                } else {
                    setSignupEnabled(false);
                }
            } catch (error) {
                console.error("Signup status fetch failed:", error);
                setSignupEnabled(false);
            }
        };

        checkSignupStatus();
    }, []);

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        setLoading(true);
        setMessage("");

        const res = await signupUser(form);

        if (res.status === "OK") {
            setMessage("Signup successful. Please login.");
            setForm({
                employee_id: "",
                username: "",
                employee_name: "",
                email: "",
                department: "",
                designation: "",
                phone: "",
                role: "employee",
                password: "",
            });
        } else {
            setMessage(res.message || "Signup failed");
        }

        setLoading(false);
    };

    /* ================= LOADING ================= */
    if (signupEnabled === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-slate-900 text-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-lg font-semibold">Checking system status...</p>
                </div>
            </div>
        );
    }

    /* ================= SIGNUP DISABLED ================= */
    if (!signupEnabled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black text-white px-4">
                <div className="relative bg-gradient-to-br from-red-900/40 to-slate-900/40 border-2 border-red-500/60 rounded-2xl p-8 text-center max-w-md shadow-2xl backdrop-blur-xl">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-3xl font-bold text-red-400 mb-3">
                        Signup Disabled
                    </h1>
                    <p className="text-base text-red-200 mb-2">
                        <b>Disabled by Head of Department</b>
                    </p>
                    <p className="text-sm text-slate-300">
                        Employee signup is currently disabled. Please contact your HOD.
                    </p>
                </div>
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center px-4 text-white">
            <div className="relative w-full max-w-md bg-slate-900/80 border border-blue-500/30 rounded-2xl p-8 space-y-4 shadow-2xl backdrop-blur-xl fade-in">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        👤 Employee Signup
                    </h1>
                    <p className="text-sm text-slate-300">
                        Create your account to access the system
                    </p>
                </div>

                <div className="space-y-3">
                    {[
                        ["employee_id", "Employee ID", "text"],
                        ["username", "Username", "text"],
                        ["employee_name", "Full Name", "text"],
                        ["email", "Email", "email"],
                        ["department", "Department", "text"],
                        ["designation", "Designation", "text"],
                        ["phone", "Phone Number", "tel"],
                    ].map(([name, label, type]) => (
                        <input
                            key={name}
                            name={name}
                            type={type}
                            placeholder={label}
                            value={form[name]}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-black/50 border border-blue-500/20 rounded-lg"
                        />
                    ))}
                </div>

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-black/50 border border-blue-500/20 rounded-lg"
                >
                    <option value="employee">👤 Employee</option>
                    <option value="security">🛡️ Security</option>
                </select>

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-black/50 border border-blue-500/20 rounded-lg"
                />

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold"
                >
                    {loading ? "Creating account..." : "🔐 Sign Up"}
                </button>
                <div className="text-center mt-6">
                    <a
                        href="/portal"
                        className="text-slate-400 hover:text-slate-300 smooth-transition text-sm flex items-center justify-center gap-2"
                    >
                        <span>←</span>
                        Back to Home
                    </a>
                </div>
                {message && (
                    <div className="text-center text-sm font-semibold">
                        {message}
                    </div>
                )}
            </div>

        </div>
    );
}
