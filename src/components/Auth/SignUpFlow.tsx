"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import OtpVerification, { OtpVerificationData } from "./OtpVerification";
import SubscriptionRequirements, {
  SubscriptionRequirementsData,
} from "../FishProducer/Register/SubscriptionRequirements";
import Payment, {
  PaymentData,
  PaymentSummary,
} from "../FishProducer/Register/Payment";
import UserTypeSelection, { userTypes } from "../Register/UserTypeSelection";
import PersonalInformation, {
  PersonalInformationData,
} from "../FishProducer/Register/PersonalInformation.tsx";
import SuccessMessage from "../FishProducer/Register/SuccessMessage";
import { supabase } from "@/lib/supabaseClient";

interface FormData {
  userType?: string;
  personalInfo?: PersonalInformationData;
  otp?: OtpVerificationData;
  subscription?: SubscriptionRequirementsData;
  payment?: PaymentData;
}

export default function SignupFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Calculate pricing helper
  const calculatePricing = (
    boats: any[],
    plan: "monthly" | "quarterly" | "annual"
  ) => {
    const BASE_RATE = 2.5;
    const PLAN_DISCOUNTS = { monthly: 0, quarterly: 0.05, annual: 0.15 };

    const totalCapacity = boats.reduce((sum, boat) => sum + boat.capacity, 0);
    const monthlyBaseCost = totalCapacity * BASE_RATE;
    const discount = PLAN_DISCOUNTS[plan];
    const finalMonthlyCost = monthlyBaseCost * (1 - discount);

    const planCosts = {
      monthly: finalMonthlyCost,
      quarterly: finalMonthlyCost * 3,
      annual: finalMonthlyCost * 12,
    };

    return {
      totalCapacity,
      monthlyBaseCost,
      finalMonthlyCost,
      planCosts,
      discount,
    };
  };

  // Progress bar calculation
  const renderProgressBar = () => {
    if (currentStep === 1) return null; // Don't show progress bar on user type selection

    const isProducer = formData.userType === "producer";
    const totalSteps = isProducer ? 5 : 3; // Steps 2-6 for producers, 2-4 for others
    const currentProgressStep = currentStep - 1; // Adjust for starting from step 2
    const progress = (currentProgressStep / totalSteps) * 100;

    return (
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          {/* <span>
            Step {currentProgressStep} of {totalSteps}
          </span> */}
          {/* <span>{Math.round(progress)}% Complete</span> */}
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    );
  };

  // Step handlers
  const handleUserTypeSubmit = (data: { userType: string }) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };

  const handlePersonalInfoSubmit = async (data: PersonalInformationData) => {
    setError("");
    setSuccess("");
    setLoading(true);
    // const phoneWithCountryCode = `+20${data.phone.slice(1)}`;
    // const { error: signInError } = await supabase.auth.signInWithOtp({
    //   phone: phoneWithCountryCode,
    // });
    setTimeout(() => {
      setLoading(false);
      // if (signInError) {
      //   setError(signInError.message);
      // } else {
      setFormData({ ...formData, personalInfo: data });
      setOtpTimer(60);
      setCurrentStep(3);
      setSuccess("OTP sent! Please verify your phone number.");
      // }
    }, 500);
  };

  const handleOtpSubmit = async (data: OtpVerificationData) => {
    setError("");
    setSuccess("");
    setLoading(true);
    // const phoneWithCountryCode = `+20${formData.personalInfo?.phone.slice(1)}`;
    // const { data: verifyData, error: verifyError } =
    //   await supabase.auth.verifyOtp({
    //     phone: phoneWithCountryCode,
    //     token: data.otp,
    //     type: "sms",
    //   });
    setTimeout(() => {
      // if (verifyError) {
      //   setLoading(false);
      //   setError(verifyError.message);
      //   return;
      // }
      // Upsert profile data
      // const user = verifyData.user;
      // if (user && formData.personalInfo) {
      //   const { error: profileError } = await supabase.from("profiles").upsert({
      //     id: user.id,
      //     full_name: formData.personalInfo.fullName,
      //     phone: phoneWithCountryCode,
      //     national_id: formData.personalInfo.nationalId,
      //     company_name: formData.personalInfo.companyName,
      //     role_id: formData.userType, // Adjust if you have a mapping
      //   });
      //   if (profileError) {
      //     setLoading(false);
      //     setError("Profile creation failed: " + profileError.message);
      //     return;
      //   }
      // }
      setLoading(false);
      if (data.otp.length === 6) {
        setFormData({ ...formData, otp: data });
        setSuccess("Registration complete!");
        setTimeout(() => {
          // Skip to success if not a producer
          if (formData.userType !== "producer") {
            setCurrentStep(6); // Success for non-producers
          } else {
            setCurrentStep(4); // Subscription for producers
          }
        }, 1000);
      } else {
        setError("Invalid OTP. Please enter any 6-digit code for development.");
      }
    }, 500);
  };

  const handleSubscriptionSubmit = (data: SubscriptionRequirementsData) => {
    setFormData({ ...formData, subscription: data });
    setCurrentStep(5);
  };

  const handlePaymentSubmit = async (data: PaymentData) => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setFormData({ ...formData, payment: data });
      setCurrentStep(6);
      setLoading(false);
    }, 2000);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");
    // const phoneWithCountryCode = `+20${formData.personalInfo?.phone.slice(1)}`;
    // const { error: resendError } = await supabase.auth.signInWithOtp({
    //   phone: phoneWithCountryCode,
    // });
    setTimeout(() => {
      setResendLoading(false);
      // if (resendError) {
      //   setError(resendError.message);
      // } else {
      setOtpTimer(60);
      setSuccess("OTP resent!");
      // }
    }, 500);
  };

  const handleSuccess = () => {
    window.location.href = "/dashboard";
  };

  // Get payment summary for payment step
  const getPaymentSummary = (): PaymentSummary => {
    if (!formData.subscription) {
      return {
        subscriptionPlan: "monthly",
        totalBoats: 0,
        totalCapacity: 0,
        totalAmount: 0,
      };
    }

    const { boats, subscriptionPlan } = formData.subscription;
    const pricing = calculatePricing(boats, subscriptionPlan);

    return {
      subscriptionPlan,
      totalBoats: boats.length,
      totalCapacity: pricing.totalCapacity,
      totalAmount: pricing.planCosts[subscriptionPlan],
      discount: pricing.discount,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {renderProgressBar()}

        {error && (
          <div className="text-red-500 text-sm text-center mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-sm text-center mb-2">
            {success}
          </div>
        )}

        {currentStep === 1 && (
          <UserTypeSelection
            onSubmit={handleUserTypeSubmit}
            loading={loading}
          />
        )}

        {currentStep === 2 && (
          <PersonalInformation
            onSubmit={handlePersonalInfoSubmit}
            onBack={() => setCurrentStep(1)}
            loading={loading}
            defaultValues={formData.personalInfo}
          />
        )}

        {currentStep === 3 && (
          <OtpVerification
            onSubmit={handleOtpSubmit}
            onBack={() => setCurrentStep(2)}
            onResend={handleResendOTP}
            phone={formData.personalInfo?.phone || ""}
            loading={loading}
            resendLoading={resendLoading}
            initialTimer={otpTimer}
          />
        )}

        {currentStep === 4 && (
          <SubscriptionRequirements
            onSubmit={handleSubscriptionSubmit}
            onBack={() => setCurrentStep(3)}
            loading={loading}
            defaultValues={formData.subscription}
          />
        )}

        {currentStep === 5 && (
          <Payment
            onSubmit={handlePaymentSubmit}
            onBack={() => setCurrentStep(4)}
            paymentSummary={getPaymentSummary()}
            loading={loading}
            defaultValues={formData.payment}
          />
        )}

        {currentStep === 6 && (
          <SuccessMessage
            userType={formData.userType || ""}
            userTypeLabel={
              userTypes.find((t) => t.value === formData.userType)?.label || ""
            }
            phone={formData.personalInfo?.phone || ""}
            subscriptionPlan={formData.subscription?.subscriptionPlan}
            onContinue={handleSuccess}
          />
        )}
      </div>
    </div>
  );
}
