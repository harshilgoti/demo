export const API_URL =
  process.env.NEXT_PUBLIC_API_URI || "http://localhost:8080";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${API_URL}${endpoint}`;

  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    return fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  me: async () => {
    return fetchWithAuth("/auth/me");
  },

  logout: async () => {
    return fetchWithAuth("/auth/logout");
  },
};

export const dashboardApi = {
  getAllHabits: async () => {
    const response = await fetchWithAuth("/habits");
    return response?.data ?? [];
  },

  createHabit: async (data: { title: string }) => {
    const response = await fetchWithAuth("/habits", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response?.data;
  },

  markAsDone: async (habitId: string, date: string) => {
    const response = await fetchWithAuth(`/habits/${habitId}/complete`, {
      method: "POST",
      body: JSON.stringify({ date }),
    });
    return response?.data;
  },

  getHabitStatus: async (habitId: string, date: string) => {
    const response = await fetchWithAuth(
      `/habits/${habitId}/status?date=${date}`
    );
    return response?.data;
  },
};
