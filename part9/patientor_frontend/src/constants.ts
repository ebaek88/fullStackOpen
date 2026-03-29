const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim();

export const apiBaseUrl = backendUrl || "/api";
