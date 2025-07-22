"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ArrowLeft,
  Check,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/api/use-auth";
import { getDefaultDashboard } from "@/lib/route-config";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    // Step 2: Company Info
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyCity: "",
    companyState: "",
    companyPostalCode: "",
    // Step 3: Professional Info
    employeeId: "",
    licenseNumber: "",
    // Step 4: Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    // Step 5: Account Security
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>(
    {}
  );

  const {
    user,
    isAuthenticated,
    signUp,
    isSigningUp,
    getSignUpErrorMessage,
  } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User already authenticated, redirecting to dashboard");
      const dashboardRoute = getDefaultDashboard(user.role);
      router.replace(dashboardRoute);
    }
  }, [isAuthenticated, user, router]);

  const validateStep = (step: number): boolean => {
    const stepValidations = {
      1:
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.dateOfBirth,
      2:
        formData.companyName &&
        formData.companyEmail &&
        formData.companyPhone &&
        formData.companyAddress &&
        formData.companyCity &&
        formData.companyState &&
        formData.companyPostalCode,
      3: true, // All fields in step 3 are optional (employeeId, licenseNumber)
      4:
        formData.emergencyContactName &&
        formData.emergencyContactPhone &&
        formData.emergencyContactRelation,
      5:
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword &&
        formData.password.length >= 8 &&
        agreedToTerms,
    };
    return !!stepValidations[step as keyof typeof stepValidations];
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setStepValidation({ ...stepValidation, [currentStep]: true });
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      setErrors("");
    } else {
      setErrors("Please fill in all required fields");
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setFieldErrors({});

    if (!validateStep(5)) {
      setErrors("Please complete all required fields");
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
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      companyName: formData.companyName,
      companyEmail: formData.companyEmail,
      companyPhone: formData.companyPhone,
      companyAddress: formData.companyAddress,
      companyCity: formData.companyCity,
      companyState: formData.companyState,
      companyPostalCode: formData.companyPostalCode,
      employeeId: formData.employeeId,
      licenseNumber: formData.licenseNumber,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      emergencyContactRelation: formData.emergencyContactRelation,
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


  const features = [
    "Project timeline tracking",
    "Team collaboration tools",
    "Budget management",
    "Progress reporting",
    "Document management",
    "Mobile app access",
  ];

  const stepTitles = {
    1: "Personal Information",
    2: "Company Details",
    3: "Professional Information",
    4: "Emergency Contact",
    5: "Account Security",
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
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
                <Label htmlFor="lastName">Last Name *</Label>
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
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+61 400 000 000"
                  className="pl-10 h-12"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  className="pl-10 h-12"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    placeholder="contact@company.com"
                    className="pl-10 h-12"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyPhone"
                    name="companyPhone"
                    type="tel"
                    placeholder="+61 2 9999 0000"
                    className="pl-10 h-12"
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  type="text"
                  placeholder="123 Construction Street"
                  className="pl-10 h-12"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyCity">City *</Label>
                <Input
                  id="companyCity"
                  name="companyCity"
                  type="text"
                  placeholder="Sydney"
                  className="h-12"
                  value={formData.companyCity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyState">State *</Label>
                <Input
                  id="companyState"
                  name="companyState"
                  type="text"
                  placeholder="NSW"
                  className="h-12"
                  value={formData.companyState}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPostalCode">Postal Code *</Label>
                <Input
                  id="companyPostalCode"
                  name="companyPostalCode"
                  type="text"
                  placeholder="2000"
                  className="h-12"
                  value={formData.companyPostalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID (Optional)</Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  placeholder="EMP001"
                  className="pl-10 h-12"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Internal employee identification number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number (Optional)</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  placeholder="Professional license number"
                  className="pl-10 h-12"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your professional license number if applicable
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Both fields are optional - you can skip this step if you
              don&apos;t have this information yet.
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">
                Emergency Contact Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  type="text"
                  placeholder="Jane Doe"
                  className="pl-10 h-12"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">
                Emergency Contact Phone *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="tel"
                  placeholder="+61 400 000 000"
                  className="pl-10 h-12"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation">Relationship *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  type="text"
                  placeholder="Spouse, Parent, Sibling, etc."
                  className="pl-10 h-12"
                  value={formData.emergencyContactRelation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10 h-12"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
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
          </div>
        );

      default:
        return null;
    }
  };

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
          <Card className="w-full max-w-lg shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-6">
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
                  Create Admin Account
                </CardTitle>
                <CardDescription className="text-center mt-2">
                  Setup your construction management system
                </CardDescription>
              </motion.div>

              {/* Progress Steps */}
              <div className="flex justify-between items-center mt-6">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step < currentStep
                          ? "bg-primary text-primary-foreground"
                          : step === currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step < currentStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 5 && (
                      <div
                        className={`w-8 h-0.5 transition-colors ${
                          step < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-lg">
                  {stepTitles[currentStep as keyof typeof stepTitles]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of 5
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                onSubmit={
                  currentStep === 5
                    ? handleSubmit
                    : (e) => {
                        e.preventDefault();
                        handleNext();
                      }
                }
                className="space-y-4"
              >
                {(errors || getSignUpErrorMessage()) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center space-x-2"
                  >
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">
                      {errors || getSignUpErrorMessage()}
                    </span>
                  </motion.div>
                )}

                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                      className="flex-1 h-12"
                      disabled={isSigningUp}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}

                  {currentStep < 5 ? (
                    <Button
                      type="submit"
                      className="flex-1 h-12 text-base font-medium"
                      disabled={!validateStep(currentStep)}
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1 h-12 text-base font-medium"
                      disabled={isSigningUp || !validateStep(5)}
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
                          Create Admin Account
                          <Check className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
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
