//Testing
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
        // mark for caller that this is an auth failure
        if (res.status === 401) err.auth = true;
        throw err;
    }
    return body;
}

async function doFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    // If no token present, surface a clear error so you can debug quickly.
    if (!token) {
        const err = new Error(
            "Missing auth token. Set localStorage.setItem('token', '<YOUR_TOKEN>') or login."
        );
        err.status = 401;
        err.auth = true;
        throw err;
    }

    // debug: show presence of token (do not log token value in production)
    console.debug(
        "[tripItineraryService] tokenPresent:",
        !!token,
        "url:",
        `${API_BASE_URL}${path}`
    );

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
        // If backend returned 401, remove invalid token and attach hint
        if (err && err.status === 401) {
            console.warn("[tripItineraryService] 401 received, clearing token");
            // remove token to avoid repeated failing calls; caller can redirect to login
            localStorage.removeItem("token");
            // attach friendly message
            err.message =
                err.message ||
                "Unauthorized (401). Token missing/invalid/expired. Please login again.";
        }
        throw err;
    }
}

export function generateItinerary(tripData) {
    return doFetch("/trip-itinerary/generate", {
        method: "POST",
        body: JSON.stringify(tripData),
    });
}

export function saveItinerary(itinerary) {
    return doFetch("/trip-itinerary/save", {
        method: "POST",
        body: JSON.stringify(itinerary),
    });
}

export function getMyTrips() {
    return doFetch("/trip-itinerary/my-trips", {
        method: "GET",
    });
}

export function getItinerary(id) {
    return doFetch(`/trip-itinerary/${id}`, {
        method: "GET",
    });
}

export function deleteItinerary(id) {
    return doFetch(`/trip-itinerary/${id}`, {
        method: "DELETE",
    });
}


export async function searchPlaces(query) {
    // Public search - no authentication required
    try {
        const res = await fetch(`${API_BASE_URL}/places/search?query=${encodeURIComponent(query)}`);

        if (!res.ok) {
            console.error(`Search failed: ${res.status}`);
            return [];
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Search error:', err);
        return [];
    }
}

export function getWeather(lat, lon) {
    return doFetch(`/weather?lat=${lat}&lon=${lon}`, {
        method: "GET",
    });
}

export function uploadTravelPost(formData) {
    return doFetch("/travel/upload", {
        method: "POST",
        body: formData,
    });
}

export function getExplorePlaces() {
    return doFetch("/places/getPlaces", {
        method: "POST",
    });
}
