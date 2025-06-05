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

Amplify.configure(outputs);

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign={"center"} padding={tokens.space.large}>
        <Image alt="Task Manager Pro Logo" src="./logo.svg" height="10"/>
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator components={components}>
      <App />
    </Authenticator>
  </React.StrictMode>
);
