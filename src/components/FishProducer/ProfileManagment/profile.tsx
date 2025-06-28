"use client";

import { useState } from "react";
import { Shield, Camera, Edit, Check, X } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface ProfileAccountProps {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function ProfileAccount({
  profile,
  onProfileUpdate,
}: ProfileAccountProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSaveProfile = () => {
    onProfileUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and contact details
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveProfile}>
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile.profileImage || "/placeholder.svg"}
                alt={`${profile.firstName} ${profile.lastName}`}
              />
              <AvatarFallback className="text-lg">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </p>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>First Name</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.firstName}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      firstName: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">
                  {profile.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.lastName}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      lastName: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">
                  {profile.lastName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      email: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">
                  {profile.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      phone: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">
                  {profile.phone}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              {isEditing ? (
                <Textarea
                  value={editedProfile.address}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      address: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">
                  {profile.address}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.city}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      city: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{profile.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.country}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      country: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">
                  {profile.country}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <strong>Last Login:</strong>{" "}
              {new Date(profile.lastLogin).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
