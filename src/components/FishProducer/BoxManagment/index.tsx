"use client";

import { useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  X,
  Clock,
  Truck,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestBoxesForm from "../RequestBoxesForm";

interface AssignedBox {
  id: string;
  boxType: string;
  serialNumber: string;
  assignedDate: string;
  location: string;
  status: "active" | "ready-for-handover" | "maintenance" | "overdue";
  customerName: string;
  customerPhone: string;
  expectedReturn: string;
  daysAssigned: number;
  depositAmount: number;
  condition: "excellent" | "good" | "fair" | "poor";
}

interface BoxRequest {
  id: string;
  requestDate: string;
  boxType: string;
  quantity: number;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions?: string;
  contactName: string;
  contactPhone: string;
  boatName: string;
  boatId: string;
  status:
    | "pending-review"
    | "approved-preparing"
    | "ready-for-pickup"
    | "in-transit"
    | "delivered"
    | "cancelled";
  totalAmount: number;
  estimatedDelivery: string;
  trackingNumber?: string;
  cancelReason?: string;
  cancelledDate?: string;
  notes?: string;
}

const mockBoxes: AssignedBox[] = [
  {
    id: "BOX-001",
    boxType: "Premium Box - 25kg",
    serialNumber: "PB-2024-001",
    assignedDate: "2024-01-10",
    location: "Port Alexandria - Main Harbor",
    status: "active",
    customerName: "Ahmed Hassan",
    customerPhone: "+20 100 123 4567",
    expectedReturn: "2024-01-17",
    daysAssigned: 8,
    depositAmount: 50,
    condition: "excellent",
  },
  {
    id: "BOX-002",
    boxType: "Standard Box - 20kg",
    serialNumber: "SB-2024-015",
    assignedDate: "2024-01-12",
    location: "Port Said - Commercial Dock",
    status: "ready-for-handover",
    customerName: "Mohamed Ali",
    customerPhone: "+20 101 234 5678",
    expectedReturn: "2024-01-19",
    daysAssigned: 6,
    depositAmount: 50,
    condition: "good",
  },
  {
    id: "BOX-003",
    boxType: "Large Box - 35kg",
    serialNumber: "LB-2024-008",
    assignedDate: "2024-01-05",
    location: "Suez - Fishing Terminal",
    status: "overdue",
    customerName: "Fatma Omar",
    customerPhone: "+20 102 345 6789",
    expectedReturn: "2024-01-12",
    daysAssigned: 13,
    depositAmount: 50,
    condition: "fair",
  },
  {
    id: "BOX-004",
    boxType: "Premium Box - 25kg",
    serialNumber: "PB-2024-023",
    assignedDate: "2024-01-14",
    location: "Hurghada - Marina District",
    status: "active",
    customerName: "Omar Mahmoud",
    customerPhone: "+20 103 456 7890",
    expectedReturn: "2024-01-21",
    daysAssigned: 4,
    depositAmount: 50,
    condition: "excellent",
  },
  {
    id: "BOX-005",
    boxType: "Standard Box - 20kg",
    serialNumber: "SB-2024-032",
    assignedDate: "2024-01-08",
    location: "Sharm El Sheikh - Harbor",
    status: "maintenance",
    customerName: "Sara Ahmed",
    customerPhone: "+20 104 567 8901",
    expectedReturn: "2024-01-15",
    daysAssigned: 10,
    depositAmount: 50,
    condition: "poor",
  },
];

const mockRequests: BoxRequest[] = [
  {
    id: "REQ-001",
    requestDate: "2024-01-18T10:30:00Z",
    boxType: "Premium Box",
    quantity: 5,
    deliveryAddress: "123 Marina Street, Alexandria",
    deliveryDate: "2024-01-20",
    deliveryTime: "10:00 - 12:00",
    specialInstructions: "Please call before delivery",
    contactName: "Ahmed Hassan",
    contactPhone: "+20 100 123 4567",
    boatName: "Sea Explorer",
    boatId: "BOAT-001",
    status: "pending-review",
    totalAmount: 375,
    estimatedDelivery: "2024-01-20T11:00:00Z",
    notes: "Customer requested morning delivery",
  },
  {
    id: "REQ-002",
    requestDate: "2024-01-17T14:20:00Z",
    boxType: "Standard Box",
    quantity: 10,
    deliveryAddress: "456 Harbor Road, Port Said",
    deliveryDate: "2024-01-19",
    deliveryTime: "14:00 - 16:00",
    contactName: "Mohamed Ali",
    contactPhone: "+20 101 234 5678",
    boatName: "Ocean Breeze",
    boatId: "BOAT-002",
    status: "approved-preparing",
    totalAmount: 500,
    estimatedDelivery: "2024-01-19T15:00:00Z",
    trackingNumber: "TRK-2024-002",
  },
  {
    id: "REQ-003",
    requestDate: "2024-01-16T09:15:00Z",
    boxType: "Premium Box",
    quantity: 3,
    deliveryAddress: "789 Coastal Avenue, Hurghada",
    deliveryDate: "2024-01-18",
    deliveryTime: "08:00 - 10:00",
    contactName: "Fatma Omar",
    contactPhone: "+20 102 345 6789",
    boatName: "Blue Wave",
    boatId: "BOAT-003",
    status: "ready-for-pickup",
    totalAmount: 225,
    estimatedDelivery: "2024-01-18T09:00:00Z",
    trackingNumber: "TRK-2024-003",
  },
  {
    id: "REQ-004",
    requestDate: "2024-01-15T16:45:00Z",
    boxType: "Standard Box",
    quantity: 7,
    deliveryAddress: "321 Port Street, Suez",
    deliveryDate: "2024-01-17",
    deliveryTime: "12:00 - 14:00",
    contactName: "Omar Mahmoud",
    contactPhone: "+20 103 456 7890",
    boatName: "Sea Explorer",
    boatId: "BOAT-001",
    status: "in-transit",
    totalAmount: 350,
    estimatedDelivery: "2024-01-17T13:00:00Z",
    trackingNumber: "TRK-2024-004",
  },
  {
    id: "REQ-005",
    requestDate: "2024-01-14T11:30:00Z",
    boxType: "Premium Box",
    quantity: 2,
    deliveryAddress: "654 Marina Bay, Sharm El Sheikh",
    deliveryDate: "2024-01-16",
    deliveryTime: "16:00 - 18:00",
    contactName: "Sara Ahmed",
    contactPhone: "+20 104 567 8901",
    boatName: "Ocean Breeze",
    boatId: "BOAT-002",
    status: "delivered",
    totalAmount: 150,
    estimatedDelivery: "2024-01-16T17:00:00Z",
    trackingNumber: "TRK-2024-005",
  },
  {
    id: "REQ-006",
    requestDate: "2024-01-13T08:20:00Z",
    boxType: "Standard Box",
    quantity: 4,
    deliveryAddress: "987 Fishing Port, Alexandria",
    deliveryDate: "2024-01-15",
    deliveryTime: "06:00 - 08:00",
    contactName: "Layla Hassan",
    contactPhone: "+20 105 678 9012",
    boatName: "Blue Wave",
    boatId: "BOAT-003",
    status: "cancelled",
    totalAmount: 200,
    estimatedDelivery: "2024-01-15T07:00:00Z",
    cancelReason: "Customer requested cancellation due to schedule change",
    cancelledDate: "2024-01-14T10:00:00Z",
  },
];

export default function BoxManagement() {
  const [boxes] = useState<AssignedBox[]>(mockBoxes);
  const [requests] = useState<BoxRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [requestSearchTerm, setRequestSearchTerm] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>("all");
  const [selectedBox, setSelectedBox] = useState<AssignedBox | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<BoxRequest | null>(
    null
  );
  const [handoverNotes, setHandoverNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isHandoverDialogOpen, setIsHandoverDialogOpen] = useState(false);
  const [isRequestBoxesModalOpen, setIsRequestBoxesModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "ready-for-handover":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "pending-review":
        return "bg-yellow-100 text-yellow-800";
      case "approved-preparing":
        return "bg-blue-100 text-blue-800";
      case "ready-for-pickup":
        return "bg-purple-100 text-purple-800";
      case "in-transit":
        return "bg-orange-100 text-orange-600";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRequestStatusIcon = (status: string) => {
    switch (status) {
      case "pending-review":
        return <Clock className="h-4 w-4" />;
      case "approved-preparing":
        return <Package className="h-4 w-4" />;
      case "ready-for-pickup":
        return <CheckCircle className="h-4 w-4" />;
      case "in-transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRequestStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredBoxes = boxes.filter((box) => {
    const matchesSearch =
      box.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || box.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
      request.contactName
        .toLowerCase()
        .includes(requestSearchTerm.toLowerCase()) ||
      request.boatName
        .toLowerCase()
        .includes(requestSearchTerm.toLowerCase()) ||
      (request.trackingNumber &&
        request.trackingNumber
          .toLowerCase()
          .includes(requestSearchTerm.toLowerCase()));
    const matchesStatus =
      requestStatusFilter === "all" || request.status === requestStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInitiateHandover = (box: AssignedBox) => {
    setSelectedBox(box);
    setIsHandoverDialogOpen(true);
  };

  const handleConfirmHandover = () => {
    console.log(
      "Initiating handover for box:",
      selectedBox?.id,
      "Notes:",
      handoverNotes
    );
    setIsHandoverDialogOpen(false);
    setHandoverNotes("");
    setSelectedBox(null);
  };

  const handleCancelRequest = (request: BoxRequest) => {
    setSelectedRequest(request);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    console.log(
      "Cancelling request:",
      selectedRequest?.id,
      "Reason:",
      cancelReason
    );
    setIsCancelDialogOpen(false);
    setCancelReason("");
    setSelectedRequest(null);
  };

  const canCancelRequest = (status: string) => {
    return [
      "pending-review",
      "approved-preparing",
      "ready-for-pickup",
    ].includes(status);
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Box Management</h1>
          <p className="text-muted-foreground">
            Manage your box requests and assigned boxes
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50">
            {boxes.filter((b) => b.status === "active").length} Active
          </Badge>
          <Badge variant="outline" className="bg-red-50">
            {boxes.filter((b) => b.status === "overdue").length} Overdue
          </Badge>

          <Dialog
            open={isRequestBoxesModalOpen}
            onOpenChange={setIsRequestBoxesModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Request Boxes
              </Button>
            </DialogTrigger>
            <DialogContent className="!p-0 px-0 py-0 !max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader></DialogHeader>
              <RequestBoxesForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Requests
                </p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter((r) => r.status === "pending-review").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  In Transit
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {requests.filter((r) => r.status === "in-transit").length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Delivered
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter((r) => r.status === "delivered").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for My Requests and Assigned Boxes */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Boxes</TabsTrigger>
        </TabsList>

        {/* My Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          {/* Filters for Requests */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by request ID, customer name, boat name, or tracking number..."
                      value={requestSearchTerm}
                      onChange={(e) => setRequestSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={requestStatusFilter}
                  onValueChange={setRequestStatusFilter}
                >
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending-review">
                      Pending Review
                    </SelectItem>
                    <SelectItem value="approved-preparing">
                      Approved - Preparing
                    </SelectItem>
                    <SelectItem value="ready-for-pickup">
                      Ready for Pickup
                    </SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg">{request.id}</h3>
                        <Badge
                          className={getRequestStatusColor(request.status)}
                        >
                          <div className="flex items-center gap-1">
                            {getRequestStatusIcon(request.status)}
                            {formatRequestStatus(request.status)}
                          </div>
                        </Badge>
                        {request.trackingNumber && (
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {request.trackingNumber}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {request.quantity}x {request.boxType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Delivery:{" "}
                            {new Date(
                              request.deliveryDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{request.deliveryTime}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">
                            {request.deliveryAddress}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">
                            {request.contactName}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {request.contactPhone}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Assigned to:{" "}
                        </span>
                        <span className="font-medium">{request.boatName}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          EGP {request.totalAmount}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Requested:{" "}
                          {new Date(request.requestDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* View Details Button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>
                                Request Details - {request.id}
                              </DialogTitle>
                              <DialogDescription>
                                Complete information about your box request
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <Badge
                                  className={getRequestStatusColor(
                                    request.status
                                  )}
                                >
                                  <div className="flex items-center gap-1">
                                    {getRequestStatusIcon(request.status)}
                                    {formatRequestStatus(request.status)}
                                  </div>
                                </Badge>
                                {request.trackingNumber && (
                                  <Badge
                                    variant="outline"
                                    className="font-mono"
                                  >
                                    Tracking: {request.trackingNumber}
                                  </Badge>
                                )}
                              </div>

                              <Separator />

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Request Information
                                    </Label>
                                    <div className="mt-2 space-y-1">
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Box Type:
                                        </span>{" "}
                                        {request.boxType}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Quantity:
                                        </span>{" "}
                                        {request.quantity}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Total Amount:
                                        </span>{" "}
                                        EGP {request.totalAmount}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">
                                      Delivery Details
                                    </Label>
                                    <div className="mt-2 space-y-1">
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Date:
                                        </span>{" "}
                                        {new Date(
                                          request.deliveryDate
                                        ).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Time:
                                        </span>{" "}
                                        {request.deliveryTime}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Address:
                                        </span>{" "}
                                        {request.deliveryAddress}
                                      </p>
                                    </div>
                                  </div>

                                  {request.specialInstructions && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Special Instructions
                                      </Label>
                                      <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                                        {request.specialInstructions}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Contact Information
                                    </Label>
                                    <div className="mt-2 space-y-1">
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Name:
                                        </span>{" "}
                                        {request.contactName}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Phone:
                                        </span>{" "}
                                        {request.contactPhone}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">
                                      Assigned Boat
                                    </Label>
                                    <div className="mt-2 space-y-1">
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Boat:
                                        </span>{" "}
                                        {request.boatName}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Boat ID:
                                        </span>{" "}
                                        {request.boatId}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">
                                      Timeline
                                    </Label>
                                    <div className="mt-2 space-y-1">
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Requested:
                                        </span>{" "}
                                        {new Date(
                                          request.requestDate
                                        ).toLocaleString()}
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Estimated Delivery:
                                        </span>{" "}
                                        {new Date(
                                          request.estimatedDelivery
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>

                                  {request.status === "cancelled" && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Cancellation Details
                                      </Label>
                                      <div className="mt-2 space-y-1">
                                        <p className="text-sm">
                                          <span className="font-medium">
                                            Cancelled:
                                          </span>{" "}
                                          {request.cancelledDate &&
                                            new Date(
                                              request.cancelledDate
                                            ).toLocaleString()}
                                        </p>
                                        {request.cancelReason && (
                                          <p className="text-sm">
                                            <span className="font-medium">
                                              Reason:
                                            </span>{" "}
                                            {request.cancelReason}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {request.notes && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Additional Notes
                                  </Label>
                                  <p className="text-sm mt-1 p-3 bg-blue-50 rounded">
                                    {request.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Cancel Request Button */}
                        {canCancelRequest(request.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelRequest(request)}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No requests found
                  </h3>
                  <p className="text-muted-foreground">
                    {requestSearchTerm || requestStatusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't made any box requests yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Assigned Boxes Tab */}
        <TabsContent value="assigned" className="space-y-6">
          {/* Filters for Assigned Boxes */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by box ID, serial number, or customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="ready-for-handover">
                      Ready for Handover
                    </SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Boxes List */}
          <div className="space-y-4">
            {filteredBoxes.map((box) => (
              <Card key={box.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg">{box.id}</h3>
                        <Badge className={getStatusColor(box.status)}>
                          {box.status
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                        <Badge className={getConditionColor(box.condition)}>
                          {box.condition.charAt(0).toUpperCase() +
                            box.condition.slice(1)}
                        </Badge>
                        {box.status === "overdue" && (
                          <Badge variant="destructive">
                            {box.daysAssigned - 7} days overdue
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{box.boxType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {box.serialNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Return:{" "}
                            {new Date(box.expectedReturn).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{box.location}</span>
                        </div>
                        <div>
                          <span className="font-medium">
                            {box.customerName}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {box.customerPhone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {box.daysAssigned} days assigned
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Deposit: EGP {box.depositAmount}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {box.status === "ready-for-handover" && (
                          <Button
                            size="sm"
                            onClick={() => handleInitiateHandover(box)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Initiate Handover
                          </Button>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Box Details - {box.id}</DialogTitle>
                              <DialogDescription>
                                Complete information about the assigned box
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">
                                    Status
                                  </Label>
                                  <Badge
                                    className={`${getStatusColor(
                                      box.status
                                    )} mt-1`}
                                  >
                                    {box.status
                                      .replace("-", " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Condition
                                  </Label>
                                  <Badge
                                    className={`${getConditionColor(
                                      box.condition
                                    )} mt-1`}
                                  >
                                    {box.condition.charAt(0).toUpperCase() +
                                      box.condition.slice(1)}
                                  </Badge>
                                </div>
                              </div>

                              <Separator />

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Box Information
                                    </Label>
                                    <p className="text-sm mt-1">
                                      {box.boxType}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                      {box.serialNumber}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Assignment Date
                                    </Label>
                                    <p className="text-sm mt-1">
                                      {new Date(
                                        box.assignedDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Expected Return
                                    </Label>
                                    <p className="text-sm mt-1">
                                      {new Date(
                                        box.expectedReturn
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Customer
                                    </Label>
                                    <p className="text-sm mt-1">
                                      {box.customerName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {box.customerPhone}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Location
                                    </Label>
                                    <p className="text-sm mt-1">
                                      {box.location}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Deposit Amount
                                    </Label>
                                    <p className="text-lg font-bold mt-1">
                                      EGP {box.depositAmount}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBoxes.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No boxes found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No boxes are currently assigned"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Request Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel request {selectedRequest?.id}?
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Cancelling this request will stop the preparation process.
                  This action cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Request ID</Label>
                  <p className="font-medium">{selectedRequest.id}</p>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <p className="font-medium">
                    EGP {selectedRequest.totalAmount}
                  </p>
                </div>
                <div>
                  <Label>Delivery Date</Label>
                  <p className="font-medium">
                    {new Date(
                      selectedRequest.deliveryDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    className={getRequestStatusColor(selectedRequest.status)}
                  >
                    {formatRequestStatus(selectedRequest.status)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cancellation Reason</Label>
                <Textarea
                  placeholder="Please provide a reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(false)}
                >
                  Keep Request
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmCancel}
                  disabled={!cancelReason.trim()}
                >
                  Cancel Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Handover Dialog */}
      <Dialog
        open={isHandoverDialogOpen}
        onOpenChange={setIsHandoverDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Box Handover</DialogTitle>
            <DialogDescription>
              Confirm the handover process for {selectedBox?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedBox && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will notify the customer and initiate the handover
                  process. The deposit will be processed upon successful return.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Box ID</Label>
                  <p className="font-medium">{selectedBox.id}</p>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{selectedBox.customerName}</p>
                </div>
                <div>
                  <Label>Deposit Amount</Label>
                  <p className="font-medium">EGP {selectedBox.depositAmount}</p>
                </div>
                <div>
                  <Label>Days Assigned</Label>
                  <p className="font-medium">{selectedBox.daysAssigned} days</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Handover Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any special instructions or notes for the handover..."
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsHandoverDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmHandover}>
                  Confirm Handover
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
