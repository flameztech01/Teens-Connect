import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./store";
import Homepage from "./screens/Homepage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <Homepage /> }],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>,
);
