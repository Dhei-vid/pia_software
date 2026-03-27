"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useTransition, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { extractErrorMessage } from "@/common/helpers";
import { ArrowLeft, Mail, CheckCircle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AuthService from "@/api/auth/auth";
import LoadingSpinner from "@/components/ui/loading";

const CODE_LENGTH = 6;

const ForgotPasswordPage = () => {
  const [isPending, startTransition] = useTransition();
  const [isVerifying, startVerifyTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    startTransition(async () => {
      try {
        // await AuthService.forgotPassword(email);
        setCode(Array(CODE_LENGTH).fill(""));
        setShowCodeDialog(true);
        // Focus first input after dialog opens
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } catch (error) {
        const message = extractErrorMessage(error);
        toast.error("Failed to send reset email. Please try again.", {
          description: message,
        });
      }
    });
  };

  const handleCodeChange = (index: number, value: string) => {
    // Allow only single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const next = [...code];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setCode(next);
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length < CODE_LENGTH) {
      toast.error("Please enter the full verification code");
      return;
    }

    startVerifyTransition(async () => {
      try {
        await AuthService.verifyResetCode(email, fullCode);
        setVerified(true);
      } catch (error) {
        const message = extractErrorMessage(error);
        toast.error("Invalid or expired code. Please try again.", {
          description: message,
        });
        setCode(Array(CODE_LENGTH).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    });
  };

  const handleResend = () => {
    startTransition(async () => {
      try {
        await AuthService.forgotPassword(email);
        setCode(Array(CODE_LENGTH).fill(""));
        toast.success("A new code has been sent to your email");
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } catch (error) {
        const message = extractErrorMessage(error);
        toast.error("Failed to resend code.", { description: message });
      }
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Back to Sign In - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/signin"
          className="inline-flex items-center space-x-2 text-gray hover:text-foreground transition-colors bg-grey/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
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
                  alt="Wright LAW Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground/70 mb-2">
              Reset Your Password
            </h1>
            <p className="text-muted-foreground">
              Enter your email and we&apos;ll send you a verification code
            </p>
          </div>

          <Card className="shadow-xl border-0 dark:bg-dark/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Forgot Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all focus:shadow-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 mt-6 bg-grey hover:bg-grey/80 dark:text-white/80"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex flex-row gap-1 items-center">
                      <LoadingSpinner size="sm" />
                      <p>Sending Code...</p>
                    </div>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
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

      {/* Verification Code Dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-md dark:bg-dark" showCloseButton={!verified}>
          {verified ? (
            <div className="flex flex-col items-center space-y-4 py-4 text-center">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <DialogHeader className="items-center">
                <DialogTitle>Identity Verified</DialogTitle>
                <DialogDescription>
                  Your code was accepted. You can now set a new password.
                </DialogDescription>
              </DialogHeader>
              <Link href="/signin" className="w-full">
                <Button className="w-full bg-grey hover:bg-grey/80 dark:text-white/80">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <DialogHeader>
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <DialogTitle className="text-center">Enter Verification Code</DialogTitle>
                <DialogDescription className="text-center">
                  We sent a {CODE_LENGTH}-digit code to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleVerifySubmit} className="space-y-6 pt-2">
                <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-11 h-13 text-center text-xl font-semibold rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full py-5 bg-grey hover:bg-grey/80 dark:text-white/80"
                  disabled={isVerifying || code.join("").length < CODE_LENGTH}
                >
                  {isVerifying ? (
                    <div className="flex flex-row gap-1 items-center">
                      <LoadingSpinner size="sm" />
                      <p>Verifying...</p>
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn&apos;t receive a code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isPending}
                      className="text-primary hover:underline font-medium disabled:opacity-50"
                    >
                      {isPending ? "Resending..." : "Resend"}
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForgotPasswordPage;
