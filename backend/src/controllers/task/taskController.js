import TaskModel from "../../models/task/TaskModel.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, category, tags } = req.body;
    
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }
    
    const task = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      category,
      tags,
      user: req.user._id
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log("error in Create task", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getTasks", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Task id is required" });
    }
    
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (!task.user.equals(userId)) {
      return res.status(403).json({ message: "You are not authorized to view this task" });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.log("Error in getTask", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed, category, tags } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (!task.user.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description ? description.trim() : '';
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (completed !== undefined) task.completed = completed;
    if (category !== undefined) task.category = category;
    if (tags !== undefined) task.tags = Array.isArray(tags) ? tags.slice(0, 10) : [];
    
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Task id is required" });
    }
    
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (!task.user.equals(userId)) {
      return res.status(403).json({ message: "You are not authorized to delete this task" });
    }
    
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    console.log("Error in deleteTask", error.message);
    res.status(500).json({ message: error.message });
  }
};