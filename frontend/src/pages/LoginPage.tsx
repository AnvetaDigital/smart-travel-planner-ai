import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loginImage from "@/assets/images/LogIn.jpg";

export default function LoginPage() {
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
            <form className="space-y-4">
              <Input type="email" placeholder="Email Address" />

              <Input type="password" placeholder="Password" />

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
