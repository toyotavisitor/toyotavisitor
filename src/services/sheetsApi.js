const BASE_URL =
    import.meta.env.PROD ? "/api/proxy" : "/api/exec";
/* =====================================================
   VISITOR (SAFE → GET)
===================================================== */

export async function createVisitor(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "createVisitor",
            ...payload,
        }),
    });

    return res.json();
}

export async function searchEmployees(query) {
    const params = new URLSearchParams({
        action: "searchEmployees",
        q: query,
    });

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    return res.json();
}

export async function validateEntry(payload) {
    const params = new URLSearchParams({
        action: "validateEntry",
        ...payload,
    });

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    return res.json();
}

export async function markSecurityVerified(visit_id) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "markSecurityVerified",
            visit_id,
        }),
    });

    return res.json();
}

/* =====================================================
   AUTH (SENSITIVE → POST)
===================================================== */

export async function signupUser(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "signupUser",
            ...payload,
        }),
    });

    return res.json();
}

export async function loginUser(payload) {
    console.log("LOGIN API CALLED (SAFE VERSION)", payload);

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "loginUser",
            ...payload,
        }),
    });

    const text = await res.text();

    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error("❌ Backend returned invalid JSON:", text);
        throw new Error("Backend returned invalid JSON. Status: " + res.status);
    }

    if (data.status !== "OK") {
        throw new Error(data.message || "Login failed");
    }

    return data;
}


/* =====================================================
   FORGOT PASSWORD (POST)
===================================================== */

export async function sendForgotOtp(identifier) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "sendForgotOtp",
            identifier,
        }),
    });

    return res.json();
}

export async function verifyForgotOtp(identifier, otp) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "verifyForgotOtp",
            identifier,
            otp,
        }),
    });

    return res.json();
}

export async function resetForgotPassword(identifier, new_password) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "resetForgotPassword",
            identifier,
            new_password,
        }),
    });

    return res.json();
}

/* =====================================================
   EMPLOYEE (GET)
===================================================== */

export async function getVisitorsForEmployee(employee_id) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "getVisitorsForEmployee",
            employee_id,
        }),
    });

    return res.json();
}

export async function approveVisitorByEmployee(visit_id) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "approveVisitorByEmployee",
            visit_id,
        }),
    });

    return res.json();
}

export async function rejectVisitorByEmployee(visit_id) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "rejectVisitorByEmployee",
            visit_id,
        }),
    });

    return res.json();
}

/* =====================================================
   HOD (GET)
===================================================== */

export async function getVisitorsForDepartment(department) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "getVisitorsForDepartment",
            department,
        }),
    });

    return res.json();
}

export async function getAllUsers() {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "getAllUsers",
        }),
    });

    return res.json();
}

export async function adminCreateUser(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "adminCreateUser",
            ...payload,
        }),
    });

    return res.json();
}

export async function updateUser(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "updateUser",
            ...payload,
        }),
    });

    return res.json();
}

export async function resetUserPassword(employee_id, new_password) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "resetUserPassword",
            employee_id,
            new_password,
        }),
    });

    return res.json();
}

export async function deleteUser(employee_id) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "deleteUser",
            employee_id,
        }),
    });

    return res.json();
}

/* =====================================================
   SETTINGS (from Settings sheet)
===================================================== */

/**
 * Get signup status from Settings sheet
 * Reads from Settings sheet: key="signup_enabled", gets value from column B
 * @returns {Object} { status: "OK", enabled: true/false }
 */
export async function getSignupStatus() {
    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "getSettingValue",
                key: "signup_enabled",
            }),
        });

        const text = await res.text();
        let result;

        try {
            result = JSON.parse(text);
        } catch {
            console.error("❌ Non-JSON response:", text);
            return { status: "ERROR", enabled: false };
        }

        console.log("getSignupStatus result:", result);

        if (result.status === "OK") {
            const value = result.value;
            const enabled =
                value === true ||
                value === "true" ||
                value === "TRUE" ||
                value === "yes" ||
                value === "YES";

            return { status: "OK", enabled };
        }

        return { status: "ERROR", enabled: false };
    } catch (error) {
        console.error("getSignupStatus error:", error);
        return { status: "ERROR", enabled: false };
    }
}


/**
 * Update signup status in Settings sheet
 * Updates Settings sheet: key="signup_enabled" with new boolean value
 * @param {boolean} enabled - true to enable, false to disable
 * @returns {Object} { status: "OK" } on success
 */
export async function updateSignupStatus(enabled) {
    try {
        console.log("updateSignupStatus input:", enabled);

        const enabledValue =
            enabled === true || enabled === "true" ? "TRUE" : "FALSE";

        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "updateSettingValue",
                key: "signup_enabled",
                value: enabledValue,
            }),
        });

        const text = await res.text();
        let result;

        try {
            result = JSON.parse(text);
        } catch {
            console.error("❌ Non-JSON response:", text);
            return { status: "ERROR", message: "Invalid backend response" };
        }

        console.log("updateSignupStatus result:", result);
        return result;
    } catch (error) {
        console.error("updateSignupStatus error:", error);
        return { status: "ERROR", message: error.message };
    }
}



export async function updateMyProfile(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "updateMyProfile",
            ...payload,
        }),
    });

    return res.json();
}
