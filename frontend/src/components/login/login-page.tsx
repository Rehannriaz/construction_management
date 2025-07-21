import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
