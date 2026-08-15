import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./store";
import Homepage from "./screens/Homepage.jsx";
import Signup from "./screens/Signup.jsx";
import Signin from "./screens/Signin.jsx";
import Help from "./screens/Help.jsx";
import Talents from "./screens/Talents.jsx";
import TalentId from "./screens/TalentId.jsx";

import Dashboard from "./screens/Dashboard.jsx";
import Anonymous from "./screens/Anonymous.jsx";
import Hire from "./screens/Hire.jsx";
import Profile from "./screens/Profile.jsx";
import Settings from "./screens/Settings.jsx";

import AdminLogin from "./screens/Adminlogin.jsx";
import AdminDashboard from "./screens/AdminDashboard.jsx";
import AdminUsers from "./screens/AdminUsers.jsx";
import AdminAnonymous from "./screens/AdminAnonymous.jsx";
import AdminSettings from "./screens/AdminSettings.jsx";
import AdminNotifications from "./screens/AdminNotifications.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <Signin /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/anonymous", element: <Anonymous /> },
      { path: "/hire", element: <Hire /> },
      { path: "/profile", element: <Profile /> },
      { path: "/settings", element: <Settings /> },
      { path: "/help", element: <Help /> },
      { path: "/explore", element: <Talents /> },
      {path: "/talents", element: <Talents /> },
      {path: "/talents/:id", element: <TalentId /> },

      { path: "/admin/login", element: <AdminLogin /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/anonymous", element: <AdminAnonymous /> },
      { path: "/admin/settings", element: <AdminSettings /> },
      { path: "/admin/notifications", element: <AdminNotifications /> },
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
  </GoogleOAuthProvider>,
);
