import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold"> Create Account</h1>

        <form>
          <Input placeholder="Full Name" />

          <Input type="email" placeholder="Email Address" />

          <Input type="password" placeholder="Password" />

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
