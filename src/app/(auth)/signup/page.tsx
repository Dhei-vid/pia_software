"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Mail, User, Building, MapPin } from "lucide-react";

const SignUpPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate sign up process
    toast.success("Account Created Successfully!", {
      description: "Welcome to Wright PIA. Redirecting to your AI assistant...",
    });

    // Redirect to chat after 2 seconds
    setTimeout(() => {
      router.push("/chat");
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-6">
      <div className="w-full lg:max-w-xl 2xl:max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Join WRIGHT PIA SOFTWARE
          </h1>
          <p className="text-muted-foreground">
            Get instant access to specialized AI for the energy sector
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Create Your Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="transition-all focus:shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
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
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleChange}
                  className="transition-all focus:shadow-lg"
                />
              </div>

              <Button type="submit" className="w-full text-lg py-6 mt-8">
                Create Account & Start Chat
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/chat"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in to chat
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
