import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../types';

interface TaskState {
  tasks: Task[];
  filter: TaskStatus | 'ALL';
  sortBy: 'dueDate' | 'title';
}

const initialState: TaskState = {
  tasks: [],
  filter: 'ALL',
  sortBy: 'dueDate',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<TaskStatus | 'ALL'>) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'dueDate' | 'title'>) => {
      state.sortBy = action.payload;
    },
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const { addTask, updateTask, deleteTask, setFilter, setSortBy, reorderTasks } = taskSlice.actions;
export default taskSlice.reducer; 