"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import ProfileSidebar from "@/components/navigation/profile-sidebar";
import { useUser } from "@/contexts/UserContext";

interface ProfileLayoutProps {
  children: ReactNode;
}

const UserProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useUser();

  // Determine active page based on pathname
  const getActivePage = (): "account" | "preferences" | "notification" => {
    if (pathname.includes("/preferences")) return "preferences";
    if (pathname.includes("/notification")) return "notification";
    return "account";
  };

  if (!user) {
    return (
      <div className="h-full p-8 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full p-2 2xl:p-5 bg-black">
      <div className="relative h-full bg-grey flex overflow-hidden rounded-lg">
        {/* Profile Sidebar */}
        <div className="border-r border-lightgrey">
          <ProfileSidebar activePage={getActivePage()} />
        </div>

        {/* Body */}
        <div className="flex-1 h-full flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pb-20">{children}</div>
        </div>

        {/* Help Button */}
        <div className="absolute bottom-5 right-5">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] p-0"
          >
            <HelpCircle className="w-6 h-6 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileLayout;
