"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useVerifyOTP, useResendOTP } from "@/hooks/api/use-auth";
import {
  Building2,
  Mail,
  ArrowRight,
  Check,
  AlertCircle,
  RotateCcw,
  Shield,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get("email") || "";
  
  // Hooks
  const verifyOTPMutation = useVerifyOTP();
  const resendOTPMutation = useResendOTP();

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && value) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    setError("");
    
    // Auto-submit
    handleVerify(pastedData);
  };

  const handleVerify = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join("");
    
    if (otpToVerify.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");

    verifyOTPMutation.mutate(
      {
        email,
        otpCode: otpToVerify,
      },
      {
        onSuccess: () => {
          setSuccess("Email verified successfully! Redirecting...");
        },
        onError: (error: any) => {
          if (error?.response?.message) {
            setError(error.response.message);
          } else if (error?.message) {
            setError(error.message);
          } else {
            setError("Verification failed. Please try again.");
          }
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      }
    );
  };

  const handleResend = async () => {
    setError("");

    resendOTPMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setSuccess("New verification code sent to your email");
          setTimer(60);
          setCanResend(false);
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (error: any) => {
          if (error?.response?.message) {
            setError(error.response.message);
          } else if (error?.message) {
            setError(error.message);
          } else {
            setError("Failed to resend code. Please try again.");
          }
        }
      }
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center justify-center space-x-2 mb-4"
              >
                <div className="p-3 bg-primary rounded-xl">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">Site Tasker</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <CardTitle className="text-2xl font-bold">
                  Verify Your Email
                </CardTitle>
                <CardDescription className="mt-2">
                  We've sent a 6-digit code to
                  <br />
                  <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center space-x-2"
                  >
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{success}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label className="text-center block">
                    Enter Verification Code
                  </Label>
                  <div 
                    className="flex justify-center space-x-2"
                    onPaste={handlePaste}
                  >
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold"
                        disabled={verifyOTPMutation.isPending}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleVerify()}
                  className="w-full h-12 text-base font-medium"
                  disabled={verifyOTPMutation.isPending || otp.some((digit) => !digit)}
                >
                  {verifyOTPMutation.isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  
                  {canResend ? (
                    <Button
                      variant="outline"
                      onClick={handleResend}
                      disabled={resendOTPMutation.isPending}
                      className="w-full"
                    >
                      {resendOTPMutation.isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <RotateCcw className="w-4 h-4 mr-2" />
                      )}
                      Resend Code
                    </Button>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Resend code in {formatTime(timer)}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-card px-4 text-sm text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Wrong email address?{" "}
                    <Link
                      href="/signup"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Go back to signup
                    </Link>
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}