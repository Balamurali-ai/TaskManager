import express from 'express';
import { createTask,getTasks ,getTask, updateTask, deleteTask} from '../controllers/task/taskController.js';
import {protect} from '../middleware/authMiddleware.js'
const router = express.Router();

router.post("/tasks",protect,createTask);
router.get("/tasks", protect, getTasks);
router.get("/tasks/:id", protect, getTask);
router.patch("/tasks/:id", protect, updateTask);
router.delete("/tasks/:id", protect, deleteTask);
export default router;