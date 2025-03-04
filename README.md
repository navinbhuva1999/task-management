# Task Management Dashboard

A modern task management application built with React, Redux, TypeScript, and Tailwind CSS.

## Features

- Create, edit, and delete tasks
- Filter tasks by status (To Do, In Progress, Done)
- Sort tasks by due date or title
- Drag and drop functionality for task reordering
- Responsive design for mobile and desktop
- Data persistence using Redux Persist
- Form validation
- Modern UI with Tailwind CSS

## Tech Stack

- React 18
- Redux Toolkit for state management
- TypeScript for type safety
- Tailwind CSS for styling
- React Beautiful DND for drag and drop
- Redux Persist for data persistence
- Day.js for date handling

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  ├── components/        # React components
  ├── store/            # Redux store and slices
  ├── types/            # TypeScript types
  ├── App.tsx           # Main application component
  └── main.tsx         # Application entry point
```

## Design Decisions

- Used Redux Toolkit for efficient state management and reduced boilerplate
- Implemented drag and drop for better user experience
- Used Tailwind CSS for rapid UI development and consistent styling
- Implemented TypeScript for better code maintainability and type safety
- Used Redux Persist to maintain state across page reloads
- Responsive design first approach for mobile compatibility

## License

This project is licensed under the MIT License.
