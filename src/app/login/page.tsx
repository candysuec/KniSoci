"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Input } from "@/components/ui/input";   // Assuming you have an Input component
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"; // Assuming Card components
import { Chrome, Lock, Mail } from "lucide-react"; // Icons

export default function LoginPage() {
  // You would typically manage email/password state here
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" }); // Redirect to dashboard after login
  };

  // const handleEmailPasswordSignIn = () => {
  //   // Implement email/password login logic here
  //   // signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  // };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-slate to-black text-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-brand-slate/80 backdrop-blur-lg border border-brand-slate/50 shadow-xl rounded-xl p-6">
          <CardHeader className="text-center space-y-2 mb-6">
            {/* Replace with your KniBrand logo */}
            <div className="mx-auto h-12 w-12 bg-brand-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
              K
            </div>
            <h1 className="text-3xl font-bold text-brand-silver">Welcome back!</h1>
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-brand-blue hover:underline">
                Sign up
              </a>
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-100 transition rounded-lg py-2"
            >
              <Chrome className="h-5 w-5" /> Continue with Google
            </Button>

            {/* Placeholder for SSO if needed */}
            {/* <Button
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-100 transition rounded-lg py-2"
            >
              <Lock className="h-5 w-5" /> Continue with SSO
            </Button> */}

            <div className="relative flex items-center justify-center text-xs text-gray-400">
              <span className="absolute left-0 w-full border-t border-gray-700" />
              <span className="relative bg-brand-slate/80 px-2">or</span>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Work email"
                  className="w-full pl-10 bg-brand-slate/50 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 focus:ring-brand-blue focus:border-brand-blue"
                  // onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 bg-brand-slate/50 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 focus:ring-brand-blue focus:border-brand-blue"
                  // onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-6">
            <Button
              // onClick={handleEmailPasswordSignIn}
              className="w-full bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Log In
            </Button>
            <a href="/forgot-password" className="text-brand-blue hover:underline text-sm">
              Forgot Password?
            </a>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
