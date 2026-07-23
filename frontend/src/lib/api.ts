const RAW_BASE_URL = import.meta.env.VITE_API_URL || "https://dashboard-semtik-production.up.railway.app";
const BASE_URL = RAW_BASE_URL.replace(/\/$/, "");

export const authApi = async (url: string, options?: RequestInit) => {
  const path = url.startsWith("/") ? url : `/${url}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
};

export const attendanceApi = async (url: string, options?: RequestInit) => {
  const path = url.startsWith("/") ? url : `/${url}`;
  const res = await fetch(`${BASE_URL}/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (data && typeof data === "object") {
      return data;
    }
    throw new Error(res.statusText || "Request failed");
  }

  return data;
};


