export default async function handler(req, res) {
    const GAS_URL =
        "https://script.google.com/macros/s/AKfycbyT5Ei52UVf0X_KgLAflKRir5qyfz1MkoY36pRCu1ay4hLa-sid7eThCGjE9Z6N3V19Rg/exec";

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
