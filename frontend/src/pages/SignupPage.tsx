import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { signupSchema, type SignupFormData } from "@/schemas/authSchema";
import signupImage from "@/assets/images/SignUp.jpg";

const errorText = "mt-1 text-sm text-red-600";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signup } = useAuth();
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: SignupFormData) => {
    setSubmitError(null);

    try {
      // confirmPassword is a client-side check only - the API never sees it.
      await signup({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      console.error(error);

      setSubmitError(
        isAxiosError(error) && error.response?.status === 409
          ? "An account with this email already exists."
          : "We couldn't create your account. Please try again in a moment.",
      );
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:block">
        <img
          src={signupImage}
          alt="Signup"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="bg-[#cddcf8] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-md">
            <h1 className="mb-6 text-center text-3xl font-bold">
              Create Account
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <Input
                  placeholder="Full Name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className={errorText}>{errors.fullName.message}</p>
                )}
              </div>

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
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                {errors.password && (
                  <p className={errorText}>{errors.password.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className={errorText}>{errors.confirmPassword.message}</p>
                )}
              </div>

              {submitError && (
                <p role="alert" className="text-sm text-red-600">
                  {submitError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-blue-900 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
