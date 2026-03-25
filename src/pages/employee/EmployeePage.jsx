import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getVisitorsForEmployee,
    approveVisitorByEmployee,
    rejectVisitorByEmployee,
} from "../../services/sheetsApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Navbar from "../../components/common/Navbar";

export default function EmployeePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("vss_user"));

    const [visitors, setVisitors] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    /* ================= UNAUTHORIZED GUARD ================= */
    if (!user || user.role !== "employee") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="bg-red-900/30 border border-red-500 rounded-xl p-6 text-center">
                    <h1 className="text-lg font-bold text-red-400">
                        Unauthorized Access
                    </h1>
                    <p className="text-sm text-red-300 mt-2">
                        You are not allowed to view this page.
                    </p>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem("vss_user");
        navigate("/employee/login");
    };

    /* ================= FETCH VISITORS ================= */
    useEffect(() => {
        const fetchVisitors = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await getVisitorsForEmployee(user.employee_id);

                if (res.status === "OK") {
                    setVisitors(res.data.reverse());
                } else {
                    setError(res.message || "Failed to load visitors");
                }
            } catch (err) {
                console.error("Error fetching visitors:", err);
                setError("Network error. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchVisitors();
    }, [user.employee_id]);

    /* ================= APPROVE ================= */
    const approveVisitor = async (visitId) => {
        setActionLoading(visitId);
        try {
            await approveVisitorByEmployee(visitId);
            setVisitors((prev) =>
                prev.map((v) =>
                    v.visit_id === visitId
                        ? { ...v, employee_action: "Approved" }
                        : v
                )
            );
            setExpandedId(null);
        } catch (err) {
            console.error("Error approving visitor:", err);
        } finally {
            setActionLoading(null);
        }
    };

    /* ================= REJECT ================= */
    const rejectVisitor = async (visitId) => {
        setActionLoading(visitId);
        try {
            await rejectVisitorByEmployee(visitId);
            setVisitors((prev) =>
                prev.map((v) =>
                    v.visit_id === visitId
                        ? { ...v, employee_action: "Rejected" }
                        : v
                )
            );
            setExpandedId(null);
        } catch (err) {
            console.error("Error rejecting visitor:", err);
        } finally {
            setActionLoading(null);
        }
    };

    /* ================= STYLES ================= */
    const statusStyle = {
        Pending: "bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border border-yellow-500/50 hover:border-yellow-400",
        Approved: "bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/50 hover:border-green-400",
        Rejected: "bg-gradient-to-br from-red-900/40 to-rose-900/40 border border-red-500/50 hover:border-red-400",
    };

    const statusBadge = {
        Pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
        Approved: "bg-green-500/20 text-green-300 border border-green-500/30",
        Rejected: "bg-red-500/20 text-red-300 border border-red-500/30",
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4 pt-24 pb-8 text-white">
            <Navbar />
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 fade-in">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            Your Visitors
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Welcome, <span className="font-semibold text-blue-300">{user.employee_name}</span>
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold smooth-transition shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg fade-in">
                        <p className="text-red-300 font-semibold flex items-center gap-2">
                            <span>⚠️</span>
                            {error}
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <LoadingSpinner size="lg" />
                        <p className="text-slate-400">Loading your visitors...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && visitors.length === 0 && (
                    <div className="text-center py-12 fade-in">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-xl text-slate-400 font-semibold">
                            No visitors yet
                        </p>
                        <p className="text-slate-500 text-sm mt-2">
                            When visitors arrive, they will appear here
                        </p>
                    </div>
                )}

                {/* Visitors List */}
                {!loading && visitors.length > 0 && (
                    <div className="space-y-4">
                        {visitors.map((v) => {
                            const isExpanded = expandedId === v.visit_id;
                            const status = v.employee_action || "Pending";
                            const isProcessing = actionLoading === v.visit_id;

                            return (
                                <div
                                    key={v.visit_id}
                                    className={`${statusStyle[status]} rounded-xl p-5 smooth-transition cursor-pointer hover-lift fade-in`}
                                    onClick={() =>
                                        setExpandedId(isExpanded ? null : v.visit_id)
                                    }
                                >
                                    {/* COLLAPSED VIEW */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="font-bold text-lg">
                                                {v.visitor_name}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {v.visit_date} • {v.visit_time}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge[status]}`}>
                                            {status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* EXPANDED VIEW */}
                                    {isExpanded && (
                                        <div className="mt-5 space-y-3 pt-5 border-t border-white/10 scale-in">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-slate-400 text-xs">Phone</p>
                                                    <p className="font-semibold">{v.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-xs">Company</p>
                                                    <p className="font-semibold">{v.company || "N/A"}</p>
                                                </div>
                                            </div>

                                            {/* ACTIONS */}
                                            {status === "Pending" && (
                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            approveVisitor(v.visit_id);
                                                        }}
                                                        disabled={isProcessing}
                                                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold smooth-transition shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <LoadingSpinner size="sm" />
                                                                <span>Processing...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>✅</span>
                                                                <span>Approve</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            rejectVisitor(v.visit_id);
                                                        }}
                                                        disabled={isProcessing}
                                                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold smooth-transition shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <LoadingSpinner size="sm" />
                                                                <span>Processing...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>❌</span>
                                                                <span>Reject</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                            {/* CLOSE BUTTON */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedId(null);
                                                }}
                                                className="w-full mt-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm font-semibold smooth-transition border border-slate-600/50 hover:border-slate-500"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
