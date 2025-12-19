import { useState } from "react";
import { updateTask, deleteTask } from "../../services/taskService";

const TaskCard = ({ task, onUpdate, onDelete, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    category: task.category || 'General',
    tags: task.tags ? task.tags.join(', ') : ''
  });
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleToggleComplete = async () => {
    try {
      const updatedTask = await updateTask(task._id, {
        completed: !task.completed
      });
      onUpdate(updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task._id);
        onDelete(task._id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const dataToSave = {
        ...editData,
        tags: editData.tags ? editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      const updatedTask = await updateTask(task._id, dataToSave);
      onUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category || 'General',
      tags: task.tags ? task.tags.join(', ') : ''
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={2}
          />
          <select
            value={editData.priority}
            onChange={(e) => setEditData({...editData, priority: e.target.value})}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={editData.category}
            onChange={(e) => setEditData({...editData, category: e.target.value})}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
          </select>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={editData.tags}
            onChange={(e) => setEditData({...editData, tags: e.target.value})}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
      isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        <div className="flex items-center space-x-2">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(task._id)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
          )}
          <button
            onClick={handleToggleComplete}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              task.completed
                ? "bg-teal-600 border-teal-600 text-white"
                : "border-gray-300 hover:border-teal-600"
            }`}
          >
            {task.completed && "✓"}
          </button>
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-blue-500 text-sm"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 text-sm"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <p className={`text-sm text-gray-600 mb-3 ${task.completed ? 'line-through' : ''}`}>
        {task.description}
      </p>
      
      {task.category && (
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            📁 {task.category}
          </span>
        </div>
      )}
      
      {task.tags && task.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.tags.map((tag, index) => (
            <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority || 'Medium'}
        </span>
        
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            task.completed
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}>
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;