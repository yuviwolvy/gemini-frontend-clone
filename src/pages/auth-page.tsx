import React from "react";
import LoginForm from "../components/auth/login-form";

const AuthPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-gray-900">
      <LoginForm />
    </div>
  );
};

export default AuthPage;
