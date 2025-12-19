import { useState } from "react";
import { updateTask, deleteTask } from "../../services/taskService";

const BulkActions = ({ selectedTasks, tasks, onTaskUpdate, onTaskDelete, onClearSelection }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return;
    
    setIsProcessing(true);
    try {
      const promises = selectedTasks.map(taskId => 
        updateTask(taskId, { completed: true })
      );
      
      const updatedTasks = await Promise.all(promises);
      updatedTasks.forEach(task => onTaskUpdate(task));
      onClearSelection();
    } catch (error) {
      console.error("Failed to complete tasks:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      setIsProcessing(true);
      try {
        const promises = selectedTasks.map(taskId => deleteTask(taskId));
        await Promise.all(promises);
        selectedTasks.forEach(taskId => onTaskDelete(taskId));
        onClearSelection();
      } catch (error) {
        console.error("Failed to delete tasks:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleBulkPriority = async (priority) => {
    if (selectedTasks.length === 0) return;
    
    setIsProcessing(true);
    try {
      const promises = selectedTasks.map(taskId => updateTask(taskId, { priority }));
      const updatedTasks = await Promise.all(promises);
      updatedTasks.forEach(task => onTaskUpdate(task));
      onClearSelection();
    } catch (error) {
      console.error("Failed to update priority:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedTasks.length === 0) return null;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
        </span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBulkComplete}
            disabled={isProcessing}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg disabled:opacity-50"
          >
            ✓ Complete
          </button>
          
          <div className="relative group">
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
              Priority ▼
            </button>
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleBulkPriority('high')}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                High
              </button>
              <button
                onClick={() => handleBulkPriority('medium')}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Medium
              </button>
              <button
                onClick={() => handleBulkPriority('low')}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Low
              </button>
            </div>
          </div>
          
          <button
            onClick={handleBulkDelete}
            disabled={isProcessing}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg disabled:opacity-50"
          >
            🗑️ Delete
          </button>
          
          <button
            onClick={onClearSelection}
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;