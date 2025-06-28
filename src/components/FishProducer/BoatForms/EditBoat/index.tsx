"use client";

import { useState } from "react";
import { Camera, Calendar, Ship, Save } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditBoatForm({ boat, onClose }: EditBoatFormProps) {
  const [boatData, setBoatData] = useState<Boat>({
    ...boat,
    // Ensure we have all required fields
    currentUtilization: boat.currentUtilization || 0,
    totalBoxesUsed: boat.totalBoxesUsed || 0,
  });

  const updateField = (field: keyof Boat, value: any) => {
    setBoatData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Updating boat data:", boatData);
    // Close the modal after saving
    onClose();
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Edit Boat Details</h1>
        <p className="text-muted-foreground">
          Update the information for {boat.name}
        </p>
      </div>

      {/* Boat Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Boat Photo
          </CardTitle>
          <CardDescription>
            Update the photo of your boat for easy identification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={boatData.photo || "/placeholder.svg"}
                alt="Boat photo"
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <Ship className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-sm text-muted-foreground">
                Recommended: Square image, at least 300x300 pixels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update the basic details about your boat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="boat-name">Boat Name *</Label>
              <Input
                id="boat-name"
                placeholder="Enter boat name"
                value={boatData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration">Registration Number *</Label>
              <Input
                id="registration"
                placeholder="e.g., EG-2024-001"
                value={boatData.registrationNumber}
                onChange={(e) =>
                  updateField("registrationNumber", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="captain">Captain Name *</Label>
              <Input
                id="captain"
                placeholder="Enter captain's full name"
                value={boatData.captainName}
                onChange={(e) => updateField("captainName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Boat Capacity (boxes) *</Label>
              <Input
                id="capacity"
                type="number"
                min="50"
                max="1000"
                placeholder="e.g., 150"
                value={boatData.capacity}
                onChange={(e) =>
                  updateField(
                    "capacity",
                    Number.parseInt(e.target.value) || 100
                  )
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Box Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Box Configuration</CardTitle>
          <CardDescription>
            Update the primary box size for this boat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Primary Box Size *</Label>
            <RadioGroup
              value={boatData.boxSize}
              onValueChange={(value) =>
                updateField("boxSize", value as "20kg" | "40kg")
              }
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="20kg" id="20kg" />
                  <Label
                    htmlFor="20kg"
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
                  <RadioGroupItem value="40kg" id="40kg" />
                  <Label
                    htmlFor="40kg"
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
        </CardContent>
      </Card>

      {/* Status and Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Status & Maintenance
          </CardTitle>
          <CardDescription>
            Update the current status and maintenance information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Boat Status *</Label>
              <Select
                value={boatData.status}
                onValueChange={(value) => updateField("status", value)}
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
              <Label htmlFor="maintenance-date">Last Maintenance Date</Label>
              <Input
                id="maintenance-date"
                type="date"
                max={getTodayDate()}
                value={boatData.lastMaintenanceDate}
                onChange={(e) =>
                  updateField("lastMaintenanceDate", e.target.value)
                }
              />
            </div>
          </div>

          {boatData.status === "maintenance" && (
            <Alert>
              <AlertDescription>
                This boat is currently under maintenance and will not be
                available for new assignments until status is changed to Active.
              </AlertDescription>
            </Alert>
          )}

          {boatData.status === "retired" && (
            <Alert>
              <AlertDescription>
                This boat is retired and will not be available for any
                operations. Consider removing it from your fleet if no longer
                needed.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Current Utilization Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
          <CardDescription>
            Current utilization and usage information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {boatData.capacity}
              </p>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {boatData.totalBoxesUsed}
              </p>
              <p className="text-sm text-muted-foreground">Boxes in Use</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {boatData.currentUtilization}%
              </p>
              <p className="text-sm text-muted-foreground">Utilization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} size="lg" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Update Boat
        </Button>
        <Button variant="outline" size="lg" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
