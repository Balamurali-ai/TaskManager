import TaskCard from "./TaskCard";

const TaskGrid = ({ tasks, onTaskUpdate, onTaskDelete, filter, categoryFilter = "all", searchTerm = "", selectedTasks = [], onTaskSelect, sortBy = "createdAt", sortOrder = "desc" }) => {
  const filteredAndSortedTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || 
      (task.category || "General") === categoryFilter;
    
    if (!matchesSearch || !matchesCategory) return false;
    
    switch (filter) {
      case "completed":
        return task.completed;
      case "pending":
        return !task.completed;
      case "high":
        return task.priority?.toLowerCase() === "high";
      case "medium":
        return task.priority?.toLowerCase() === "medium";
      case "low":
        return task.priority?.toLowerCase() === "low";
      default:
        return true;
    }
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority] || 1;
        bValue = priorityOrder[b.priority] || 1;
        break;
      case "dueDate":
        aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
        break;
      case "createdAt":
      default:
        aValue = new Date(a.createdAt || a._id);
        bValue = new Date(b.createdAt || b._id);
        break;
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (filteredAndSortedTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks found</h3>
        <p className="text-gray-500">
          {filter === "all" ? "Create your first task to get started!" : `No ${filter} tasks available.`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {filteredAndSortedTasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
          isSelected={selectedTasks.includes(task._id)}
          onSelect={onTaskSelect}
        />
      ))}
    </div>
  );
};

export default TaskGrid;