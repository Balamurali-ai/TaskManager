import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTasks } from "../services/taskService";
import LargeGaugeMeter from "../components/ui/LargeGaugeMeter";
import TaskCard from "../components/task/TaskCard";
import TaskStats from "../components/ui/TaskStats";
import DueDateNotifications from "../components/ui/DueDateNotifications";
import { showToast } from "../utils/toast";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
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

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const recentTasks = tasks.slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DueDateNotifications tasks={tasks} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your task progress</p>
        </div>
        <Link
          to="/tasks"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center sm:text-left"
        >
          View All Tasks
        </Link>
      </div>

      <TaskStats tasks={tasks} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Tasks</h3>
            <Link to="/tasks" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          {recentTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdate={handleTaskUpdate}
                  onDelete={handleTaskDelete}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-gray-400 text-4xl mb-3">📝</div>
              <h4 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h4>
              <p className="text-gray-500 mb-4">Create your first task to get started!</p>
              <Link
                to="/tasks"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create Task
              </Link>
            </div>
          )}
        </div>

        {/* Large Progress Gauge - Right Side */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Task Progress</h3>
            </div>
            <LargeGaugeMeter completed={completedTasks} total={totalTasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
