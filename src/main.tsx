import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { ProtectedPath } from "./components/ProtectedPath.tsx";
import { AuthenticatorComponents } from "./components/AuthenticatorComponents.tsx";

Amplify.configure(outputs);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Authenticator components={AuthenticatorComponents} socialProviders={["google"]}>
        <ProtectedPath>
          <Outlet />
        </ProtectedPath>
      </Authenticator>
    ),
    children: [
      { index: true, Component: App },
      {
        path: "home",
        //Start from here
        // TODO: Create an App layout component
        // that includes the header and footer.
        // With an Outlet for the main content.
        // This will be the main layout for the app.
        // The App component will be rendered inside this layout.
        // This will allow us to have a consistent layout across the app.
        element: (
          <>
            <h1>Welcome to the Home Page</h1>
            <App />
          </>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <RouterProvider router={router} />
    </Authenticator.Provider>
  </React.StrictMode>
);
