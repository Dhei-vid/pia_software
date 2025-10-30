"use client";

import { useState, ReactNode } from "react";
import { FileText, SquareCheck } from "lucide-react";
import { LeftSideBar } from "@/components/navigation/left-side-bar";
import RightSideBar from "@/components/navigation/right-side-bar";
import DocumentViewer from "@/components/general/document-viewer";
import { DocumentSection } from "@/utils/documentParser";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
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
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
          onSectionSelect={(section, chapterTitle, partTitle, sections) => {
            setSelectedSection(section);
            setChapterTitle(chapterTitle);
            setPartTitle(partTitle);
            setCurrentPartSections(sections);
            setCurrentSectionIndex(
              sections.findIndex((s) => s.id === section.id)
            );
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 h-full overflow-y-auto scrollbar-width">
        <div className="min-h-full rounded-xl bg-dark p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {selectedSection ? (
              <DocumentViewer
                selectedSection={selectedSection}
                chapterTitle={chapterTitle}
                partTitle={partTitle}
                previousSectionTitle={
                  currentSectionIndex > 0
                    ? currentPartSections[currentSectionIndex - 1].title
                    : ""
                }
                nextSectionTitle={
                  currentSectionIndex < currentPartSections.length - 1
                    ? currentPartSections[currentSectionIndex + 1].title
                    : ""
                }
                previousSectionNumber={
                  currentSectionIndex > 0
                    ? parseInt(
                        currentPartSections[currentSectionIndex - 1].id.replace(
                          "section-",
                          ""
                        )
                      )
                    : 0
                }
                nextSectionNumber={
                  currentSectionIndex < currentPartSections.length - 1
                    ? parseInt(
                        currentPartSections[currentSectionIndex + 1].id.replace(
                          "section-",
                          ""
                        )
                      )
                    : 0
                }
                currentSectionIndex={currentSectionIndex}
                totalSections={currentPartSections.length}
                onPreviousSection={handlePreviousSection}
                onNextSection={handleNextSection}
                onSearch={(query) => {
                  // console.log("Search query:", query);
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            ) : (
              children
            )}
          </div>
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
