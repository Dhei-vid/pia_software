"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import ProfileSidebar from "@/components/navigation/profile-sidebar";

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Determine active page based on pathname
  const getActivePage = (): "account" | "preferences" | "notification" => {
    if (pathname.includes("/preferences")) return "preferences";
    if (pathname.includes("/notification")) return "notification";
    return "account";
  };

  return (
    <main className="h-screen p-5 bg-black">
      <div className="flex-1 bg-grey flex overflow-hidden rounded-lg">
        {/* Profile Sidebar */}
        <div className="border-r border-lightgrey">
          <ProfileSidebar activePage={getActivePage()} />
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-y-auto">
          {children}

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
    </main>
  );
};

export default ProfileLayout;
