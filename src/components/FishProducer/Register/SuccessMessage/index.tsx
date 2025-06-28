"use client";

import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface SuccessMessageProps {
  userType: string;
  userTypeLabel: string;
  phone: string;
  subscriptionPlan?: string;
  onContinue: () => void;
}

export default function SuccessMessage({
  userType,
  userTypeLabel,
  phone,
  subscriptionPlan,
  onContinue,
}: SuccessMessageProps) {
  const isProducer = userType === "producer";

  return (
    <Card className="w-full max-w-3xl mx-auto text-center">
      <CardContent className="pt-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl mb-2">
          Registration Successful!
        </CardTitle>
        <CardDescription className="mb-6">
          {isProducer
            ? "Your account has been created and is waiting for admin confirmation. You will receive a notification once your subscription is activated."
            : "Your account has been created successfully. You can now start using our platform."}
        </CardDescription>
        {/* <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <div className="flex flex-row items-center justify-center gap-auto">
              <p>Account Type:</p>
              <p>{userTypeLabel}</p>
            </div>
            <div className="flex flex-row items-center justify-center gap-auto">
              <p>Phone:</p>
              <p>+20{phone?.slice(1)}</p>
            </div>

            {isProducer && subscriptionPlan && (
              <div className="flex flex-row items-center justify-center gap-auto">
                <p>Subscription:</p>
                <p>{subscriptionPlan} plan</p>
              </div>
            )}
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
