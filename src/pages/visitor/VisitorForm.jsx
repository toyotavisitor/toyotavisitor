import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchEmployees } from "../../services/sheetsApi";

export default function VisitorForm({ onNext }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        company: "",
    });

    const [empQuery, setEmpQuery] = useState("");
    const [empResult, setEmpResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const canProceed =
        form.name &&
        form.phone &&
        empResult?.employee_id;

    const fetchEmployee = async () => {
        setError("");
        setLoading(true);
        setEmpResult(null);

        try {
            const res = await searchEmployees(empQuery);

            if (res.status !== "OK" || res.count === 0) {
                setError("Employee not found");
            } else {
                setEmpResult(res.data[0]); // first match
            }
        } catch {
            setError("Error fetching employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">

            {/* Visitor Details */}
            <input
                placeholder="Visitor Name"
                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20"
                onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                }
            />

            <input
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20"
                onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                }
            />

            <input
                placeholder="From Company"
                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20"
                onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                }
            />

            {/* Employee Search */}
            <div className="space-y-2">
                <input
                    placeholder="Employee ID or Username (to visit)"
                    value={empQuery}
                    className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/20"
                    onChange={(e) => setEmpQuery(e.target.value)}
                />

                <button
                    type="button"
                    onClick={fetchEmployee}
                    disabled={!empQuery || loading}
                    className={`w-full py-2 rounded-xl transition ${loading
                        ? "bg-gray-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {loading ? "Searching..." : "Verify Employee"}
                </button>

                {error && (
                    <p className="text-sm text-red-400">{error}</p>
                )}
            </div>

            {/* Employee Confirmation Card */}
            {empResult && (
                <div className="rounded-xl border border-green-400/40 bg-green-500/10 p-4 space-y-1">
                    <p className="text-sm font-semibold text-green-300">
                        Employee Verified
                    </p>
                    <p className="text-sm">
                        Name: {empResult.employee_name}
                    </p>
                    <p className="text-sm">
                        Username: {empResult.username}
                    </p>
                    <p className="text-sm">
                        Department: {empResult.department}
                    </p>
                    <p className="text-sm">
                        Designation: {empResult.designation}
                    </p>
                </div>
            )}

            {/* Continue */}
            <button
                disabled={!canProceed}
                className={`w-full py-2 rounded-xl transition ${canProceed
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 cursor-not-allowed"
                    }`}
                onClick={() =>
                    onNext({
                        ...form,
                        visiting_employee_id: empResult.employee_id,
                        visiting_employee_username: empResult.username,
                        visiting_employee_name: empResult.employee_name,
                        visiting_department: empResult.department,
                    })
                }
            >
                Continue
            </button>

            {/* Not a visitor */}
            <button
                type="button"
                onClick={() => navigate("/portal")}
                className="w-full py-2 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition text-sm"
            >
                Not a visitor? Login here
            </button>

        </div>
    );
}
