import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Get started"
      subtitle="Create your account and join thousands of healthcare professionals on MediCore."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
