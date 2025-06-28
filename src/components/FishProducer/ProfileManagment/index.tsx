"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileAccount from "./profile";
import SubscriptionStatus from "./subscriptions";
import SettingsPreferences from "./settings";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  profileImage: string;
  joinDate: string;
  lastLogin: string;
}

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

interface NotificationSettings {
  emailUpdates: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

const mockProfile: UserProfile = {
  id: "USER-001",
  firstName: "Ahmed",
  lastName: "Hassan",
  email: "ahmed.hassan@example.com",
  phone: "+20 100 123 4567",
  address: "123 Marina Street, Apartment 5B",
  city: "Alexandria",
  country: "Egypt",
  profileImage: "/placeholder.svg?height=100&width=100",
  joinDate: "2023-06-15",
  lastLogin: "2024-01-18T10:30:00Z",
};

const mockSubscription: SubscriptionPlan = {
  id: "SUB-001",
  name: "Quarterly Plan",
  type: "quarterly",
  price: 400,
  totalCapacity: 3500,
  features: [
    "3,500 requests per quarter",
    "Priority support",
    "Advanced analytics",
    "Faster response time",
    "Custom integrations",
  ],
  status: "active",
  startDate: "2024-01-01",
  endDate: "2024-04-01",
  autoRenew: true,
};

const mockUsage: UsageAnalytics = {
  usedCapacityThisPeriod: 1250,
  remainingCapacity: 2250,
  totalRequests: 1250,
  successfulRequests: 1198,
  failedRequests: 52,
  averageResponseTime: 245,
};

const mockBillingHistory: BillingRecord[] = [
  {
    id: "INV-001",
    date: "2024-01-01",
    amount: 400,
    status: "paid",
    description: "Quarterly subscription - Q1 2024",
    invoiceUrl: "#",
  },
  {
    id: "INV-002",
    date: "2023-10-01",
    amount: 400,
    status: "paid",
    description: "Quarterly subscription - Q4 2023",
    invoiceUrl: "#",
  },
  {
    id: "INV-003",
    date: "2023-07-01",
    amount: 400,
    status: "paid",
    description: "Quarterly subscription - Q3 2023",
  },
];

const initialNotifications: NotificationSettings = {
  emailUpdates: true,
  smsAlerts: false,
  pushNotifications: true,
  marketingEmails: false,
};

export default function ProfileManagement() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [subscription] = useState<SubscriptionPlan>(mockSubscription);
  const [usage] = useState<UsageAnalytics>(mockUsage);
  const [billingHistory] = useState<BillingRecord[]>(mockBillingHistory);
  const [notifications, setNotifications] =
    useState<NotificationSettings>(initialNotifications);

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

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleNotificationsUpdate = (
    updatedNotifications: NotificationSettings
  ) => {
    setNotifications(updatedNotifications);
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <p className="text-muted-foreground">
            Manage your account details and subscription settings
          </p>
        </div>
        <Badge className={getStatusColor(subscription.status)}>
          {subscription.status.charAt(0).toUpperCase() +
            subscription.status.slice(1)}{" "}
          Subscription
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile & Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription Status</TabsTrigger>
          <TabsTrigger value="settings">Settings & Preferences</TabsTrigger>
        </TabsList>

        {/* Profile & Account Tab */}
        <TabsContent value="profile" className="space-y-6">
          <ProfileAccount
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>

        {/* Subscription Status Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionStatus
            subscription={subscription}
            usage={usage}
            billingHistory={billingHistory}
          />
        </TabsContent>

        {/* Settings & Preferences Tab */}
        <TabsContent value="settings" className="space-y-6">
          <SettingsPreferences
            notifications={notifications}
            onNotificationsUpdate={handleNotificationsUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
