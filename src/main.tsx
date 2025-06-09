import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import {
  Authenticator,
  Image,
  useTheme,
  View,
  Text,
} from "@aws-amplify/ui-react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedPath } from "./components/ProtectedPath.tsx";

Amplify.configure(outputs);

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign={"center"} padding={tokens.space.large}>
        <Image alt="Task Manager Pro Logo" src="./logo.svg" height="10" />
      </View>
    );
  },
  Footer() {
    const { tokens } = useTheme();

    return (
      <View
        textAlign={"center"}
        padding={tokens.space.large}
        color={tokens.colors.font.secondary}
      >
        <Text color={tokens.colors.neutral[80]}>
          &copy; All Rights Reserved <br />
          <a href="www.thinhle.dev">www.thinhle.dev</a>
        </Text>
      </View>
    );
  },
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Authenticator components={components}>
        <App />
      </Authenticator>
    ),
    errorElement: <div>Oops! Something went wrong.</div>,
  },
  {
    path: "/home",
    element: (
      <ProtectedPath>
        <>
          <h1>Home Page!</h1>
        </>
      </ProtectedPath>
    ),
    errorElement: <div>Oops! Something went wrong.</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <RouterProvider router={router} />
    </Authenticator.Provider>
  </React.StrictMode>
);
