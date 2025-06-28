"use client";

import { useState } from "react";
import { Plus, Ship, Edit, Trash2, Eye, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BoatForm from "../BoatForms/AddBoat";
import EditBoatForm from "../BoatForms/EditBoat";

interface Boat {
  id: string;
  name: string;
  registrationNumber: string;
  captainName: string;
  capacity: number;
  boxSize: "20kg" | "40kg";
  status: "active" | "maintenance" | "retired";
  photo: string;
  lastMaintenanceDate: string;
  currentUtilization: number;
  totalBoxesUsed: number;
}

const mockBoats: Boat[] = [
  {
    id: "BOAT-001",
    name: "Sea Explorer",
    registrationNumber: "EG-2024-001",
    captainName: "Ahmed Hassan",
    capacity: 150,
    boxSize: "20kg",
    status: "active",
    photo: "/placeholder.svg?height=100&width=100",
    lastMaintenanceDate: "2024-01-10",
    currentUtilization: 85,
    totalBoxesUsed: 128,
  },
  {
    id: "BOAT-002",
    name: "Ocean Breeze",
    registrationNumber: "EG-2024-002",
    captainName: "Mohamed Ali",
    capacity: 200,
    boxSize: "40kg",
    status: "active",
    photo: "/placeholder.svg?height=100&width=100",
    lastMaintenanceDate: "2024-01-05",
    currentUtilization: 60,
    totalBoxesUsed: 120,
  },
  {
    id: "BOAT-003",
    name: "Blue Wave",
    registrationNumber: "EG-2024-003",
    captainName: "Omar Mahmoud",
    capacity: 100,
    boxSize: "20kg",
    status: "maintenance",
    photo: "/placeholder.svg?height=100&width=100",
    lastMaintenanceDate: "2024-01-15",
    currentUtilization: 0,
    totalBoxesUsed: 0,
  },
  {
    id: "BOAT-004",
    name: "Coral Reef",
    registrationNumber: "EG-2024-004",
    captainName: "Fatma Omar",
    capacity: 175,
    boxSize: "40kg",
    status: "retired",
    photo: "/placeholder.svg?height=100&width=100",
    lastMaintenanceDate: "2023-12-20",
    currentUtilization: 0,
    totalBoxesUsed: 0,
  },
];

export default function BoatManagement() {
  const [boats] = useState<Boat[]>(mockBoats);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [isAddBoatModalOpen, setIsAddBoatModalOpen] = useState(false);
  const [isEditBoatModalOpen, setIsEditBoatModalOpen] = useState(false);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return "bg-red-500";
    if (utilization >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const totalCapacity = boats.reduce((sum, boat) => sum + boat.capacity, 0);
  const activeBoats = boats.filter((boat) => boat.status === "active").length;
  const totalUtilization =
    boats.reduce((sum, boat) => sum + boat.currentUtilization, 0) /
    boats.length;

  const handleEditBoat = (boat: Boat) => {
    setEditingBoat(boat);
    setIsEditBoatModalOpen(true);
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Boat Management</h1>
          <p className="text-muted-foreground">
            Manage your fleet and monitor capacity utilization
          </p>
        </div>
        <Dialog open={isAddBoatModalOpen} onOpenChange={setIsAddBoatModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Boat
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
            <BoatForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Boats
                </p>
                <p className="text-2xl font-bold">{boats.length}</p>
              </div>
              <Ship className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Boats
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeBoats}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Capacity
                </p>
                <p className="text-2xl font-bold">{totalCapacity}</p>
                <p className="text-xs text-muted-foreground">boxes</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Utilization
                </p>
                <p className="text-2xl font-bold">
                  {totalUtilization.toFixed(0)}%
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boats List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {boats.map((boat) => (
          <Card key={boat.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Boat Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={boat.photo || "/placeholder.svg"}
                        alt={boat.name}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Ship className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{boat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {boat.registrationNumber}
                      </p>
                      <Badge className={getStatusColor(boat.status)}>
                        {boat.status.charAt(0).toUpperCase() +
                          boat.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBoat(boat)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Boat Details - {boat.name}</DialogTitle>
                          <DialogDescription>
                            Complete information about {boat.name}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedBoat && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-20 w-20">
                                <AvatarImage
                                  src={selectedBoat.photo || "/placeholder.svg"}
                                  alt={selectedBoat.name}
                                />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  <Ship className="h-10 w-10" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-bold">
                                  {selectedBoat.name}
                                </h3>
                                <p className="text-muted-foreground">
                                  {selectedBoat.registrationNumber}
                                </p>
                                <Badge
                                  className={getStatusColor(
                                    selectedBoat.status
                                  )}
                                >
                                  {selectedBoat.status.charAt(0).toUpperCase() +
                                    selectedBoat.status.slice(1)}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Captain
                                </p>
                                <p className="font-medium">
                                  {selectedBoat.captainName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Capacity
                                </p>
                                <p className="font-medium">
                                  {selectedBoat.capacity} boxes
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Box Size
                                </p>
                                <p className="font-medium">
                                  {selectedBoat.boxSize}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Last Maintenance
                                </p>
                                <p className="font-medium">
                                  {new Date(
                                    selectedBoat.lastMaintenanceDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">
                                  Current Utilization
                                </p>
                                <p className="text-sm font-medium">
                                  {selectedBoat.currentUtilization}%
                                </p>
                              </div>
                              <Progress
                                value={selectedBoat.currentUtilization}
                                className={`h-2 ${getUtilizationColor(
                                  selectedBoat.currentUtilization
                                )}`}
                              />
                              <p className="text-xs text-muted-foreground">
                                {selectedBoat.totalBoxesUsed} of{" "}
                                {selectedBoat.capacity} boxes used
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={isEditBoatModalOpen}
                      onOpenChange={setIsEditBoatModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBoat(boat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Edit Boat - {editingBoat?.name}
                          </DialogTitle>
                          <DialogDescription>
                            Update boat information and settings
                          </DialogDescription>
                        </DialogHeader>
                        {editingBoat && (
                          <EditBoatForm
                            boat={editingBoat}
                            onClose={() => setIsEditBoatModalOpen(false)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Boat Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Captain</p>
                    <p className="font-medium">{boat.captainName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Capacity</p>
                    <p className="font-medium">
                      {boat.capacity} boxes ({boat.boxSize})
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Maintenance</p>
                    <p className="font-medium">
                      {new Date(boat.lastMaintenanceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Boxes Used</p>
                    <p className="font-medium">{boat.totalBoxesUsed}</p>
                  </div>
                </div>

                {/* Capacity Utilization Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Capacity Utilization</p>
                    <p className="text-sm font-medium">
                      {boat.currentUtilization}%
                    </p>
                  </div>
                  <Progress value={boat.currentUtilization} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {boat.totalBoxesUsed} of {boat.capacity} boxes used
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {boats.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No boats in your fleet
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first boat to the system
              </p>
              <Dialog
                open={isAddBoatModalOpen}
                onOpenChange={setIsAddBoatModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Boat
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Your First Boat</DialogTitle>
                    <DialogDescription>
                      Get started by adding your first boat to the fleet
                      management system
                    </DialogDescription>
                  </DialogHeader>
                  <BoatForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
