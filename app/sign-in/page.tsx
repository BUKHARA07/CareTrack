import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your MediCore dashboard and manage patient care."
    >
      <Suspense fallback={<p className="authLoading">Loading...</p>}>
        <SignInForm />
      </Suspense>
    </AuthLayout>
  );
}

