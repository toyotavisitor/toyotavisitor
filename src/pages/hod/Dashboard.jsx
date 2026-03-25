import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVisitorsForDepartment, getSignupStatus, updateSignupStatus } from "../../services/sheetsApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Navbar from "../../components/common/Navbar";

export default function HodDashboard() {
    const user = JSON.parse(localStorage.getItem("vss_user"));
    const navigate = useNavigate();

    const [visitors, setVisitors] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);

    const [showSettings, setShowSettings] = useState(false);
    const [signupEnabled, setSignupEnabled] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [toggleInProgress, setToggleInProgress] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [tempToggleValue, setTempToggleValue] = useState(false);
    const [syncStatus, setSyncStatus] = useState(""); // "synced" | "syncing" | "failed"


    /* ================= AUTH GUARD ================= */
    if (!user || user.role !== "hod") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-red-400 font-bold">
                Unauthorized Access
            </div>
        );
    }

    const toggleSignup = () => {
        // Show confirmation dialog instead of directly toggling
        setTempToggleValue(!signupEnabled);
        setShowConfirmDialog(true);
    };

    const confirmToggle = async () => {
        setToggleInProgress(true);
        setShowConfirmDialog(false);
        setSyncStatus("syncing");

        try {
            // Update backend (Settings sheet) - ONLY source of truth
            console.log("Updating backend signup status to:", tempToggleValue);
            const backendResult = await updateSignupStatus(tempToggleValue);

            if (backendResult && backendResult.status === "OK") {
                // Backend update successful - load fresh from backend
                const freshStatus = await getSignupStatus();
                if (freshStatus.status === "OK") {
                    const isEnabled = freshStatus.enabled === true || freshStatus.enabled === "true";
                    setSignupEnabled(isEnabled);
                    setSyncStatus("synced");
                    alert(`✅ Signup setting updated to: ${isEnabled ? "ENABLED ✔️" : "DISABLED 🔒"}\n\nAll users will see this change immediately.`);
                    console.log("✅ Backend sync successful, current state:", isEnabled);
                }
            } else {
                // Backend update failed
                console.error("Backend sync failed:", backendResult);
                setSyncStatus("failed");
                alert(`❌ Failed to update setting.\n\n${backendResult?.message || "Backend error"}\n\nPlease try again.`);
                // Refresh to show current backend state
                await fetchSignupStatus();
            }
        } catch (e) {
            console.error("Error updating signup:", e);
            setSyncStatus("failed");
            alert(`❌ Error: ${e.message}\n\nPlease try again.`);
            // Refresh to show current backend state
            await fetchSignupStatus();
        } finally {
            setToggleInProgress(false);
        }
    };


    const logout = () => {
        localStorage.removeItem("vss_user");
        navigate("/hod/login");
    };

    /* ================= FETCH ================= */
    useEffect(() => {
        setLoading(true);
        getVisitorsForDepartment(user.department).then((res) => {
            if (res.status === "OK") {
                setVisitors(res.data.reverse()); // latest first
            }
            setLoading(false);
        });
    }, [user.department]);



    /*SIGNUP TOGGLE HANDLER*/
    useEffect(() => {
        fetchSignupStatus();
    }, []);

    const fetchSignupStatus = async () => {
        try {
            // Fetch from backend (Settings sheet) - ONLY source of truth
            console.log("Fetching signup status from backend...");
            const res = await getSignupStatus();

            if (res.status === "OK") {
                const isEnabled = res.enabled === true || res.enabled === "true";
                setSignupEnabled(isEnabled);
                console.log("✅ Signup status loaded from backend:", isEnabled);
            } else {
                // Backend error - default to disabled for security
                console.error("Failed to fetch signup status:", res.message);
                setSignupEnabled(false);
            }
        } catch (e) {
            console.error("Failed to load signup setting:", e);
            // On error, disable signup for security
            setSignupEnabled(false);
        }
    };


    /* ================= FILTER ================= */
    const filteredVisitors = useMemo(() => {
        if (!selectedDate) return visitors;
        return visitors.filter(
            (v) => v.visit_date === selectedDate
        );
    }, [visitors, selectedDate]);

    /* ================= STATS ================= */
    const stats = useMemo(() => {
        let total = filteredVisitors.length;
        let pendingEmp = 0;
        let pendingSec = 0;
        let approvedEmp = 0;
        let verified = 0;

        filteredVisitors.forEach((v) => {
            if (v.employee_action === "Pending") pendingEmp++;
            else if (
                v.employee_action === "Approved" &&
                v.security_verified !== "Yes"
            )
                pendingSec++;
            else if (
                v.employee_action === "Approved" &&
                v.security_verified === "Yes"
            )
                verified++;
            else if (v.employee_action === "Approved") approvedEmp++;
        });

        return {
            total,
            pendingEmp,
            pendingSec,
            approvedEmp,
            verified,
        };
    }, [filteredVisitors]);

    /* ================= STYLES ================= */
    const cardStyle = {
        Pending:
            "bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border border-amber-500/50 hover:border-amber-500",
        Approved:
            "bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/50 hover:border-purple-500",
        Verified:
            "bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/50 hover:border-green-500",
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black px-4 pt-24 pb-6 text-white">
            <Navbar />
            {/* Animated background circles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6 relative">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-amber-500/20">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            👨‍💼 HOD Dashboard
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Department: <span className="text-amber-300 font-semibold">{user.department}</span></p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-sm font-semibold smooth-transition shadow-lg hover:shadow-amber-500/25"
                        >
                            ⚙️ Settings
                        </button>

                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-sm font-semibold smooth-transition shadow-lg hover:shadow-red-500/25"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>


                {/* FILTER */}
                <div className="flex gap-3 items-center bg-slate-900/50 backdrop-blur-md border border-amber-500/20 rounded-lg p-4">
                    <label className="text-sm text-slate-300 font-semibold whitespace-nowrap">
                        📅 Filter by date:
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-slate-800 border border-amber-500/30 focus:border-amber-500 rounded px-3 py-2 text-white focus:ring-2 focus:ring-amber-500/20 smooth-transition"
                    />
                    {selectedDate && (
                        <button
                            onClick={() => setSelectedDate("")}
                            className="text-xs font-semibold underline text-amber-400 hover:text-amber-300 smooth-transition"
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <StatCard title="Total Visitors" value={stats.total} color="blue" icon="👥" />
                    <StatCard title="Pending (Emp)" value={stats.pendingEmp} color="yellow" icon="⏳" />
                    <StatCard title="Pending (Sec)" value={stats.pendingSec} color="orange" icon="🔒" />
                    <StatCard title="Approved" value={stats.approvedEmp} color="purple" icon="✅" />
                    <StatCard title="Verified" value={stats.verified} color="green" icon="🎉" />
                </div>

                {/* VISITOR LIST */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <LoadingSpinner size="md" />
                            <p className="text-slate-400 mt-3">Loading visitors...</p>
                        </div>
                    </div>
                )}

                {!loading && filteredVisitors.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-3xl mb-2">📭</p>
                        <p className="text-slate-400">No visitors found</p>
                    </div>
                )}

                <div className="space-y-3">
                    {filteredVisitors.map((v) => {
                        const expanded = expandedId === v.visit_id;

                        let statusKey = "Pending";
                        if (v.employee_action === "Approved" && v.security_verified === "Yes")
                            statusKey = "Verified";
                        else if (v.employee_action === "Approved")
                            statusKey = "Approved";

                        const statusBadgeColors = {
                            Pending: "bg-amber-600 text-white",
                            Approved: "bg-purple-600 text-white",
                            Verified: "bg-green-600 text-white",
                        };

                        const statusIcons = {
                            Pending: "⏳",
                            Approved: "✅",
                            Verified: "🎉",
                        };

                        return (
                            <div
                                key={v.visit_id}
                                className={`rounded-xl p-4 transition-all duration-300 cursor-pointer backdrop-blur-md hover:shadow-xl hover:shadow-amber-500/10 ${cardStyle[statusKey]}`}
                                onClick={() =>
                                    setExpandedId(expanded ? null : v.visit_id)
                                }
                            >
                                {/* COLLAPSED */}
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-white">{v.visitor_name}</p>
                                        <p className="text-sm text-slate-300 mt-1">
                                            👤 {v.visiting_employee_name}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            🏢 {v.visiting_department} • 📅 {v.visit_date}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeColors[statusKey]} shadow-lg`}>
                                            {statusIcons[statusKey]} {statusKey.toUpperCase()}
                                        </span>
                                        <span className="text-xl">{expanded ? "▼" : "▶"}</span>
                                    </div>
                                </div>

                                {/* EXPANDED */}
                                {expanded && (
                                    <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-2 text-slate-200 fade-in">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold">📞 Phone</p>
                                                <p className="text-white font-semibold">{v.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold">🏭 Company</p>
                                                <p className="text-white font-semibold">{v.company}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold">⏰ Visit Time</p>
                                                <p className="text-white font-semibold">{v.visit_time}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold">✔️ Employee Action</p>
                                                <p className="text-white font-semibold">{v.employee_action}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-white/10">
                                            <p className="text-xs text-slate-400 font-semibold">🔐 Security Verified</p>
                                            <p className={`font-bold ${v.security_verified === "Yes" ? "text-green-400" : "text-amber-400"}`}>
                                                {v.security_verified === "Yes" ? "✅ Yes" : "⏳ No"}
                                            </p>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedId(null);
                                            }}
                                            className="mt-3 w-full py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-slate-300 font-semibold smooth-transition"
                                        >
                                            📝 Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {showSettings && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl shadow-2xl w-full max-w-sm space-y-5 p-6 fade-in">
                        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">⚙️ System Settings</h2>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-2xl text-slate-400 hover:text-white smooth-transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* SIGNUP TOGGLE */}
                        <div className="bg-slate-800/50 border border-amber-500/20 rounded-xl p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        👤 Employee Signup
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Allow employees to self-register in the system
                                    </p>
                                </div>

                                <button
                                    onClick={toggleSignup}
                                    disabled={toggleInProgress}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${signupEnabled
                                        ? "bg-gradient-to-r from-green-600 to-emerald-600"
                                        : "bg-gradient-to-r from-red-600 to-rose-600"
                                        } ${toggleInProgress ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${signupEnabled ? "translate-x-8" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* STATUS BADGE */}
                            <div className="pt-2 border-t border-amber-500/10">
                                <p className={`text-xs font-bold text-center py-2 px-3 rounded-lg ${signupEnabled
                                    ? "bg-green-900/40 text-green-300 border border-green-500/30"
                                    : "bg-red-900/40 text-red-300 border border-red-500/30"
                                    }`}>
                                    {signupEnabled
                                        ? "✅ Signup is ENABLED"
                                        : "❌ Signup is DISABLED"}
                                </p>
                            </div>
                        </div>

                        {/* INFO BOX */}
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                            <p className="text-xs text-blue-300">
                                <b>ℹ️ Info:</b> When enabled, employees can create new accounts. When disabled, only admin can add employees.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowSettings(false)}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold smooth-transition shadow-lg hover:shadow-amber-500/25"
                        >
                            ✅ Done
                        </button>
                    </div>
                </div>
            )}

            {/* CONFIRMATION DIALOG */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/50 rounded-2xl shadow-2xl w-full max-w-sm space-y-4 p-6 fade-in">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-2">
                                {tempToggleValue ? "🔓 Enable Signup?" : "🔒 Disable Signup?"}
                            </h3>
                            <p className="text-sm text-slate-300">
                                {tempToggleValue
                                    ? "Allow employees to self-register in the system?"
                                    : "Prevent employees from self-registering. Only admins can add new employees."}
                            </p>
                        </div>

                        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                            <p className="text-xs text-amber-300">
                                <b>⚠️ Note:</b> Changes will be synced to server. All users will see the update immediately.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                disabled={toggleInProgress}
                                className="flex-1 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-slate-300 font-semibold smooth-transition disabled:opacity-50"
                            >
                                ❌ Cancel
                            </button>
                            <button
                                onClick={confirmToggle}
                                disabled={toggleInProgress}
                                className={`flex-1 py-2 rounded-lg font-semibold smooth-transition ${tempToggleValue
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                    } text-white disabled:opacity-50`}
                            >
                                {toggleInProgress ? "Updating..." : "✅ Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, color, icon }) {
    const colorMap = {
        blue: "bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/50 text-blue-300",
        yellow: "bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border-yellow-500/50 text-yellow-300",
        orange: "bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-500/50 text-orange-300",
        purple: "bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/50 text-purple-300",
        green: "bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50 text-green-300",
    };

    return (
        <div
            className={`border rounded-xl p-4 text-center backdrop-blur-md transition-all duration-300 hover:shadow-lg ${colorMap[color]}`}
        >
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-xs uppercase tracking-widest font-semibold opacity-80">
                {title}
            </p>
            <p className="text-2xl font-bold mt-2">
                {value}
            </p>
        </div>
    );
}
