"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FileText, SquareCheck } from "lucide-react";
// import { LeftSideBar } from "@/components/navigation/left-side-bar";

import { LeftSideBar } from "../navigation/left-side-bar-old";
import RightSideBar from "@/components/navigation/right-side-bar";
import { DocumentSection } from "@/utils/documentParser";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSection, setSelectedSection] =
    useState<DocumentSection | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string>("");
  const [partTitle, setPartTitle] = useState<string>("");
  const [currentPartSections, setCurrentPartSections] = useState<
    DocumentSection[]
  >([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  const HistoryTools = [
    { icon: FileText, label: "Saved Notes", active: false },
    { icon: SquareCheck, label: "Your Checklist", active: false },
  ];

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      const newIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(newIndex);
      setSelectedSection(currentPartSections[newIndex]);
    }
  };

  const handleNextSection = () => {
    if (currentSectionIndex < currentPartSections.length - 1) {
      const newIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(newIndex);
      setSelectedSection(currentPartSections[newIndex]);
    }
  };

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
            setSelectedSection(null);
            setChapterTitle("");
            setPartTitle("");
            setCurrentPartSections([]);
            setCurrentSectionIndex(0);
            // Navigate to docs page with section info when a section is selected
            router.push(`/chat/doc?sectionId=${section.id}&partId=${partId}`);
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
