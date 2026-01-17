export default async function handler(req, res) {
    const GAS_URL = process.env.GAS_BACKEND_URL;

    if (!GAS_URL) {
        return res.status(500).json({
            status: "ERROR",
            message: "Backend not configured",
        });
    }

    try {
        const url =
            GAS_URL +
            (req.method === "GET"
                ? "?" + new URLSearchParams(req.query)
                : "");

        const response = await fetch(url, {
            method: req.method,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body:
                req.method === "POST"
                    ? new URLSearchParams(req.body)
                    : undefined,
        });

        const text = await response.text();
        res.status(200).send(text);
    } catch (err) {
        res.status(500).json({
            status: "ERROR",
            message: "Proxy error",
        });
    }
}
