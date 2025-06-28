"use client";

import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// OTP logic is mocked in LoginFlow.tsx and SignUpFlow.tsx for development purposes. Remove this comment when restoring real OTP verification.

const schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

interface OtpVerificationProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  onResend: () => void;
  phone: string;
  loading?: boolean;
  resendLoading?: boolean;
  initialTimer?: number;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function OtpVerification({
  onSubmit,
  onBack,
  onResend,
  phone,
  loading = false,
  resendLoading = false,
  initialTimer = 60,
  inputRef,
}: OtpVerificationProps) {
  const [timer, setTimer] = useState(initialTimer);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  const handleResend = () => {
    onResend();
    setTimer(60);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verify Your Phone</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to +20{phone?.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-center mb-4">
                    Enter OTP Code
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} {...field} ref={inputRef}>
                        <InputOTPGroup>
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={timer > 0 || resendLoading}
                className="text-sm"
              >
                {resendLoading
                  ? "Resending..."
                  : timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 bg-transparent"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Verifying..." : "Verify"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export type { FormData as OtpVerificationData };
