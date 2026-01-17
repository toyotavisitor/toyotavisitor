import { useState } from "react";
import { sendForgotOtp, verifyForgotOtp, resetForgotPassword } from "../services/sheetsApi";

export default function ForgotPage() {
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const strength =
        password.length < 8
            ? "Weak"
            : /[A-Z]/.test(password) && /\d/.test(password)
                ? "Strong"
                : "Medium";

    /* ================= SEND OTP ================= */
    const handleSendOtp = async () => {
        if (!identifier) return setMsg("Please enter your username / email / ID");

        setLoading(true);
        setMsg("");

        const res = await sendForgotOtp(identifier);

        setLoading(false);

        if (res.status === "OK") setStep(2);
        else setMsg(res.message || "Failed to send OTP");
    };

    /* ================= VERIFY OTP ================= */
    const handleVerifyOtp = async () => {
        if (!otp) return setMsg("Please enter OTP");

        setLoading(true);
        setMsg("");

        const res = await verifyForgotOtp(identifier, otp);

        setLoading(false);

        if (res.status === "OK") setStep(3);
        else setMsg(res.message || "Invalid OTP");
    };

    /* ================= RESET PASSWORD ================= */
    const handleResetPassword = async () => {
        if (password !== confirm) return setMsg("Passwords do not match");

        setLoading(true);
        setMsg("");

        const res = await resetForgotPassword(identifier, password);

        setLoading(false);

        if (res.status === "OK") setStep(4);
        else setMsg(res.message || "Password reset failed");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Step {step} of 4
                    </p>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <input
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Username / Email / Employee ID"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <input
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <p
                            className={`text-sm ${strength === "Strong"
                                ? "text-green-400"
                                : strength === "Medium"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                        >
                            Password strength: {strength}
                        </p>

                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Confirm Password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                    <div className="text-center space-y-2">
                        <p className="text-green-400 font-semibold">
                            Password reset successful 🎉
                        </p>
                        <p className="text-gray-400 text-sm">
                            Please login with your new password.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/portal")}
                            className="w-full py-2 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition text-sm"
                        >
                            Go Back and Login
                        </button>
                    </div>

                )}



                {/* ERROR */}
                {msg && <p className="text-red-400 text-sm text-center">{msg}</p>}
            </div>
        </div>
    );
}
