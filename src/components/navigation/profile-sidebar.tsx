"use client";

import { ChevronLeft, User, SquareCheck, Bell } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ProfileSidebarProps {
  activePage: "account" | "preferences" | "notification";
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activePage }) => {
  const params = useParams();
  const userId = params.userId as string;

  const navigationItems = [
    {
      id: "account",
      label: "Account",
      icon: User,
      href: `/profile/${userId}`,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: SquareCheck,
      href: `/profile/${userId}/preferences`,
    },
    {
      id: "notification",
      label: "Notification",
      icon: Bell,
      href: `/profile/${userId}/notification`,
    },
  ];

  return (
    <div className="w-80 flex-shrink-0 h-full overflow-hidden">
      <div className="h-full flex flex-col p-6">
        {/* Back Button */}
        <Link
          href="/chat"
          className="flex items-center space-x-2 text-foreground/70 hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>

        {/* Navigation Title */}
        <h2 className="text-lg font-semibold text-foreground/70 mb-8">
          Account
        </h2>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-dark border border-lightgrey text-foreground/70"
                    : "text-foreground/70 hover:text-foreground hover:bg-lightgrey"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
