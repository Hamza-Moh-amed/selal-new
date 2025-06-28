"use client";

import { Check, TrendingUp, Calendar, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface SubscriptionPlan {
  id: string;
  name: string;
  type: "monthly" | "quarterly" | "annual";
  price: number;
  totalCapacity: number;
  features: string[];
  status: "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

interface UsageAnalytics {
  usedCapacityThisPeriod: number;
  remainingCapacity: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
}

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
  invoiceUrl?: string;
}

interface SubscriptionStatusProps {
  subscription: SubscriptionPlan;
  usage: UsageAnalytics;
  billingHistory: BillingRecord[];
}

const upgradeOptions = [
  {
    name: "Monthly Plan",
    type: "monthly" as const,
    price: 150,
    totalCapacity: 1000,
    features: [
      "1,000 requests per month",
      "Email support",
      "Basic analytics",
      "Standard response time",
    ],
  },
  {
    name: "Quarterly Plan",
    type: "quarterly" as const,
    price: 400,
    totalCapacity: 3500,
    features: [
      "3,500 requests per quarter",
      "Priority support",
      "Advanced analytics",
      "Faster response time",
      "Custom integrations",
    ],
  },
  {
    name: "Annual Plan",
    type: "annual" as const,
    price: 1400,
    totalCapacity: 15000,
    features: [
      "15,000 requests per year",
      "24/7 phone support",
      "Premium analytics",
      "Fastest response time",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
];

export default function SubscriptionStatus({
  subscription,
  usage,
  billingHistory,
}: SubscriptionStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateUsagePercentage = (used: number, total: number) => {
    return Math.min((used / total) * 100, 100);
  };

  const getDaysUntilBilling = () => {
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatPlanType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Current Plan Details
          </CardTitle>
          <CardDescription>
            Your active subscription plan and capacity information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">{subscription.name}</h3>
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status.charAt(0).toUpperCase() +
                    subscription.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Plan Type</p>
                  <p className="font-medium">
                    {formatPlanType(subscription.type)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Capacity</p>
                  <p className="font-medium">
                    {subscription.totalCapacity.toLocaleString()} requests
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Used This Period</p>
                  <p className="font-medium">
                    {usage.usedCapacityThisPeriod.toLocaleString()} requests
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining Capacity</p>
                  <p className="font-medium">
                    {usage.remainingCapacity.toLocaleString()} requests
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Capacity Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.usedCapacityThisPeriod} /{" "}
                    {subscription.totalCapacity}
                  </span>
                </div>
                <Progress
                  value={calculateUsagePercentage(
                    usage.usedCapacityThisPeriod,
                    subscription.totalCapacity
                  )}
                />
              </div>
            </div>

            <div className="text-right space-y-4">
              <div>
                <p className="text-3xl font-bold">
                  EGP {subscription.price.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  per {subscription.type}
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Next Billing Date</p>
                  <p className="text-lg font-bold text-blue-600">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getDaysUntilBilling()} days remaining
                  </p>
                </div>
                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage Analytics
          </CardTitle>
          <CardDescription>
            Detailed analytics for your current billing period
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {usage.totalRequests.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {usage.successfulRequests.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Successful</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {usage.failedRequests.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {usage.averageResponseTime}ms
              </p>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Performance Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-sm text-muted-foreground">
                    {(
                      (usage.successfulRequests / usage.totalRequests) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={(usage.successfulRequests / usage.totalRequests) * 100}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Capacity Utilization
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(
                      (usage.usedCapacityThisPeriod /
                        subscription.totalCapacity) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (usage.usedCapacityThisPeriod /
                      subscription.totalCapacity) *
                    100
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent billing and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((bill) => (
              <div
                key={bill.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{bill.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(bill.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold">EGP {bill.amount.toFixed(2)}</p>
                  <Badge className={getBillingStatusColor(bill.status)}>
                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                  </Badge>
                </div>
                {bill.invoiceUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 bg-transparent"
                  >
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Options</CardTitle>
          <CardDescription>
            Compare and upgrade your subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upgradeOptions.map((plan, index) => (
              <div
                key={index}
                className={`p-6 border rounded-lg ${
                  plan.name === subscription.name
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    {plan.name === subscription.name && (
                      <Badge className="mt-2 bg-blue-100 text-blue-800">
                        Current Plan
                      </Badge>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-3xl font-bold">EGP {plan.price}</p>
                    <p className="text-sm text-muted-foreground">
                      per {plan.type}
                    </p>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      {plan.totalCapacity.toLocaleString()} requests
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="text-sm flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-auto"
                    variant={
                      plan.name === subscription.name ? "outline" : "default"
                    }
                    disabled={plan.name === subscription.name}
                  >
                    {plan.name === subscription.name
                      ? "Current Plan"
                      : "Upgrade"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
