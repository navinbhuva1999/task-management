import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { RootState } from '../store';
import { reorderTasks, updateTask } from '../store/taskSlice';
import { Task, TaskStatus } from '../types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const filter = useSelector((state: RootState) => state.tasks.filter);
  const sortBy = useSelector((state: RootState) => state.tasks.sortBy);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    if (filter !== 'ALL') {
      result = result.filter((task) => task.status === filter);
    }

    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [tasks, filter, sortBy]);

  const tasksByStatus = useMemo(() => {
    const grouped = {
      TODO: [] as Task[],
      IN_PROGRESS: [] as Task[],
      DONE: [] as Task[]
    };

    filteredTasks.forEach(task => {
      grouped[task.status].push(task);
    });

    return grouped;
  }, [filteredTasks]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(tasksByStatus[source.droppableId as TaskStatus]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const newTasksByStatus = {
        ...tasksByStatus,
        [source.droppableId]: items
      };

      const newTasks = [
        ...newTasksByStatus.TODO,
        ...newTasksByStatus.IN_PROGRESS,
        ...newTasksByStatus.DONE
      ];

      dispatch(reorderTasks(newTasks));
    } else {
      const sourceItems = Array.from(tasksByStatus[source.droppableId as TaskStatus]);
      const destItems = Array.from(tasksByStatus[destination.droppableId as TaskStatus]);
      
      const [movedTask] = sourceItems.splice(source.index, 1);
      
      const updatedTask: Task = {
        ...movedTask,
        status: destination.droppableId as TaskStatus,
        updatedAt: new Date().toISOString()
      };
      
      destItems.splice(destination.index, 0, updatedTask);
      
      dispatch(updateTask(updatedTask));
    }
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'tasks/deleteTask', payload: taskId });
    }
  };

  const getStatusColor = (status: TaskStatus) => {
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

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'Todo';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return status;
    }
  };

  const getBackgroundColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'bg-yellow-50';
      case 'IN_PROGRESS':
        return 'bg-blue-50';
      case 'DONE':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className={`mb-8 rounded-lg ${getBackgroundColor(status as TaskStatus)} p-4`}>
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">{getStatusLabel(status as TaskStatus)}</h2>
              <span className="ml-2 bg-white text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {statusTasks.length}
              </span>
            </div>
            
            <Droppable droppableId={status} direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex overflow-x-auto pb-2 gap-4 min-h-[120px] ${
                    snapshot.isDraggingOver ? 'bg-gray-100 bg-opacity-50 rounded-lg' : ''
                  }`}
                >
                  {statusTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex-shrink-0 w-80 ${snapshot.isDragging ? 'opacity-75' : ''}`}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div className={`bg-white rounded-lg shadow-sm p-4 h-full ${
                            snapshot.isDragging ? 'shadow-md ring-2 ring-indigo-300' : ''
                          }`}>
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => onEditTask(task)}
                                  className="text-gray-400 hover:text-indigo-600"
                                  aria-label="Edit task"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(task.id)}
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
                                {getStatusLabel(task.status)}
                              </span>
                              
                              <div className="flex items-center text-xs text-gray-500 mt-2">
                                <span>
                                  Due: {dayjs(task.dueDate).format('MMM D, YYYY')}
                                </span>
                              </div>
                              
                              <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                                Created: {dayjs(task.createdAt).format('MMM D, YYYY')}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskList; 