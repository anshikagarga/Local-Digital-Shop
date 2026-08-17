const API_URL = "http://localhost:5000/api";

export class ApiError extends Error {
    constructor(message, status = 0, data = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

const getFriendlyMessage = (status, rawMessage = "") => {
    const message = rawMessage || "Something went wrong";

    if (status === 401) {
        if (
            message.includes("jwt") ||
            message.includes("token") ||
            message.includes("expired") ||
            message.includes("malformed")
        ) {
            return "Your session has expired. Please login again.";
        }

        return message || "Please login to continue.";
    }

    if (status === 403) {
        return "You do not have permission to perform this action.";
    }

    if (status === 404) {
        return message || "The requested resource was not found.";
    }

    if (status === 409) {
        return message;
    }

    if (status === 422) {
        return message;
    }

    if (status >= 500) {
        return "Server error. Please try again later.";
    }

    return message;
};

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const isFormData = options.body instanceof FormData;

    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        });
    } catch {
        throw new ApiError(
            "Unable to connect to the server. Please make sure the backend server is running.",
            0
        );
    }

    let data = null;

    try {
        data = await response.json();
    } catch {
        throw new ApiError("Unexpected server response.", response.status);
    }

    if (!response.ok) {
        const friendlyMessage = getFriendlyMessage(
            response.status,
            data?.message
        );

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.dispatchEvent(new CustomEvent("auth:logout"));
        }

        throw new ApiError(friendlyMessage, response.status, data);
    }

    return data;
};

export const isNetworkError = (error) =>
    error instanceof ApiError && error.status === 0;

export const isAuthError = (error) =>
    error instanceof ApiError && error.status === 401;
