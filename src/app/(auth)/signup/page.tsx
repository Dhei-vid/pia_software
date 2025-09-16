"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  User,
  Building,
  MapPin,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { extractErrorMessage } from "@/common/helpers";

const SignUpPage = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    company: "",
    role: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    startTransition(async () => {
      try {
        // Simulate sign up process
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Account Created Successfully!", {
          description:
            "Welcome to Wright PIA. Redirecting to your AI assistant...",
        });

        // Redirect to chat after 2 seconds
        setTimeout(() => {
          router.push("/chat");
        }, 2000);
      } catch (error) {
        const message = extractErrorMessage(error);
        toast.error("Failed to create account. Please try again.", {
          description: message,
        });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Back to Home Button - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full lg:max-w-2xl 2xl:max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Wright PIA Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Smart AI Guidance for Nigerian Petroleum Law
            </p>
          </div>

          {/* Sign Up Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Create Your Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className={"grid md:grid-cols-2 gap-4"}>
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstname"
                      className="flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>First Name</span>
                    </Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      type="text"
                      placeholder="Enter your First name"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                      className="transition-all focus:shadow-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastname"
                      className="flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Last Name</span>
                    </Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      type="text"
                      placeholder="Enter your Last name"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                      className="transition-all focus:shadow-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="transition-all focus:shadow-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="transition-all focus:shadow-lg pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Confirm Password</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="transition-all focus:shadow-lg pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="flex items-center space-x-2"
                  >
                    <Building className="w-4 h-4" />
                    <span>Company</span>
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Your energy company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="transition-all focus:shadow-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Job Title</Label>
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="e.g., Petroleum Engineer, Geologist"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="transition-all focus:shadow-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="flex items-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="State, Country"
                    value={formData.location}
                    onChange={handleChange}
                    className="transition-all focus:shadow-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg py-6 mt-8"
                  disabled={isPending}
                >
                  {isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
