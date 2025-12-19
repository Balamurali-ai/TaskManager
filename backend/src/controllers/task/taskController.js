import asyncHandler from "express-async-handler";
import TaskModel from "../../models/task/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, category, tags } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new TaskModel({
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate,
      priority: priority || 'medium',
      status: status || 'active',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
      user: req.user._id
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
});
export const getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
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
    
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
});
export const updateTask = asyncHandler(async (req, res) => {
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
    
    // Update only provided fields
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
});
export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
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
    
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});