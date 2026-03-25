import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/sheetsApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Navbar from "../../components/common/Navbar";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!identifier || !password) {
            setError("Please enter all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await loginUser({ identifier, password });

            if (res.status === "OK") {
                if (res.user.role === "admin") {
                    localStorage.setItem("vss_user", JSON.stringify(res.user));
                    navigate("/admin");
                } else {
                    setError("You do not have admin access");
                }
            } else {
                setError(res.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center px-4 pt-24 pb-8">
            <Navbar />
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            <div className="w-full max-w-md relative z-10 fade-in">
                {/* Card */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover-lift">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🔑</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Admin Login
                        </h1>
                        <p className="text-slate-400 text-sm">System Administration Access</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg fade-in">
                            <p className="text-red-300 text-sm font-medium flex items-center gap-2">
                                <span>⚠️</span>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-4 mb-6">
                        {/* Employee ID / Username */}
                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
                                Employee ID or Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your admin ID or username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 smooth-transition placeholder-slate-500 disabled:opacity-50"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none mt-8">
                                <span className="text-slate-500">👤</span>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 smooth-transition placeholder-slate-500 disabled:opacity-50"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none mt-8">
                                <span className="text-slate-500">🔐</span>
                            </div>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg smooth-transition shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <span>🔑</span>
                                <span>Login as Admin</span>
                            </>
                        )}
                    </button>

                    {/* Footer */}
                    <p className="text-center text-slate-400 text-xs mt-6">
                        Need help?{" "}
                        <a href="/forgot-password" className="text-red-400 hover:text-red-300 smooth-transition font-semibold">
                            Reset Password
                        </a>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-slate-400 hover:text-slate-300 smooth-transition text-sm flex items-center justify-center gap-2"
                    >
                        <span>←</span>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
