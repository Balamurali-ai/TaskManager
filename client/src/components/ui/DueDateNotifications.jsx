import { useState, useEffect } from 'react';
import { showToast } from '../../utils/toast';

const DueDateNotifications = ({ tasks }) => {
  const [hasShownNotifications, setHasShownNotifications] = useState(false);

  useEffect(() => {
    if (tasks.length > 0 && !hasShownNotifications) {
      checkDueDates();
      setHasShownNotifications(true);
    }
  }, [tasks, hasShownNotifications]);

  const checkDueDates = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    });

    const dueTodayTasks = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString();
    });

    const dueTomorrowTasks = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === tomorrow.toDateString();
    });

    if (overdueTasks.length > 0) {
      showToast.error(`⚠️ You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}!`);
    }

    if (dueTodayTasks.length > 0) {
      showToast.warning(`📅 ${dueTodayTasks.length} task${dueTodayTasks.length > 1 ? 's' : ''} due today!`);
    }

    if (dueTomorrowTasks.length > 0) {
      showToast.info(`⏰ ${dueTomorrowTasks.length} task${dueTomorrowTasks.length > 1 ? 's' : ''} due tomorrow.`);
    }
  };

  return null;
};

export default DueDateNotifications;