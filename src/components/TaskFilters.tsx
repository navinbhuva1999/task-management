import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setSortBy } from '../store/taskSlice';
import { RootState } from '../store';
import { TaskStatus } from '../types';
import { FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

const TaskFilters: React.FC = () => {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state: RootState) => state.tasks.filter);
  const currentSortBy = useSelector((state: RootState) => state.tasks.sortBy);

  const handleFilterChange = (filter: TaskStatus | 'ALL') => {
    dispatch(setFilter(filter));
  };

  const handleSortChange = (sortBy: 'dueDate' | 'title') => {
    dispatch(setSortBy(sortBy));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-sm font-medium text-gray-700">Filter Tasks</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleFilterChange('ALL')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentFilter === 'ALL'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => handleFilterChange('TODO')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentFilter === 'TODO'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          To Do
        </button>
        <button
          onClick={() => handleFilterChange('IN_PROGRESS')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentFilter === 'IN_PROGRESS'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => handleFilterChange('DONE')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentFilter === 'DONE'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Done
        </button>
      </div>
      
      <div className="flex items-center">
        <ArrowsUpDownIcon className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-sm font-medium text-gray-700 mr-3">Sort by:</span>
        <select
          value={currentSortBy}
          onChange={(e) => handleSortChange(e.target.value as 'dueDate' | 'title')}
          className="rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 bg-white"
        >
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters; 