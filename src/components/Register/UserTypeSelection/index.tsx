"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Truck,
  ShoppingCart,
  Ship,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const userTypes = [
  {
    value: "producer",
    label: "Fish Producer",
    description: "Boat owners and fish producers",
    icon: Ship,
  },
  {
    value: "wholesaler",
    label: "Wholesaler",
    description: "Fish wholesale distributors",
    icon: Building2,
  },
  {
    value: "logistics",
    label: "Logistics Partners",
    description: "Transportation and logistics providers",
    icon: Truck,
  },
  {
    value: "customer",
    label: "Customer",
    description: "End customers and retailers",
    icon: ShoppingCart,
  },
];

const schema = z.object({
  userType: z.string().min(1, "Please select a user type"),
});

type FormData = z.infer<typeof schema>;

interface UserTypeSelectionProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

export default function UserTypeSelection({
  onSubmit,
  loading = false,
}: UserTypeSelectionProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { userType: "" },
  });

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Account Type</CardTitle>
        <CardDescription>
          Select the option that best describes your role in the fish supply
          chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {userTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div key={type.value}>
                            <RadioGroupItem
                              value={type.value}
                              id={type.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={type.value}
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                            >
                              <Icon className="mb-3 h-8 w-8" />
                              <div className="text-center">
                                <div className="font-semibold">
                                  {type.label}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {type.description}
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export { userTypes };
