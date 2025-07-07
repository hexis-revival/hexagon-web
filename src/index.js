import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Beatmaps from './pages/Beatmaps';
import Forums from './pages/Forums';

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
  },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/Rankings",
    element: <Rankings />,
  },
  {
    path: "/Beatmaps",
    element: <Beatmaps />,
  },
  {
    path: "/Forums",
    element: <Forums />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals();
