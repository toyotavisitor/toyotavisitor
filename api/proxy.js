// /api/proxy.js

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;     // per IP
const REQUEST_TIMEOUT_MS = 10_000;      // 10 seconds
const MAX_RETRIES = 1;

// In-memory rate limit store (OK for Vercel serverless)
const rateLimitMap = new Map();

function getClientIP(req) {
    return (
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket?.remoteAddress ||
        "unknown"
    );
}

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return false;
    }

    if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return false;
    }

    entry.count += 1;
    return entry.count > MAX_REQUESTS_PER_WINDOW;
}

async function fetchWithTimeoutAndRetry(url, options, retries = MAX_RETRIES) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return res;
    } catch (err) {
        clearTimeout(timeout);

        if (retries > 0) {
            console.warn("Retrying proxy request...");
            return fetchWithTimeoutAndRetry(url, options, retries - 1);
        }

        throw err;
    }
}

export default async function handler(req, res) {
    const GAS_URL = process.env.GAS_BACKEND_URL;

    if (!GAS_URL) {
        return res.status(500).json({
            status: "ERROR",
            message: "Backend not configured",
        });
    }

    const ip = getClientIP(req);

    /* ================= RATE LIMIT ================= */
    if (isRateLimited(ip)) {
        console.warn(`[RATE LIMIT] ${ip}`);
        return res.status(429).json({
            status: "ERROR",
            message: "Too many requests. Please try again later.",
        });
    }

    const startTime = Date.now();

    try {
        const url =
            GAS_URL +
            (req.method === "GET"
                ? "?" + new URLSearchParams(req.query).toString()
                : "");

        const response = await fetchWithTimeoutAndRetry(url, {
            method: req.method,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body:
                req.method === "POST"
                    ? new URLSearchParams(req.body).toString()
                    : undefined,
        });

        const text = await response.text();

        /* ================= LOGGING ================= */
        const duration = Date.now() - startTime;
        console.log(
            `[PROXY] ${req.method} ${req.url} | IP=${ip} | ${response.status} | ${duration}ms`
        );

        /* ================= FORWARD HEADERS ================= */
        res.setHeader(
            "Content-Type",
            response.headers.get("content-type") || "application/json"
        );

        return res.status(response.status).send(text);
    } catch (err) {
        const duration = Date.now() - startTime;

        console.error(
            `[PROXY ERROR] ${req.method} ${req.url} | IP=${ip} | ${duration}ms`,
            err.message
        );

        return res.status(500).json({
            status: "ERROR",
            message: "Proxy error",
        });
    }
}
