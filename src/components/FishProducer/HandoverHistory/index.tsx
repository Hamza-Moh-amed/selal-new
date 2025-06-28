"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Package,
  FileText,
  ChevronDown,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HandoverRecord {
  id: string;
  handoverDate: string;
  handoverTime: string;
  recipientInfo: {
    name: string;
    companyName?: string;
    phoneNumber: string;
    idNumber: string;
    idType: string;
  };
  boxes: {
    id: string;
    serialNumber: string;
    type: string;
    condition: "good" | "fair" | "damaged";
    contents: string;
    notes?: string;
  }[];
  photos: {
    boxPhotos: string[];
    recipientIdPhoto: string;
  };
  signature: string;
  additionalNotes?: string;
  status: "completed" | "pending-verification" | "disputed";
  handoverBy: string;
  createdAt: string;
  updatedAt: string;
}

const mockHandovers: HandoverRecord[] = [
  {
    id: "HO-2024-001",
    handoverDate: "2024-01-18",
    handoverTime: "14:30",
    recipientInfo: {
      name: "Ahmed Hassan",
      companyName: "Fresh Fish Co.",
      phoneNumber: "+20 100 123 4567",
      idNumber: "12345678901234",
      idType: "national-id",
    },
    boxes: [
      {
        id: "BOX-001",
        serialNumber: "PB-2024-001",
        type: "Premium Box - 25kg",
        condition: "good",
        contents: "Fresh fish storage containers",
      },
      {
        id: "BOX-002",
        serialNumber: "SB-2024-015",
        type: "Standard Box - 20kg",
        condition: "good",
        contents: "Ice packs and cooling equipment",
      },
    ],
    photos: {
      boxPhotos: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      recipientIdPhoto: "/placeholder.svg?height=200&width=300",
    },
    signature: "data:image/png;base64,signature-data",
    additionalNotes:
      "Handover completed successfully. Recipient was satisfied with box condition.",
    status: "completed",
    handoverBy: "Captain Mohamed Ali",
    createdAt: "2024-01-18T14:30:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
  },
  {
    id: "HO-2024-002",
    handoverDate: "2024-01-17",
    handoverTime: "10:15",
    recipientInfo: {
      name: "Fatma Omar",
      phoneNumber: "+20 102 345 6789",
      idNumber: "98765432109876",
      idType: "national-id",
    },
    boxes: [
      {
        id: "BOX-003",
        serialNumber: "LB-2024-008",
        type: "Large Box - 35kg",
        condition: "fair",
        contents: "Fishing nets and equipment",
        notes: "Minor scratches on exterior",
      },
    ],
    photos: {
      boxPhotos: ["/placeholder.svg?height=200&width=300"],
      recipientIdPhoto: "/placeholder.svg?height=200&width=300",
    },
    signature: "data:image/png;base64,signature-data",
    status: "completed",
    handoverBy: "Captain Sara Ahmed",
    createdAt: "2024-01-17T10:15:00Z",
    updatedAt: "2024-01-17T10:15:00Z",
  },
  {
    id: "HO-2024-003",
    handoverDate: "2024-01-16",
    handoverTime: "16:45",
    recipientInfo: {
      name: "Omar Mahmoud",
      companyName: "Marine Solutions Ltd.",
      phoneNumber: "+20 103 456 7890",
      idNumber: "11223344556677",
      idType: "passport",
    },
    boxes: [
      {
        id: "BOX-004",
        serialNumber: "PB-2024-023",
        type: "Premium Box - 25kg",
        condition: "damaged",
        contents: "Fishing equipment",
        notes: "Damage noted during handover - dent on left side",
      },
    ],
    photos: {
      boxPhotos: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      recipientIdPhoto: "/placeholder.svg?height=200&width=300",
    },
    signature: "data:image/png;base64,signature-data",
    additionalNotes:
      "Damage was pre-existing and documented. Recipient acknowledged condition.",
    status: "disputed",
    handoverBy: "Captain Ahmed Hassan",
    createdAt: "2024-01-16T16:45:00Z",
    updatedAt: "2024-01-16T16:45:00Z",
  },
];

