const BASE_URL = import.meta.env.VITE_API_URL;

export const api = async (url: string, options?: RequestInit) => {
  const res = await fetch(`${BASE_URL}${url}`, {
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
