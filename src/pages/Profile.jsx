import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, updateMyProfile } from "../services/sheetsApi";

export default function Profile() {
    const navigate = useNavigate();

    const [step, setStep] = useState("login"); // login | profile | success
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ================= LOGIN ================= */
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const identifier = e.target.identifier.value.trim();
        const password = e.target.password.value;

        try {
            const res = await loginUser({ identifier, password });

            if (res.status !== "OK") {
                throw new Error(res.message || "Login failed");
            }

            setUser(res.user);
            setForm(res.user);
            setStep("profile");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= SAVE PROFILE ================= */
    const saveProfile = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await updateMyProfile({
                employee_id: user.employee_id,
                employee_name: form.employee_name,
                email: form.email,
                phone: form.phone,
                department: form.department,
                designation: form.designation,
            });

            if (res.status !== "OK") {
                throw new Error(res.message || "Update failed");
            }

            setStep("success");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= EXIT ================= */
    const logoutAndExit = () => {
        localStorage.removeItem("vss_user"); // safety cleanup
        navigate("/portal");
    };

    /* ================= LOGIN VIEW ================= */
    if (step === "login") {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
                <form
                    onSubmit={handleLogin}
                    className="bg-slate-900 p-6 rounded-xl w-full max-w-sm space-y-4"
                >
                    <h1 className="text-xl font-bold text-center">
                        Login to Edit Profile
                    </h1>

                    <input
                        name="identifier"
                        placeholder="Employee ID / Username / Email"
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20"
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20"
                        required
                    />

                    {error && (
                        <p className="text-red-400 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-2 font-semibold"
                    >
                        Login
                    </button>
                </form>

                {loading && <Overlay message="Logging in..." />}
            </div>
        );
    }

    /* ================= PROFILE VIEW ================= */

    const editableFields = [
        { key: "employee_name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "department", label: "Department" },
        { key: "designation", label: "Designation" },
    ];

    if (step === "profile") {
        return (
            <div className="min-h-screen bg-black text-white px-4 py-6">
                <div className="max-w-md mx-auto mb-6">
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                    <p className="text-gray-400 text-sm">
                        Update your personal details
                    </p>
                </div>

                <div className="max-w-md mx-auto bg-slate-900 rounded-xl p-5 space-y-4 shadow-lg">

                    <StaticRow label="Employee ID" value={user.employee_id} />
                    <StaticRow label="Username" value={user.username} />
                    <StaticRow label="Role" value={user.role?.toUpperCase()} />

                    {editableFields.map(({ key, label }) => (
                        <div
                            key={key}
                            className="flex items-center justify-between border-b border-white/10 pb-2"
                        >
                            <div className="flex-1">
                                <p className="text-xs text-gray-400">{label}</p>

                                {editing === key ? (
                                    <input
                                        value={form[key] || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                [key]: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full bg-black/40 border border-white/20 rounded-lg px-3 py-1 text-sm"
                                    />
                                ) : (
                                    <p className="text-sm mt-1">
                                        {form[key] || "-"}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    setEditing(editing === key ? null : key)
                                }
                                className="ml-3 text-lg"
                            >
                                {editing === key ? "✔️" : "✏️"}
                            </button>
                        </div>
                    ))}

                    {error && (
                        <p className="text-red-400 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={saveProfile}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-2 font-semibold"
                    >
                        Save Changes
                    </button>
                </div>

                {loading && <Overlay message="Saving profile..." />}
            </div>
        );
    }

    /* ================= SUCCESS VIEW ================= */
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-sm text-center space-y-4">
                <p className="text-green-400 font-semibold text-lg">
                    Profile updated successfully ✅
                </p>

                <button
                    onClick={logoutAndExit}
                    className="w-full bg-gray-700 hover:bg-gray-600 transition rounded-xl py-2"
                >
                    Logout & Go to Dashboard
                </button>
            </div>
        </div>
    );
}

/* ================= COMPONENTS ================= */

function StaticRow({ label, value }) {
    return (
        <div className="border-b border-white/10 pb-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm mt-1">{value}</p>
        </div>
    );
}

function Overlay({ message }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="px-6 py-4 rounded-xl bg-slate-800 text-center">
                <p className="font-semibold">{message}</p>
            </div>
        </div>
    );
}
