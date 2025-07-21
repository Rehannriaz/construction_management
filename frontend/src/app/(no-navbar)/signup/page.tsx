"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/api/use-auth";

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
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    companyEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const { signUp, isSigningUp, getSignUpValidationErrors, getSignUpErrorMessage } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setFieldErrors({});

    if (!agreedToTerms) {
      setErrors("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.companyName ||
      !formData.companyEmail ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrors("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setErrors("Password must be at least 8 characters long");
      return;
    }

    const signUpData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      companyName: formData.companyName,
      companyEmail: formData.companyEmail,
      password: formData.password,
    };

    signUp(signUpData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors) setErrors("");
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  // Helper function to get field errors from backend validation
  const getFieldErrors = (fieldName: string) => {
    // First check local field errors
    if (fieldErrors[fieldName] && fieldErrors[fieldName].length > 0) {
      return fieldErrors[fieldName];
    }

    // Then check validation errors from auth hook
    const validationErrors = getSignUpValidationErrors();
    return validationErrors
      .filter((error) => error.field === fieldName)
      .map((error) => error.message);
  };

  const features = [
    "Project timeline tracking",
    "Team collaboration tools",
    "Budget management",
    "Progress reporting",
    "Document management",
    "Mobile app access",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-center space-y-8 px-8"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <div className="p-3 bg-primary rounded-xl">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Site Tasker
                </h1>
                <p className="text-muted-foreground">
                  Construction Management System
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold text-foreground leading-tight">
                Start Managing Your Construction Projects Today
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join thousands of construction professionals who trust Site
                Tracker to deliver projects on time and within budget.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-foreground">
                What you&apos;ll get:
              </h3>
              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="p-1 bg-primary/10 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Site Tasker</span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <CardTitle className="text-2xl font-bold text-center">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-center mt-2">
                  Get started with Site Tasker today
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {(errors || getSignUpErrorMessage()) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center space-x-2"
                  >
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">{errors || getSignUpErrorMessage()}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10 h-12"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      className="h-12"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      className={`pl-10 h-12 ${
                        getFieldErrors("email").length > 0
                          ? "border-destructive"
                          : ""
                      }`}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {getFieldErrors("email").length > 0 && (
                    <div className="space-y-1">
                      {getFieldErrors("email").map((error, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 text-sm text-destructive"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{error}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Your Construction Company"
                      className="pl-10 h-12"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyEmail"
                      name="companyEmail"
                      type="email"
                      placeholder="contact@company.com"
                      className={`pl-10 h-12 ${
                        getFieldErrors("companyEmail").length > 0
                          ? "border-destructive"
                          : ""
                      }`}
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {getFieldErrors("companyEmail").length > 0 && (
                    <div className="space-y-1">
                      {getFieldErrors("companyEmail").map((error, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 text-sm text-destructive"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{error}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className={`pl-10 pr-10 h-12 ${
                        getFieldErrors("password").length > 0
                          ? "border-destructive"
                          : ""
                      }`}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {getFieldErrors("password").length > 0 && (
                    <div className="space-y-1">
                      {getFieldErrors("password").map((error, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 text-sm text-destructive"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{error}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-12"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:text-primary/80"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:text-primary/80"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={isSigningUp || !agreedToTerms}
                >
                  {isSigningUp ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.form>

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
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Sign in here
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
