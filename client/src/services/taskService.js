const API_BASE_URL = "/api/v1";

export const getTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch tasks");
    }

    return response.json();
  } catch (error) {
    console.error('getTasks error:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create task");
    }

    return response.json();
  } catch (error) {
    console.error('createTask error:', error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    if (!taskId) throw new Error("Task ID is required");
    
    const response = await fetch(`${API_BASE_URL}/tasks/${encodeURIComponent(taskId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update task");
    }

    return response.json();
  } catch (error) {
    console.error('updateTask error:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    if (!taskId) throw new Error("Task ID is required");
    
    const response = await fetch(`${API_BASE_URL}/tasks/${encodeURIComponent(taskId)}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete task");
    }

    return response.json();
  } catch (error) {
    console.error('deleteTask error:', error);
    throw error;
  }
};