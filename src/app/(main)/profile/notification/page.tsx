"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const NotificationPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleEmailToggle = () => {
    setEmailNotifications(!emailNotifications);
  };

  return (
    <div className="mx-auto p-8">
      {/* Header */}

      <div className="border-b border-lightgrey mb-8">
        <h1 className="text-3xl font-serif text-white mb-8">Notifications</h1>
      </div>

      {/* Email Notifications Setting */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Email Notifications
            </h3>
            <p className="text-gray-400">
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

export default NotificationPage;
