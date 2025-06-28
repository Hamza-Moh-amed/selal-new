"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// OTP logic is mocked in LoginFlow.tsx for development purposes. Remove this comment when restoring real OTP verification.

const schema = z.object({
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number (01XXXXXXXXX)"),
});

type FormData = z.infer<typeof schema>;

interface PhoneLoginProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  defaultValues?: Partial<FormData>;
}

export default function LoginForm({
  onSubmit,
  loading = false,
  defaultValues,
}: PhoneLoginProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      ...defaultValues,
    },
  });

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center space-y-4 pb-8">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-base">
          Enter your phone number to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-4 border border-r-0 rounded-l-md bg-muted h-12">
                        <span className="text-sm font-medium">+20</span>
                      </div>
                      <Input
                        {...field}
                        placeholder="1004956670"
                        className="rounded-l-none h-12"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full h-12"
                size="lg"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Continue"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-primary underline font-medium"
                >
                  Sign up here
                </a>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export type { FormData as PhoneLoginData };
