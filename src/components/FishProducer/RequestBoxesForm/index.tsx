"use client";

import { useState } from "react";
import { Calendar, Clock, Truck, Phone, AlertCircle, Ship } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BoxRequest {
  boxType: "standard" | "premium";
  quantity: number;
}

interface Boat {
  id: string;
  name: string;
  registrationNumber: string;
  capacity: number;
  boxSize: "20kg" | "40kg";
  status: "active" | "maintenance" | "retired";
  currentUtilization: number;
  availableCapacity: number;
}

// Mock boats data - in real app this would come from your API
const mockBoats: Boat[] = [
  {
    id: "BOAT-001",
    name: "Sea Explorer",
    registrationNumber: "EG-2024-001",
    capacity: 150,
    boxSize: "20kg",
    status: "active",
    currentUtilization: 85,
    availableCapacity: 22,
  },
  {
    id: "BOAT-002",
    name: "Ocean Breeze",
    registrationNumber: "EG-2024-002",
    capacity: 200,
    boxSize: "40kg",
    status: "active",
    currentUtilization: 60,
    availableCapacity: 80,
  },
  {
    id: "BOAT-003",
    name: "Blue Wave",
    registrationNumber: "EG-2024-003",
    capacity: 100,
    boxSize: "20kg",
    status: "active",
    currentUtilization: 45,
    availableCapacity: 55,
  },
];

export default function RequestBoxesForm() {
  const [selectedBoat, setSelectedBoat] = useState<string>("");
  const [boxType, setBoxType] = useState<"standard" | "premium">("standard");
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");

  const timeSlots = [
    "06:00 - 08:00",
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
  ];

  const boxTypes = {
    standard: { name: "Standard Box", capacity: "20kg", price: 50 },
    premium: { name: "Premium Box", capacity: "25kg", price: 75 },
  };

  // Get selected boat details
  const selectedBoatDetails = mockBoats.find(
    (boat) => boat.id === selectedBoat
  );

  const calculateTotal = () => {
    const subtotal = boxTypes[boxType].price * quantity;
    return {
      subtotal,
      total: subtotal,
    };
  };

  const totals = calculateTotal();

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Check if selected quantity exceeds boat capacity
  const isQuantityValid = () => {
    if (!selectedBoatDetails) return true;
    return quantity <= selectedBoatDetails.availableCapacity;
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Request Fish Boxes</h1>
        <p className="text-muted-foreground">
          Order fresh fish storage boxes with flexible pickup and delivery
          options
        </p>
      </div>

      {/* Boat Selection - First Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Select Boat
          </CardTitle>
          <CardDescription>
            Choose which boat will handle your box request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Available Boats</Label>
            <Select value={selectedBoat} onValueChange={setSelectedBoat}>
              <SelectTrigger>
                <SelectValue placeholder="Select a boat from your fleet" />
              </SelectTrigger>
              <SelectContent>
                {mockBoats
                  .filter((boat) => boat.status === "active")
                  .map((boat) => (
                    <SelectItem key={boat.id} value={boat.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{boat.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {boat.registrationNumber} • {boat.boxSize} boxes
                          </span>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-sm font-medium">
                            {boat.availableCapacity}/{boat.capacity} available
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {boat.currentUtilization}% utilized
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedBoatDetails && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedBoatDetails.name}
                    </p>
                    <p className="text-blue-700">
                      Available Capacity:{" "}
                      {selectedBoatDetails.availableCapacity} boxes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-900 font-medium">
                      {selectedBoatDetails.boxSize}
                    </p>
                    <p className="text-blue-700">
                      {selectedBoatDetails.currentUtilization}% used
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Box Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Box Selection</CardTitle>
          <CardDescription>
            Choose the type and quantity of fish boxes you need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Box Type</Label>
                <Select
                  value={boxType}
                  onValueChange={(value) => setBoxType(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(boxTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.name} - {type.capacity} (EGP {type.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  max={selectedBoatDetails?.availableCapacity || 50}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Number.parseInt(e.target.value) || 1)
                  }
                  className={!isQuantityValid() ? "border-red-500" : ""}
                />
                {selectedBoatDetails && (
                  <p className="text-xs text-muted-foreground">
                    Max available: {selectedBoatDetails.availableCapacity} boxes
                  </p>
                )}
                {!isQuantityValid() && (
                  <p className="text-xs text-red-500">
                    Quantity exceeds available capacity (
                    {selectedBoatDetails?.availableCapacity} boxes)
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Details
          </CardTitle>
          <CardDescription>
            Choose how you want to receive your fish boxes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Delivery Address</Label>
            <Textarea
              placeholder="Enter your complete delivery address including building number, floor, and apartment"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Preferred Date
              </Label>
              <Input
                type="date"
                min={getTomorrowDate()}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Time Slot
              </Label>
              <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Special Instructions - Added after time slots */}
          <div className="space-y-2">
            <Label>Special Instructions (Optional)</Label>
            <Textarea
              placeholder="Add any special delivery instructions, access codes, or specific requirements..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Include any specific delivery requirements, access codes, or
              handling instructions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            We'll use this information to coordinate the delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="Enter your full name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                placeholder="+20 xxx xxx xxxx"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {boxTypes[boxType].name} × {quantity}
              </span>
              <span>EGP {(boxTypes[boxType].price * quantity).toFixed(2)}</span>
            </div>
            {selectedBoatDetails && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Assigned to: {selectedBoatDetails.name}</span>
                <span>{selectedBoatDetails.registrationNumber}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>EGP {totals.subtotal.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>EGP {totals.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Validation Alerts */}
      {!selectedBoat && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            <strong>Please select a boat</strong> to proceed with your box
            request.
          </AlertDescription>
        </Alert>
      )}

      {!isQuantityValid() && selectedBoatDetails && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <strong>Quantity exceeds capacity:</strong> The selected boat (
            {selectedBoatDetails.name}) only has{" "}
            {selectedBoatDetails.availableCapacity} boxes available.
          </AlertDescription>
        </Alert>
      )}

      {/* Important Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Fish boxes must be returned within 7 days
          of delivery. A deposit of EGP 50 per box will be charged and refunded
          upon return in good condition.
        </AlertDescription>
      </Alert>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="flex-1"
          disabled={!selectedBoat || !isQuantityValid()}
        >
          Submit Request - EGP {totals.total.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
