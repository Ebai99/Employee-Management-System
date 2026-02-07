const API_BASE = "http://localhost:5000/api";

async function apiRequest(endpoint, method = "GET", body) {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  const res = await fetch(API_BASE + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : null,
  });

  // Check if response is OK
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({
      message: `HTTP error! status: ${res.status}`,
    }));
    return {
      success: false,
      message: errorData.message || `Request failed with status ${res.status}`,
      status: res.status,
    };
  }

  const data = await res.json();
  return data;
}
