import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router";

interface ProtectedPathProps {
  children: React.ReactNode;
}

export const ProtectedPath = ({ children }: ProtectedPathProps) => {
  const { authStatus } = useAuthenticator((context) => [context.user]);
  console.log("Current auth status:", authStatus);
  // TODO: Handle different auth statuses
  if (authStatus === "unauthenticated") {
    console.log("User is unauthenticated, redirecting to home");
  }
  if (authStatus === "configuring") {
    console.log("User is configuring, waiting for auth status");
  }
  if (authStatus === "authenticated") {
    return (
      <>
        <h1>Protected Path</h1>

        {children}
      </>
    );
  }
};
