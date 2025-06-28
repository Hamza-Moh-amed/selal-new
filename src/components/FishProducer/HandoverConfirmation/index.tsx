"use client";

import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  User,
  Package,
  FileText,
  Check,
  X,
  Download,
  Eye,
  AlertCircle,
  Building,
  Phone,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BoxItem {
  id: string;
  serialNumber: string;
  type: string;
  condition: "good" | "fair" | "damaged";
  contents: string;
  notes?: string;
}

interface RecipientInfo {
  name: string;
  companyName: string;
  phoneNumber: string;
  idNumber: string;
  idType: "national-id" | "passport" | "driving-license";
}

interface HandoverData {
  recipientInfo: RecipientInfo;
  boxes: BoxItem[];
  photos: {
    boxPhotos: File[];
    recipientIdPhoto: File | null;
  };
  signature: string | null;
  additionalNotes: string;
  handoverDate: string;
  handoverTime: string;
}

const mockBoxes: BoxItem[] = [
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
  {
    id: "BOX-003",
    serialNumber: "LB-2024-008",
    type: "Large Box - 35kg",
    condition: "fair",
    contents: "Fishing nets and equipment",
    notes: "Minor scratches on exterior",
  },
];

export default function HandoverConfirmation() {
  const [handoverData, setHandoverData] = useState<HandoverData>({
    recipientInfo: {
      name: "",
      companyName: "",
      phoneNumber: "",
      idNumber: "",
      idType: "national-id",
    },
    boxes: mockBoxes,
    photos: {
      boxPhotos: [],
      recipientIdPhoto: null,
    },
    signature: null,
    additionalNotes: "",
    handoverDate: new Date().toISOString().split("T")[0],
    handoverTime: new Date().toTimeString().slice(0, 5),
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idPhotoInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const steps = [
    { id: 1, title: "Recipient Information", icon: User },
    { id: 2, title: "Box Details", icon: Package },
    { id: 3, title: "Documentation", icon: Camera },
    { id: 4, title: "Confirmation", icon: FileText },
  ];

  const handleRecipientInfoChange = (
    field: keyof RecipientInfo,
    value: string
  ) => {
    setHandoverData((prev) => ({
      ...prev,
      recipientInfo: {
        ...prev.recipientInfo,
        [field]: value,
      },
    }));
  };

  const handleBoxConditionChange = (
    boxId: string,
    condition: "good" | "fair" | "damaged"
  ) => {
    setHandoverData((prev) => ({
      ...prev,
      boxes: prev.boxes.map((box) =>
        box.id === boxId ? { ...box, condition } : box
      ),
    }));
  };

  const handleBoxContentsChange = (boxId: string, contents: string) => {
    setHandoverData((prev) => ({
      ...prev,
      boxes: prev.boxes.map((box) =>
        box.id === boxId ? { ...box, contents } : box
      ),
    }));
  };

  const handleBoxNotesChange = (boxId: string, notes: string) => {
    setHandoverData((prev) => ({
      ...prev,
      boxes: prev.boxes.map((box) =>
        box.id === boxId ? { ...box, notes } : box
      ),
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setHandoverData((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        boxPhotos: [...prev.photos.boxPhotos, ...files],
      },
    }));
  };

  const handleIdPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setHandoverData((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        recipientIdPhoto: file,
      },
    }));
  };

  const removePhoto = (index: number) => {
    setHandoverData((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        boxPhotos: prev.photos.boxPhotos.filter((_, i) => i !== index),
      },
    }));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = signatureCanvasRef.current;
      if (canvas) {
        const signature = canvas.toDataURL();
        setHandoverData((prev) => ({
          ...prev,
          signature,
        }));
      }
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHandoverData((prev) => ({
          ...prev,
          signature: null,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Handover data:", handoverData);
    setIsSubmitting(false);
    // Reset form or redirect
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return (
          handoverData.recipientInfo.name &&
          handoverData.recipientInfo.phoneNumber &&
          handoverData.recipientInfo.idNumber
        );
      case 2:
        return handoverData.boxes.every((box) => box.condition && box.contents);
      case 3:
        return (
          handoverData.photos.boxPhotos.length > 0 &&
          handoverData.photos.recipientIdPhoto &&
          handoverData.signature
        );
      case 4:
        return true;
      default:
        return false;
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

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Handover Confirmation</h1>
          <p className="text-muted-foreground">
            Document the transfer of boxes to recipient
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50">
          Step {currentStep} of {steps.length}
        </Badge>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Step 1: Recipient Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Recipient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Recipient Name *</Label>
                  <Input
                    placeholder="Enter recipient's full name"
                    value={handoverData.recipientInfo.name}
                    onChange={(e) =>
                      handleRecipientInfoChange("name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter company name (optional)"
                      value={handoverData.recipientInfo.companyName}
                      onChange={(e) =>
                        handleRecipientInfoChange("companyName", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="+20 100 123 4567"
                      value={handoverData.recipientInfo.phoneNumber}
                      onChange={(e) =>
                        handleRecipientInfoChange("phoneNumber", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ID Type</Label>
                  <Select
                    value={handoverData.recipientInfo.idType}
                    onValueChange={(
                      value: "national-id" | "passport" | "driving-license"
                    ) => handleRecipientInfoChange("idType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national-id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driving-license">
                        Driving License
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>ID Number *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter ID number"
                      value={handoverData.recipientInfo.idNumber}
                      onChange={(e) =>
                        handleRecipientInfoChange("idNumber", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Box Details */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Box Details & Condition Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {handoverData.boxes.map((box, index) => (
                <div key={box.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{box.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {box.serialNumber}
                      </p>
                      <p className="text-sm">{box.type}</p>
                    </div>
                    <Badge className={getConditionColor(box.condition)}>
                      {box.condition.charAt(0).toUpperCase() +
                        box.condition.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Condition Assessment *</Label>
                      <Select
                        value={box.condition}
                        onValueChange={(value: "good" | "fair" | "damaged") =>
                          handleBoxConditionChange(box.id, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Contents Description *</Label>
                      <Input
                        placeholder="Describe box contents"
                        value={box.contents}
                        onChange={(e) =>
                          handleBoxContentsChange(box.id, e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any additional notes about this box..."
                      value={box.notes || ""}
                      onChange={(e) =>
                        handleBoxNotesChange(box.id, e.target.value)
                      }
                      rows={2}
                    />
                  </div>

                  {index < handoverData.boxes.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Documentation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Box Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Box Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Photos
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {handoverData.photos.boxPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {handoverData.photos.boxPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo) || "/placeholder.svg"}
                          alt={`Box photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              setPreviewImage(URL.createObjectURL(photo))
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {handoverData.photos.boxPhotos.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please upload at least one photo of the boxes being
                      transferred.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Recipient ID Photo */}
            <Card>
              <CardHeader>
                <CardTitle>Recipient ID Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => idPhotoInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Capture ID Photo
                  </Button>
                  <input
                    ref={idPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIdPhotoUpload}
                    className="hidden"
                  />
                </div>

                {handoverData.photos.recipientIdPhoto && (
                  <div className="w-48 h-32">
                    <img
                      src={
                        URL.createObjectURL(
                          handoverData.photos.recipientIdPhoto
                        ) || "/placeholder.svg"
                      }
                      alt="Recipient ID"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                  </div>
                )}

                {!handoverData.photos.recipientIdPhoto && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please capture a photo of the recipient's ID for
                      verification.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Digital Signature */}
            <Card>
              <CardHeader>
                <CardTitle>Digital Signature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <canvas
                    ref={signatureCanvasRef}
                    width={400}
                    height={200}
                    className="border rounded cursor-crosshair w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                    >
                      Clear Signature
                    </Button>
                  </div>
                </div>

                {!handoverData.signature && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please obtain the recipient's digital signature above.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Handover Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipient Summary */}
              <div>
                <h3 className="font-semibold mb-3">Recipient Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">
                      {handoverData.recipientInfo.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Company:</span>
                    <p className="font-medium">
                      {handoverData.recipientInfo.companyName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">
                      {handoverData.recipientInfo.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <p className="font-medium">
                      {handoverData.recipientInfo.idNumber}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Boxes Summary */}
              <div>
                <h3 className="font-semibold mb-3">Boxes Being Transferred</h3>
                <div className="space-y-3">
                  {handoverData.boxes.map((box) => (
                    <div
                      key={box.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{box.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {box.type}
                        </p>
                      </div>
                      <Badge className={getConditionColor(box.condition)}>
                        {box.condition.charAt(0).toUpperCase() +
                          box.condition.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Documentation Summary */}
              <div>
                <h3 className="font-semibold mb-3">Documentation</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>
                      {handoverData.photos.boxPhotos.length} Box Photos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>ID Photo Captured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Digital Signature</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Any additional notes about this handover..."
                  value={handoverData.additionalNotes}
                  onChange={(e) =>
                    setHandoverData((prev) => ({
                      ...prev,
                      additionalNotes: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              {/* Final Confirmation */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please review all information carefully. Once submitted, this
                  handover record cannot be modified.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceedToNext()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext() || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Submitting..." : "Complete Handover"}
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
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
