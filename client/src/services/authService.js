const API_BASE_URL = "/api/v1";


export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const loginUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};


export const checkLoginStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/login-status`, {
    credentials: "include",
  });

  return response.ok;
};


export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
};

export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
};

export const updateUserProfile = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }

  return response.json();
};
