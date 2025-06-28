"use client";

import { useState, useEffect } from "react";
import { Wallet, Building2, Camera, Ship } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BoatForm() {
  const [numberOfBoats, setNumberOfBoats] = useState<number>(1);
  const [boats, setBoats] = useState<Boat[]>([
    {
      id: "1",
      name: "",
      registrationNumber: "",
      captainName: "",
      capacity: 50,
      boxSize: "20kg",
      status: "active",
      photo: "/placeholder.svg?height=100&width=100",
      lastMaintenanceDate: "",
    },
  ]);
  const [subscriptionPlan, setSubscriptionPlan] = useState<
    "monthly" | "quarterly" | "annual"
  >("monthly");
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "wallet" | "bank"
  >("card");

  // Pricing constants
  const BASE_RATE = 2.5; // EGP per box per month
  const BOX_SIZE_MULTIPLIER = {
    "20kg": 1,
    "40kg": 1.5,
  };
  const PLAN_DISCOUNTS = {
    monthly: 0,
    quarterly: 0.05,
    annual: 0.15,
  };

  // Update boats array when number changes
  useEffect(() => {
    const currentBoats = [...boats];
    if (numberOfBoats > boats.length) {
      // Add new boats
      for (let i = boats.length; i < numberOfBoats; i++) {
        currentBoats.push({
          id: (i + 1).toString(),
          name: "",
          registrationNumber: "",
          captainName: "",
          capacity: 50,
          boxSize: "20kg",
          status: "active",
          photo: "/placeholder.svg?height=100&width=100",
          lastMaintenanceDate: "",
        });
      }
    } else if (numberOfBoats < boats.length) {
      // Remove boats
      currentBoats.splice(numberOfBoats);
    }
    setBoats(currentBoats);
  }, [numberOfBoats]);

  const updateBoat = (id: string, field: keyof Boat, value: any) => {
    setBoats(
      boats.map((boat) => (boat.id === id ? { ...boat, [field]: value } : boat))
    );
  };

  // Calculations
  const totalCapacity = boats.reduce((sum, boat) => sum + boat.capacity, 0);
  const monthlyBaseCost = boats.reduce(
    (sum, boat) =>
      sum + boat.capacity * BOX_SIZE_MULTIPLIER[boat.boxSize] * BASE_RATE,
    0
  );
  const discount = PLAN_DISCOUNTS[subscriptionPlan];
  const finalMonthlyCost = monthlyBaseCost * (1 - discount);

  const planCosts = {
    monthly: finalMonthlyCost,
    quarterly: finalMonthlyCost * 3,
    annual: finalMonthlyCost * 12,
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Add Boats</h1>
        <p className="text-muted-foreground">
          Add more Boats to your fleet. Please fill out all the required
          information.
        </p>
      </div>

      {/* Number of Boats */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Configuration</CardTitle>
          <CardDescription>
            Configure the number of boats in your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="boat-count">Number of Boats</Label>
            <Select
              value={numberOfBoats.toString()}
              onValueChange={(value) =>
                setNumberOfBoats(Number.parseInt(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select number of boats" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Boat" : "Boats"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Boat Details */}
      <Accordion type="multiple" className="space-y-4">
        {boats.map((boat, index) => (
          <AccordionItem
            key={boat.id}
            value={boat.id}
            className="border rounded-lg"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="text-left">
                  <div className="font-semibold">Boat {index + 1}</div>
                  <div className="text-sm text-muted-foreground">
                    {boat.name || "Unnamed"} •{" "}
                    {boat.captainName || "No Captain"} • {boat.capacity} boxes •{" "}
                    {boat.boxSize} • {boat.status}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Boat Photo */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={boat.photo || "/placeholder.svg"}
                      alt="Boat photo"
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Ship className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label>Boat Photo</Label>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Square image recommended
                    </p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`boat-name-${boat.id}`}>Boat Name *</Label>
                    <Input
                      id={`boat-name-${boat.id}`}
                      placeholder="Enter boat name"
                      value={boat.name}
                      onChange={(e) =>
                        updateBoat(boat.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`boat-reg-${boat.id}`}>
                      Registration Number *
                    </Label>
                    <Input
                      id={`boat-reg-${boat.id}`}
                      placeholder="e.g., EG-2024-001"
                      value={boat.registrationNumber}
                      onChange={(e) =>
                        updateBoat(
                          boat.id,
                          "registrationNumber",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`captain-name-${boat.id}`}>
                      Captain Name *
                    </Label>
                    <Input
                      id={`captain-name-${boat.id}`}
                      placeholder="Enter captain's full name"
                      value={boat.captainName}
                      onChange={(e) =>
                        updateBoat(boat.id, "captainName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`boat-capacity-${boat.id}`}>
                      Boat Capacity (boxes) *
                    </Label>
                    <Input
                      id={`boat-capacity-${boat.id}`}
                      type="number"
                      min="50"
                      max="1000"
                      placeholder="e.g., 150"
                      value={boat.capacity}
                      onChange={(e) =>
                        updateBoat(
                          boat.id,
                          "capacity",
                          Number.parseInt(e.target.value) || 50
                        )
                      }
                    />
                  </div>
                </div>

                {/* Box Size Configuration */}
                <div className="space-y-4">
                  <Label>Primary Box Size *</Label>
                  <RadioGroup
                    value={boat.boxSize}
                    onValueChange={(value) =>
                      updateBoat(boat.id, "boxSize", value as "20kg" | "40kg")
                    }
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="20kg" id={`20kg-${boat.id}`} />
                        <Label
                          htmlFor={`20kg-${boat.id}`}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xs">
                              20
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">20kg Boxes</div>
                            <div className="text-sm text-muted-foreground">
                              Standard size
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="40kg" id={`40kg-${boat.id}`} />
                        <Label
                          htmlFor={`40kg-${boat.id}`}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <div className="h-8 w-8 bg-green-100 rounded flex items-center justify-center">
                            <span className="text-green-600 font-bold text-xs">
                              40
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">40kg Boxes</div>
                            <div className="text-sm text-muted-foreground">
                              Large capacity
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Status and Maintenance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Boat Status *</Label>
                    <Select
                      value={boat.status}
                      onValueChange={(value) =>
                        updateBoat(boat.id, "status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="maintenance">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            Maintenance
                          </div>
                        </SelectItem>
                        <SelectItem value="retired">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                            Retired
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`maintenance-date-${boat.id}`}>
                      Last Maintenance Date
                    </Label>
                    <Input
                      id={`maintenance-date-${boat.id}`}
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={boat.lastMaintenanceDate}
                      onChange={(e) =>
                        updateBoat(
                          boat.id,
                          "lastMaintenanceDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* Status Alert */}
                {boat.status === "maintenance" && (
                  <Alert>
                    <AlertDescription>
                      This boat is currently under maintenance and will not be
                      available for new assignments.
                    </AlertDescription>
                  </Alert>
                )}

                {boat.status === "retired" && (
                  <Alert>
                    <AlertDescription>
                      This boat is retired and will not be available for
                      operations.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Capacity Preview */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">
                      {boat.capacity}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Boxes</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      {boat.boxSize}
                    </p>
                    <p className="text-xs text-muted-foreground">Box Size</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">
                      {boat.capacity * (boat.boxSize === "20kg" ? 20 : 40)}kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Weight
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>
            Choose your billing cycle and save with longer commitments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={subscriptionPlan}
            onValueChange={(value) => setSubscriptionPlan(value as any)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="font-medium">
                    Monthly
                  </Label>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    EGP {planCosts.monthly.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quarterly" id="quarterly" />
                  <Label htmlFor="quarterly" className="font-medium">
                    Quarterly
                  </Label>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    5% OFF
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    EGP {planCosts.quarterly.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    every 3 months
                  </div>
                  <div className="text-xs text-green-600">
                    Save EGP{" "}
                    {(monthlyBaseCost * 3 - planCosts.quarterly).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annual" id="annual" />
                  <Label htmlFor="annual" className="font-medium">
                    Annual
                  </Label>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    15% OFF
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    EGP {planCosts.annual.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">per year</div>
                  <div className="text-xs text-green-600">
                    Save EGP{" "}
                    {(monthlyBaseCost * 12 - planCosts.annual).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Pricing Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Total Fleet Capacity:</div>
            <div className="font-medium">{totalCapacity} boxes</div>

            <div>Base Monthly Rate:</div>
            <div className="font-medium">EGP {monthlyBaseCost.toFixed(2)}</div>

            {discount > 0 && (
              <>
                <div>Discount ({(discount * 100).toFixed(0)}%):</div>
                <div className="font-medium text-green-600">
                  -EGP {(monthlyBaseCost * discount).toFixed(2)}
                </div>
              </>
            )}
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <div>Total Cost:</div>
            <div>EGP {planCosts[subscriptionPlan].toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as any)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label
                  htmlFor="wallet"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Wallet className="h-5 w-5" />
                  <span>Digital Wallet</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="bank" id="bank" />
                <Label
                  htmlFor="bank"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Building2 className="h-5 w-5" />
                  <span>Bank Transfer</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="flex-1">
          Subscribe Now - EGP {planCosts[subscriptionPlan].toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
