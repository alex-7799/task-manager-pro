import { Loader, useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router";

interface ProtectedPathProps {
  children: React.ReactNode;
}

export const ProtectedPath = ({ children }: ProtectedPathProps) => {
  const { authStatus } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();
  if (authStatus === "unauthenticated") {
    console.log("User is unauthenticated, redirecting to home");
    navigate("/", { replace: true });
  }
  if (authStatus === "configuring") {
    console.log("User is configuring, waiting for auth status");
    <Loader width="5rem" height="5rem" aria-label="Loading..." />;
  }
  if (authStatus === "authenticated") {
    return (
      <>
        {children}
      </>
    );
  }
};