export default function HandoverHistory() {
  const [handovers] = useState<HandoverRecord[]>(mockHandovers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedHandover, setSelectedHandover] =
    useState<HandoverRecord | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending-verification":
        return "bg-yellow-100 text-yellow-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "good":
        return "bg-green-100 text-green-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "damaged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredHandovers = handovers.filter((handover) => {
    const matchesSearch =
      handover.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handover.recipientInfo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      handover.recipientInfo.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      handover.boxes.some(
        (box) =>
          box.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          box.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || handover.status === statusFilter;

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        const handoverDate = new Date(handover.handoverDate);
        const today = new Date();
        const daysDiff = Math.floor(
          (today.getTime() - handoverDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (dateFilter) {
          case "today":
            return daysDiff === 0;
          case "week":
            return daysDiff <= 7;
          case "month":
            return daysDiff <= 30;
          default:
            return true;
        }
      })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExportRecord = (handover: HandoverRecord) => {
    // Simulate export functionality
    console.log("Exporting handover record:", handover.id);
    // In a real app, this would generate and download a PDF or other format
  };

  const handleExportAll = () => {
    console.log("Exporting all filtered records");
    // In a real app, this would export all filtered handover records
  };

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Handover History</h1>
          <p className="text-muted-foreground">
            View and manage completed handover records
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50">
            {handovers.filter((h) => h.status === "completed").length} Completed
          </Badge>
          <Badge variant="outline" className="bg-red-50">
            {handovers.filter((h) => h.status === "disputed").length} Disputed
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Handovers
                </p>
                <p className="text-2xl font-bold">{handovers.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  This Month
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    handovers.filter((h) => {
                      const handoverDate = new Date(h.handoverDate);
                      const now = new Date();
                      return (
                        handoverDate.getMonth() === now.getMonth() &&
                        handoverDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Boxes Transferred
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {handovers.reduce((total, h) => total + h.boxes.length, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    (handovers.filter((h) => h.status === "completed").length /
                      handovers.length) *
                      100
                  )}
                  %
                </p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by handover ID, recipient name, company, or box ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending-verification">
                    Pending Verification
                  </SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportAll}>
                    Export All Records
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportAll}>
                    Export Filtered Results
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Handover Records List */}
      <div className="space-y-4">
        {filteredHandovers.map((handover) => (
          <Card key={handover.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-lg">{handover.id}</h3>
                    <Badge className={getStatusColor(handover.status)}>
                      {formatStatus(handover.status)}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {handover.boxes.length} box
                      {handover.boxes.length !== 1 ? "es" : ""}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(handover.handoverDate).toLocaleDateString()}{" "}
                        at {handover.handoverTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{handover.recipientInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>By {handover.handoverBy}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    {handover.recipientInfo.companyName && (
                      <span className="text-muted-foreground">Company: </span>
                    )}
                    {handover.recipientInfo.companyName && (
                      <span className="font-medium">
                        {handover.recipientInfo.companyName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {handover.boxes.map((box) => (
                      <div
                        key={box.id}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {box.id}
                        </span>
                        <Badge
                          className={getConditionColor(box.condition)}
                          variant="outline"
                        >
                          {box.condition}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Created:{" "}
                      {new Date(handover.createdAt).toLocaleDateString()}
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
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Handover Details - {handover.id}
                          </DialogTitle>
                          <DialogDescription>
                            Complete handover record and documentation
                          </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="details" className="space-y-6">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="boxes">Boxes</TabsTrigger>
                            <TabsTrigger value="photos">Photos</TabsTrigger>
                            <TabsTrigger value="signature">
                              Signature
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="details" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">
                                    Handover Information
                                  </Label>
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm">
                                      <span className="font-medium">Date:</span>{" "}
                                      {new Date(
                                        handover.handoverDate
                                      ).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Time:</span>{" "}
                                      {handover.handoverTime}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Handled by:
                                      </span>{" "}
                                      {handover.handoverBy}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Status:
                                      </span>{" "}
                                      <Badge
                                        className={getStatusColor(
                                          handover.status
                                        )}
                                      >
                                        {formatStatus(handover.status)}
                                      </Badge>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">
                                    Recipient Information
                                  </Label>
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm">
                                      <span className="font-medium">Name:</span>{" "}
                                      {handover.recipientInfo.name}
                                    </p>
                                    {handover.recipientInfo.companyName && (
                                      <p className="text-sm">
                                        <span className="font-medium">
                                          Company:
                                        </span>{" "}
                                        {handover.recipientInfo.companyName}
                                      </p>
                                    )}
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Phone:
                                      </span>{" "}
                                      {handover.recipientInfo.phoneNumber}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">ID:</span>{" "}
                                      {handover.recipientInfo.idNumber} (
                                      {handover.recipientInfo.idType})
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {handover.additionalNotes && (
                              <div>
                                <Label className="text-sm font-medium">
                                  Additional Notes
                                </Label>
                                <p className="text-sm mt-1 p-3 bg-blue-50 rounded">
                                  {handover.additionalNotes}
                                </p>
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="boxes" className="space-y-4">
                            {handover.boxes.map((box) => (
                              <div
                                key={box.id}
                                className="p-4 border rounded-lg space-y-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">{box.id}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {box.serialNumber}
                                    </p>
                                    <p className="text-sm">{box.type}</p>
                                  </div>
                                  <Badge
                                    className={getConditionColor(box.condition)}
                                  >
                                    {box.condition.charAt(0).toUpperCase() +
                                      box.condition.slice(1)}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Contents
                                  </Label>
                                  <p className="text-sm mt-1">{box.contents}</p>
                                </div>
                                {box.notes && (
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Notes
                                    </Label>
                                    <p className="text-sm mt-1 p-2 bg-yellow-50 rounded">
                                      {box.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </TabsContent>

                          <TabsContent value="photos" className="space-y-6">
                            <div>
                              <Label className="text-sm font-medium mb-3 block">
                                Box Photos
                              </Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {handover.photos.boxPhotos.map(
                                  (photo, index) => (
                                    <div
                                      key={index}
                                      className="relative group cursor-pointer"
                                    >
                                      <img
                                        src={photo || "/placeholder.svg"}
                                        alt={`Box photo ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border"
                                        onClick={() => setPreviewImage(photo)}
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <Eye className="h-6 w-6 text-white" />
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <Label className="text-sm font-medium mb-3 block">
                                Recipient ID Photo
                              </Label>
                              <div
                                className="w-64 h-40 cursor-pointer"
                                onClick={() =>
                                  setPreviewImage(
                                    handover.photos.recipientIdPhoto
                                  )
                                }
                              >
                                <img
                                  src={
                                    handover.photos.recipientIdPhoto ||
                                    "/placeholder.svg"
                                  }
                                  alt="Recipient ID"
                                  className="w-full h-full object-cover rounded-lg border"
                                />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="signature" className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium mb-3 block">
                                Digital Signature
                              </Label>
                              <div className="border rounded-lg p-4 bg-gray-50">
                                <img
                                  src={handover.signature || "/placeholder.svg"}
                                  alt="Digital signature"
                                  className="max-w-full h-32 object-contain"
                                />
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                Signed by {handover.recipientInfo.name} on{" "}
                                {new Date(
                                  handover.handoverDate
                                ).toLocaleDateString()}{" "}
                                at {handover.handoverTime}
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>

                    {/* Export Record Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportRecord(handover)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHandovers.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No handover records found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No handover records have been created yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Photo Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
