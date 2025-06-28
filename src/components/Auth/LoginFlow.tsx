"use client";

import { useState, useRef, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import Login, { PhoneLoginData } from "./LoginForm";
import OtpVerification, { OtpVerificationData } from "./OtpVerification";
import { supabase } from "@/lib/supabaseClient";

interface FormData {
  phone?: string;
  otp?: string;
}

export default function LoginFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [currentStep]);

  // Autofocus OTP input on step 2
  useEffect(() => {
    if (currentStep === 2 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [currentStep]);

  // Step handlers
  const handlePhoneSubmit = async (data: PhoneLoginData) => {
    setError("");
    setSuccess("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormData({ ...formData, phone: data.phone });
      setOtpTimer(60);
      setCurrentStep(2);
      setSuccess("OTP sent! Please verify your phone number.");
    }, 500);
  };

  const handleOtpSubmit = async (data: OtpVerificationData) => {
    setError("");
    setSuccess("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (data.otp.length === 6) {
        setFormData({ ...formData, otp: data.otp });
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setError("Invalid OTP. Please enter any 6-digit code for development.");
      }
    }, 500);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");
    setTimeout(() => {
      setResendLoading(false);
      setOtpTimer(60);
      setSuccess("OTP resent!");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center w-full bg-gray-50 py-8 px-4">
      <div className="w-full mx-auto">
        {error && (
          <div
            className="text-red-500 text-sm text-center mb-2"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="text-green-600 text-sm text-center mb-2"
            role="status"
            aria-live="polite"
          >
            {success}
          </div>
        )}
        {currentStep === 1 && (
          <Login
            onSubmit={handlePhoneSubmit}
            loading={loading}
            defaultValues={{ phone: formData.phone }}
          />
        )}

        {currentStep === 2 && (
          <OtpVerification
            onSubmit={handleOtpSubmit}
            onBack={() => setCurrentStep(1)}
            onResend={handleResendOTP}
            phone={formData.phone || ""}
            loading={loading}
            resendLoading={resendLoading}
            initialTimer={otpTimer}
            inputRef={otpInputRef}
          />
        )}
      </div>
    </div>
  );
}
