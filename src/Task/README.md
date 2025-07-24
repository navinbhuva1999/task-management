# React.js with Tailwind CSS Project

This project was created with [Create React App](https://github.com/facebook/create-react-app) and [Tailwind CSS](https://tailwindcss.com/).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Tailwind CSS

This project uses Tailwind CSS for styling. The configuration files are:

- `tailwind.config.js`: Contains the Tailwind configuration
- `postcss.config.js`: Contains the PostCSS configuration

The Tailwind directives are included in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Project Structure

- `src/components`: Contains reusable components
  - `Button.js`: A customizable button component with different variants (primary, secondary, success, danger)
  - `Card.js`: A card component for displaying content with title, description, and image
  - `ContactForm.js`: A form component with input validation and submission handling
- `src/App.js`: The main application component that demonstrates the usage of all components
- `src/index.js`: The entry point of the application

## Tailwind CSS Features Demonstrated

This project demonstrates various Tailwind CSS features:

- Responsive design with grid and flex layouts
- Color utilities and theme customization
- Spacing and sizing utilities
- Shadow and border effects
- Hover and focus states
- Form styling
- Component composition with utility classes
