"use client";

import { useState, ReactNode } from "react";
import { FileText, SquareCheck } from "lucide-react";
import { LeftSideBar } from "@/components/navigation/left-side-bar";
import RightSideBar from "@/components/navigation/right-side-bar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const HistoryTools = [
    { icon: FileText, label: "Saved Notes", active: false },
    { icon: SquareCheck, label: "Your Checklist", active: false },
  ];

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <div className="w-80 flex-shrink-0 h-full overflow-hidden">
        <LeftSideBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 h-full overflow-y-auto scrollbar-width">
        <div className="min-h-full rounded-xl bg-dark p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">{children}</div>
        </div>
      </div>

      {/* Right Sidebar - Tools */}
      <div className="w-65 flex-shrink-0 h-full overflow-hidden">
        <RightSideBar tools={HistoryTools} />
      </div>
    </div>
  );
};

export default MainLayout;
