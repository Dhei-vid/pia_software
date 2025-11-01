"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import LoadingSpinner from "@/components/ui/loading";
import { useUser } from "@/contexts/UserContext";

const UserNotificationPage = () => {
  const params = useParams();
  const { user } = useUser();
  const userId = params.userId as string;

  // Check if the current user is viewing their own notifications
  const isOwnNotifications = user?.id === userId;

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleEmailToggle = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handlePushToggle = () => {
    setPushNotifications(!pushNotifications);
  };

  const handleWeeklyDigestToggle = () => {
    setWeeklyDigest(!weeklyDigest);
  };

  if (!user) {
    return (
      <div className="h-full p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <p className="text-gray-400">Loading user notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8">
      {/* Header */}
      <div className="border-b border-foreground/30 mb-8">
        <h1 className="text-3xl font-serif text-foreground/70 mb-8">
          Notifications
        </h1>
      </div>

      {/* Email Notifications Setting */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground/70 mb-2">
              Email Notifications
            </h3>
            <p className="text-muted-foreground">
              Receive notifications, newsletters and updates.
            </p>
          </div>
          <div className="ml-6">
            <Switch id={"email-notifications"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotificationPage;
