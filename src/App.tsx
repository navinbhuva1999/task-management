import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import Header from './components/Header';
import Modal from './components/Modal';
import { Task } from './types';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="min-h-screen bg-gray-50">
          <Header onAddTask={handleAddTask} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Task Management</h1>
            </div>
            
            <TaskFilters />
            <TaskList onEditTask={handleEditTask} />
          </main>
          
          <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            title={editingTask ? 'Edit Task' : 'Create New Task'}
            size="lg"
          >
            <TaskForm task={editingTask} onClose={handleCloseModal} />
          </Modal>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;
