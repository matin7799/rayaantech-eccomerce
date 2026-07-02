import { createFileRoute } from "@tanstack/react-router";
import { AuthFlow } from "../components/auth";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return <AuthFlow />;
}
