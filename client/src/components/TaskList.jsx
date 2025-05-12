import { useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

const API_URL = import.meta.env.VITE_API_URL;

const priorityColors = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800'
};

const statusColors = {
  'To Do': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Done': 'bg-green-100 text-green-800'
};

export default function TaskList({ tasks, projectId, onTaskUpdated, theme }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.patch(
        `${API_URL}/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      setError(err.response?.data?.message || 'Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleEditSubmit = async (updatedTask) => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const taskData = {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        status: updatedTask.status,
        dueDate: updatedTask.dueDate
      };

      const response = await axios.patch(
        `${API_URL}/tasks/${updatedTask._id}`,
        taskData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (onTaskUpdated) {
        onTaskUpdated();
      }
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className={`${theme === 'dark' ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} border px-4 py-3 rounded-lg mb-4`}>
        <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          No tasks found
        </div>
      ) : (
        tasks.map(task => (
          <div
            key={task._id}
            className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 ml-0 md:ml-4 w-full md:w-auto">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  disabled={loading}
                  className={`w-full md:w-auto py-2 px-2 text-sm rounded-md border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-0`}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button
                  onClick={() => handleEdit(task)}
                  disabled={loading}
                  className={`w-full md:w-auto py-2 p-1 rounded-md ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  <svg className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="block md:hidden text-xs">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  disabled={loading}
                  className={`w-full md:w-auto py-2 p-1 rounded-md ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  <svg className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="block md:hidden text-xs">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          projectId={projectId}
          onTaskCreated={handleEditSubmit}
          onClose={() => setEditingTask(null)}
          theme={theme}
          isEditing={true}
        />
      )}
    </div>
  );
} 