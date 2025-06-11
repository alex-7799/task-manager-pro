import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router";

interface ProtectedPathProps {
  children: React.ReactNode;
}

export const ProtectedPath = ({ children }: ProtectedPathProps) => {
  const { authStatus } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();
  console.log("Current auth status:", authStatus);
  // TODO: Handle different auth statuses
  if (authStatus === "unauthenticated") {
    console.log("User is unauthenticated, redirecting to home");
    navigate("/", { replace: true });
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
