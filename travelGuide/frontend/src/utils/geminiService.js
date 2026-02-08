const API_BASE_URL =
    (typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_API_URL) ||
    (typeof process !== "undefined" &&
        process.env &&
        process.env.REACT_APP_API_URL) ||
    "https://travelguide-1-21sw.onrender.com/api";

async function handleResponse(res) {
    const text = await res.text().catch(() => "");
    let body = text;
    try {
        body = text ? JSON.parse(text) : text;
    } catch (e) {
        // keep raw text if JSON.parse fails
    }

    if (!res.ok) {
        const msg =
            (body && body.message) ||
            (typeof body === "string" ? body : JSON.stringify(body)) ||
            `API error ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.body = body;
        if (res.status === 401) err.auth = true;
        throw err;
    }
    return body;
}

async function doFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        const err = new Error(
            "Missing auth token. Please login."
        );
        err.status = 401;
        err.auth = true;
        throw err;
    }

    const headers = { ...(options.headers || {}) };
    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    try {
        return await handleResponse(res);
    } catch (err) {
        if (err && err.status === 401) {
            console.warn("[geminiService] 401 received, clearing token");
            localStorage.removeItem("token");
            err.message =
                err.message ||
                "Unauthorized (401). Please login again.";
        }
        throw err;
    }
}

/**
 * Fetch AI-generated place information including hotels, restaurants, and attractions
 * @param {string} placeName - Name of the place
 * @returns {Promise<Object>} Place information with hotels, restaurants, and places to visit
 */
export function fetchPlaceAIInfo(placeName) {
    return doFetch("/places/ai-info", {
        method: "POST",
        body: JSON.stringify({ placeName }),
    });
}
