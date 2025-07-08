import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Beatmaps from './pages/Beatmaps';
import Forums from './pages/Forums';
import Register from './pages/Register';
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: "",
    element: <Home />,
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
    {
    path: "/Register",
    element: <Register />,
  },
      {
    path: "/Login",
    element: <Login />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals();
