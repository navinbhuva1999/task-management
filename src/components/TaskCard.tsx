import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../store/taskSlice';
import { Task } from '../types';
import dayjs from 'dayjs';
import { Draggable } from 'react-beautiful-dnd';
import { PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit }) => {
  const dispatch = useDispatch();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow-sm p-4 h-full"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-indigo-600"
                aria-label="Edit task"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600"
                aria-label="Delete task"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-1 mb-3">{task.description}</p>
          
          <div className="mt-auto">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status.charAt(0) + task.status.slice(1).toLowerCase()}
            </span>
            
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              <span>
                Due: {dayjs(task.dueDate).format('MMM D, YYYY')}
              </span>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
              Created: {dayjs(task.createdAt).format('MMM D, YYYY')}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard; 