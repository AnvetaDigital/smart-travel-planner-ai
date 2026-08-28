import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/schemas/authSchema";
import loginImage from "@/assets/images/LogIn.jpg";

const errorText = "mt-1 text-sm text-red-600";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [submitError, setSubmitError] = useState<string | null>(null);

  // Send the user back to whatever protected page bounced them here.
  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? ROUTES.DASHBOARD;

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);

    try {
      await login(data);

      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(error);

      setSubmitError(
        isAxiosError(error) && error.response?.status === 401
          ? "Incorrect email or password."
          : "We couldn't sign you in. Please try again in a moment.",
      );
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:block">
        <img
          src={loginImage}
          alt="Travel"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="bg-[#cddcf8] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-md">
            <h1 className="mb-6 text-center text-3xl font-bold">
              Welcome Back
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email && (
                  <p className={errorText}>{errors.email.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                {errors.password && (
                  <p className={errorText}>{errors.password.message}</p>
                )}
              </div>

              {submitError && (
                <p role="alert" className="text-sm text-red-600">
                  {submitError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to={ROUTES.SIGNUP}
                className="font-medium text-blue-900 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
