import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./store";
import Homepage from "./screens/Homepage.jsx";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin"

import Dashboard from "./screens/Dashboard.js";
import Anonymous from "./screens/Anonymous.js";
import Hire from "./screens/Hire.js";
import Profile from "./screens/Profile.js";
import Settings from "./screens/Settings.js";

import AdminLogin from "./screens/Adminlogin.js";
import AdminDashboard from "./screens/AdminDashboard.js";
import AdminUsers from "./screens/AdminUsers.js";
import AdminAnonymous from "./screens/AdminAnonymous.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "/signup", element: <Signup /> },
      {path: "/signin", element: <Signin /> },
      {path: '/dashboard', element: <Dashboard /> },
      {path: '/anonymous', element: <Anonymous /> },
      {path: '/hire', element: <Hire /> },
      {path: '/profile', element: <Profile /> },
      {path: '/settings', element: <Settings /> },

      {path: '/admin/login', element: <AdminLogin /> },
      {path: '/admin/dashboard', element: <AdminDashboard /> },
      {path: '/admin/users', element: <AdminUsers /> },
      {path: '/admin/anonymous', element: <AdminAnonymous /> },

    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </Provider>
  </GoogleOAuthProvider>
);