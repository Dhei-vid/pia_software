"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FileText, SquareCheck } from "lucide-react";
// import { LeftSideBar } from "@/components/navigation/left-side-bar";

import { LeftSideBar } from "../navigation/left-side-bar-old";
import RightSideBar from "@/components/navigation/right-side-bar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

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
          onSectionSelect={(
            section,
            chapterTitle,
            partTitle,
            sections,
            partId
          ) => {
            // Navigate to docs page with section info when a section is selected
            router.push(`/chat/doc?sectionId=${section.id}&partId=${partId}&chapterTitle=${encodeURIComponent(chapterTitle)}&partTitle=${encodeURIComponent(partTitle)}&sectionTitle=${encodeURIComponent(section.title)}`);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 h-full overflow-y-auto scrollbar-width">
        <div className="min-h-full rounded-xl bg-dark p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">{children}</div>
        </div>
      </div>

      {/* Right Sidebar - Tools */}
      <div className="w-70 flex-shrink-0 h-full overflow-hidden">
        <RightSideBar tools={HistoryTools} />
      </div>
    </div>
  );
};

export default MainLayout;
