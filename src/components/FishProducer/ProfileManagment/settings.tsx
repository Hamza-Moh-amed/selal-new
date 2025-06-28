"use client";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NotificationSettings {
  emailUpdates: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

interface SettingsPreferencesProps {
  notifications: NotificationSettings;
  onNotificationsUpdate: (notifications: NotificationSettings) => void;
}

export default function SettingsPreferences({
  notifications,
  onNotificationsUpdate,
}: SettingsPreferencesProps) {
  const updateNotification = (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    onNotificationsUpdate({
      ...notifications,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
              <Switch
                checked={notifications.emailUpdates}
                onCheckedChange={(checked) =>
                  updateNotification("emailUpdates", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Get urgent notifications via SMS
                </p>
              </div>
              <Switch
                checked={notifications.smsAlerts}
                onCheckedChange={(checked) =>
                  updateNotification("smsAlerts", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Browser and mobile push notifications
                </p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) =>
                  updateNotification("pushNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Emails</h4>
                <p className="text-sm text-muted-foreground">
                  Promotional offers and product updates
                </p>
              </div>
              <Switch
                checked={notifications.marketingEmails}
                onCheckedChange={(checked) =>
                  updateNotification("marketingEmails", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account settings and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Export Account Data</h4>
              <p className="text-sm text-muted-foreground">
                Download all your account data and history
              </p>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Deactivate Account</h4>
              <p className="text-sm text-muted-foreground">
                Temporarily disable your account
              </p>
            </div>
            <Button variant="outline">Deactivate</Button>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Delete Account:</strong> Permanently delete your account
              and all associated data. This action cannot be undone.
            </AlertDescription>
          </Alert>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to permanently delete your account? This
                  action cannot be undone and will remove all your data.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 justify-end">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
