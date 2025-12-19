import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getTasks, createTask } from "../services/taskService";
import TaskGrid from "../components/task/TaskGrid";
import BulkActions from "../components/task/BulkActions";
import { showToast } from "../utils/toast";
import { exportTasksToCSV, exportTasksToJSON } from "../utils/exportTasks";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      showToast.error("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      const sanitizeInput = (str) => str ? str.trim().slice(0, 500) : '';
      
      const taskData = {
        title: sanitizeInput(data.title),
        description: sanitizeInput(data.description),
        priority: data.priority || 'medium',
        category: data.category || 'General',
        dueDate: data.dueDate,
        tags: data.tags ? data.tags.split(',').map(tag => sanitizeInput(tag)).filter(tag => tag).slice(0, 10) : []
      };
      
      if (!taskData.title) {
        showToast.error("Title is required");
        return;
      }
      
      const newTask = await createTask(taskData);
      setTasks([newTask, ...tasks]);
      setShowAddForm(false);
      reset();
      showToast.success("Task created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
      showToast.error("Failed to create task. Please try again.");
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    showToast.success("Task updated successfully!");
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
    showToast.success("Task deleted successfully!");
  };

  const filterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "General", label: "General" },
    { value: "Work", label: "Work" },
    { value: "Personal", label: "Personal" },
    { value: "Shopping", label: "Shopping" },
    { value: "Health", label: "Health" },
    { value: "Education", label: "Education" },
  ];

  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
  };

  useKeyboardShortcuts([
    {
      keys: 'ctrl+n',
      action: () => setShowAddForm(true)
    },
    {
      keys: 'escape',
      action: () => {
        setShowAddForm(false);
        setSelectedTasks([]);
      }
    },
    {
      keys: 'ctrl+a',
      action: () => {
        const allTaskIds = tasks.map(task => task._id);
        setSelectedTasks(allTaskIds);
      }
    },
    {
      keys: 'ctrl+e',
      action: () => exportTasksToCSV(tasks)
    }
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage all your tasks</p>
          <div className="text-xs text-gray-500 mt-2">
            <span className="mr-4">Ctrl+N: New Task</span>
            <span className="mr-4">Ctrl+A: Select All</span>
            <span className="mr-4">Ctrl+E: Export</span>
            <span>Esc: Cancel/Clear</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <button className="border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
              Export ▼
            </button>
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => exportTasksToCSV(tasks)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportTasksToJSON(tasks)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export JSON
              </button>
            </div>
          </div>
          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="priority-desc">High Priority First</option>
              <option value="priority-asc">Low Priority First</option>
              <option value="dueDate-asc">Due Date (Soon)</option>
              <option value="dueDate-desc">Due Date (Later)</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add New Task
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === option.value
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCategoryFilter(option.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BulkActions
        selectedTasks={selectedTasks}
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onClearSelection={handleClearSelection}
      />

      <TaskGrid
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        filter={filter}
        categoryFilter={categoryFilter}
        searchTerm={searchTerm}
        selectedTasks={selectedTasks}
        onTaskSelect={handleTaskSelect}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

 
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Add New Task</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateTask)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter task description"
                  rows={3}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("description")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("priority")}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("dueDate")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("category")}
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="urgent, meeting, project"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  {...register("tags")}
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;