"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  numberOfBoats: z.number().min(1).max(10),
  boats: z.array(
    z.object({
      name: z.string().min(1, "Boat name is required"),
      registrationNumber: z.string().min(1, "Registration number is required"),
      capacity: z.number().min(50).max(500),
      boxSize: z.enum(["20kg", "25kg"]),
    })
  ),
  subscriptionPlan: z.enum(["monthly", "quarterly", "annual"]),
});

type FormData = z.infer<typeof schema>;

interface Boat {
  name: string;
  registrationNumber: string;
  capacity: number;
  boxSize: "20kg" | "25kg";
}

interface SubscriptionRequirementsProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  loading?: boolean;
  defaultValues?: Partial<FormData>;
}

export default function SubscriptionRequirements({
  onSubmit,
  onBack,
  loading = false,
  defaultValues,
}: SubscriptionRequirementsProps) {
  // Pricing constants - Fixed: No price difference between box sizes
  const BASE_RATE = 2.5; // EGP per box per month
  const PLAN_DISCOUNTS = { monthly: 0, quarterly: 0.05, annual: 0.15 };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      numberOfBoats: 1,
      boats: [
        { name: "", registrationNumber: "", capacity: 50, boxSize: "20kg" },
      ],
      subscriptionPlan: "monthly",
      ...defaultValues,
    },
  });

  const boats = form.watch("boats") || [];
  const subscriptionPlan = form.watch("subscriptionPlan");
  const numberOfBoats = form.watch("numberOfBoats");

  // Calculate pricing
  const calculatePricing = (
    boats: Boat[],
    plan: "monthly" | "quarterly" | "annual"
  ) => {
    const totalCapacity = boats.reduce((sum, boat) => sum + boat.capacity, 0);
    // Fixed: Same rate for all box sizes
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

  // Update boats array when number changes
  const updateBoatsArray = (numberOfBoats: number) => {
    const currentBoats = form.getValues("boats");
    const newBoats = [...currentBoats];

    if (numberOfBoats > currentBoats.length) {
      for (let i = currentBoats.length; i < numberOfBoats; i++) {
        newBoats.push({
          name: "",
          registrationNumber: "",
          capacity: 50,
          boxSize: "20kg" as const,
        });
      }
    } else if (numberOfBoats < currentBoats.length) {
      newBoats.splice(numberOfBoats);
    }

    form.setValue("boats", newBoats);
  };

  useEffect(() => {
    updateBoatsArray(numberOfBoats);
  }, [numberOfBoats]);

  const pricing = calculatePricing(boats, subscriptionPlan);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Subscription Requirements
          </CardTitle>
          {/* <CardDescription className="text-center">
            As a Fish Producer, you need an active subscription to use our
            platform
          </CardDescription> */}
          <CardDescription className="mt-2 text-center">
            Your subscription cost is calculated based on your total boat
            capacity. Larger commitments receive better discounts.
          </CardDescription>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Number of Boats */}
          <Card>
            <CardHeader>
              <CardTitle>Fleet Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="numberOfBoats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Boats</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        const num = Number.parseInt(value);
                        field.onChange(num);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Boat" : "Boats"}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Boat Details */}
          {boats.map((boat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Boat {index + 1} Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`boats.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boat Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter boat name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`boats.${index}.registrationNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., EG-2024-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`boats.${index}.capacity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boat Capacity (boxes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="50"
                            max="500"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 50
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`boats.${index}.boxSize`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Box Size</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="20kg"
                                id={`20kg-${index}`}
                              />
                              <Label htmlFor={`20kg-${index}`}>20kg</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="25kg"
                                id={`25kg-${index}`}
                              />
                              <Label htmlFor={`25kg-${index}`}>25kg</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Subscription Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Choose your billing cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="subscriptionPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly" className="font-medium">
                              Monthly
                            </Label>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              EGP {pricing.planCosts.monthly.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              per month
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quarterly" id="quarterly" />
                            <Label htmlFor="quarterly" className="font-medium">
                              Quarterly
                            </Label>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              EGP {pricing.planCosts.quarterly.toFixed(2)}
                            </div>
                            <span className="text-sm text-green-800 px-2 py-1 rounded">
                              5% OFF
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="annual" id="annual" />
                            <Label htmlFor="annual" className="font-medium">
                              Annual
                            </Label>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              EGP {pricing.planCosts.annual.toFixed(2)}
                            </div>
                            <span className="text-sm  text-green-800 px-2 py-1 rounded">
                              15% OFF
                            </span>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-row items-center justify-between">
                  <div>Total Fleet Capacity:</div>
                  <div className="font-medium">
                    {pricing.totalCapacity} boxes
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div>Base Monthly Rate:</div>
                  <div className="font-medium">
                    EGP {pricing.monthlyBaseCost.toFixed(2)}
                  </div>
                  {pricing.discount > 0 && (
                    <>
                      <div>
                        Discount ({(pricing.discount * 100).toFixed(0)}%):
                      </div>
                      <div className="font-medium text-green-600">
                        -EGP{" "}
                        {(pricing.monthlyBaseCost * pricing.discount).toFixed(
                          2
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <div>Total Cost:</div>
                <div>EGP {pricing.planCosts[subscriptionPlan].toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              Continue to Payment
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export type { FormData as SubscriptionRequirementsData };
