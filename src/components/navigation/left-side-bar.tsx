import Image from "next/image";
import { Input } from "../ui/input";
import {
  Search,
  RotateCw,
  ChevronRight,
  ChevronDown,
  Sun,
  Clock,
} from "lucide-react";
import { SetStateAction, Dispatch, FC, useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import UserProfile from "./user-profile";

interface ILeftSideBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  isLightMode: boolean;
  setIsLightMode: Dispatch<SetStateAction<boolean>>;
}

interface ChapterPart {
  id: string;
  title: string;
  isSelected?: boolean;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  parts: ChapterPart[];
}

export const LeftSideBar: FC<ILeftSideBarProps> = ({
  searchQuery,
  setSearchQuery,
  isLightMode,
  setIsLightMode,
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(["2"])
  ); // Chapter 2 is expanded by default
  const [selectedPart, setSelectedPart] = useState<string>("2-2"); // Part II is selected by default

  const chapters: Chapter[] = [
    {
      id: "1",
      title: "Chapter 1 Governance & Institution",
      description: "description lorem possum possum possum",
      isExpanded: false,
      parts: [
        { id: "1-1", title: "Part I - General Provisions" },
        { id: "1-2", title: "Part II - Petroleum Industry Commission" },
        { id: "1-3", title: "Part III - Host Communities Development Trust" },
      ],
    },
    {
      id: "2",
      title: "Chapter 2 Administration",
      description: "description lorem possum possum possum",
      isExpanded: true,
      parts: [
        { id: "2-1", title: "Part I - General Administration" },
        {
          id: "2-2",
          title:
            "Part II - Administration of Upstream Petroleum Operations and Environment",
          isSelected: true,
        },
        {
          id: "2-3",
          title: "Part III - General Administration of Midstream Operations",
        },
        {
          id: "2-4",
          title: "Part IV - Administration of Downstream Operations",
        },
        { id: "2-5", title: "Part V - Administration of Gas Flaring" },
        {
          id: "2-6",
          title: "Part VI - Other Matters Relating to Administration",
        },
        { id: "2-7", title: "Part VII - Common Provisions" },
      ],
    },
    {
      id: "3",
      title: "Chapter 3 Host Communities Development",
      description: "description lorem possum possum possum",
      isExpanded: false,
      parts: [
        { id: "3-1", title: "Part I - Host Communities Development Trust" },
        {
          id: "3-2",
          title: "Part II - Host Communities Development Trust Fund",
        },
      ],
    },
    {
      id: "4",
      title: "Chapter 4 Petroleum Industrial Fiscal Framework",
      description: "description lorem possum possum possum",
      isExpanded: false,
      parts: [
        { id: "4-1", title: "Part I - General Provisions" },
        { id: "4-2", title: "Part II - Royalties" },
        { id: "4-3", title: "Part III - Petroleum Profits Tax" },
      ],
    },
    {
      id: "5",
      title: "Chapter 5 Miscellaneous Provisions",
      description: "description lorem possum possum possum",
      isExpanded: false,
      parts: [
        { id: "5-1", title: "Part I - General Provisions" },
        { id: "5-2", title: "Part II - Transitional Provisions" },
      ],
    },
  ];

  // Sample history data
  const historyData = [
    {
      id: "1",
      query: "What are the rules about obtain...",
      timestamp: "2 hours ago",
      type: "query",
    },
    {
      id: "2",
      query: "Penalties for gas flaring",
      timestamp: "1 day ago",
      type: "query",
    },
    {
      id: "3",
      query: "S.104",
      timestamp: "3 days ago",
      type: "section",
    },
  ];

  const filteredHistory = historyData.filter((item) =>
    item.query.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  const handleChapterClick = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const handlePartClick = (partId: string) => {
    setSelectedPart(partId);
    // Here you would typically navigate to the specific part or update the main content
    console.log(`Selected part: ${partId}`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 space-y-4">
        {/* Logo */}
        <div>
          <Image src={"/logo.png"} alt={"Logo"} width={40} height={40} />
        </div>

        {/* Search Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="New Query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark border-lightgrey text-white placeholder:text-gray-400 focus:border-yellow-400"
            />
          </div>

          {/* History */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setIsHistoryOpen(true)}
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#3a3a3a]"
            >
              <RotateCw className="w-4 h-4 mr-3" />
              History
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto scrollbar-width">
        {/* PIA 2021 Document */}
        <div className="mb-8 pt-6 border-t border-lightgrey">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            PIA 2021 Document
          </h3>
          <div className="space-y-2 w-full">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="space-y-1">
                {/* Chapter Header */}
                <button
                  onClick={() => handleChapterClick(chapter.id)}
                  className="flex flex-row items-center w-full justify-between text-gray-300 hover:text-white hover:bg-lightgrey text-left rounded-md cursor-pointer p-2 group"
                >
                  <div className="flex flex-col w-[13rem]">
                    <span className="text-sm truncate">{chapter.title}</span>
                    <span className="text-xs font-light truncate">
                      {chapter.description}
                    </span>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {expandedChapters.has(chapter.id) ? (
                      <ChevronDown
                        size={16}
                        className="text-gray-400 group-hover:text-white"
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-white"
                      />
                    )}
                  </div>
                </button>

                {/* Chapter Parts - Only show when expanded */}
                {expandedChapters.has(chapter.id) && (
                  <div className="ml-6 space-y-1">
                    {chapter.parts.map((part) => (
                      <button
                        key={part.id}
                        onClick={() => handlePartClick(part.id)}
                        className={`flex flex-row items-center w-full justify-between text-left rounded-md cursor-pointer p-2 transition-colors ${
                          selectedPart === part.id
                            ? "bg-[#3a3a3a] text-white"
                            : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate">{part.title}</p>
                        </div>
                        {selectedPart === part.id && (
                          <div className="w-2 h-2 bg-green rounded-full flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Light Mode Toggle */}
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex flex-row items-center justify-start text-gray-300 hover:text-white hover:bg-[#3a3a3a]">
            <Sun className="w-4 h-4 mr-3" />
            <p>Light mode</p>
          </div>
          <Switch
            id={"lightmode"}
            checked={isLightMode}
            onCheckedChange={setIsLightMode}
          />
        </div>
      </div>

      {/* Fixed Footer Section */}
      <div className="w-full flex-shrink-0 p-6 border-t border-lightgrey">
        {/* User Profile */}
        <UserProfile />
      </div>

      {/* History Drawer */}
      <GenericDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="History"
        position="left"
      >
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-md text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* History List */}
          <div className="space-y-2">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-3 rounded-md hover:bg-[#3a3a3a] cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {item.type === "query" ? (
                        <Search className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {item.query}
                      </p>
                      <p className="text-xs text-gray-400">{item.timestamp}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  {historySearchQuery
                    ? "No matching history found"
                    : "No history yet"}
                </p>
              </div>
            )}
          </div>

          {/* Clear History Button */}
          {filteredHistory.length > 0 && (
            <div className="pt-4 border-t border-lightgrey">
              <button className="w-full py-2 px-4 text-sm text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded-md transition-colors">
                Clear All History
              </button>
            </div>
          )}
        </div>
      </GenericDrawer>
    </div>
  );
};
