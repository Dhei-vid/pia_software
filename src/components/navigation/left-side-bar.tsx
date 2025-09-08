import Image from "next/image";
import { Input } from "../ui/input";
import { Search, RotateCw, User, ChevronRight, Sun, Clock } from "lucide-react";
import { SetStateAction, Dispatch, FC, useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch";
import { GenericDrawer } from "@/components/ui/generic-drawer";

interface ILeftSideBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  isLightMode: boolean;
  setIsLightMode: Dispatch<SetStateAction<boolean>>;
}

export const LeftSideBar: FC<ILeftSideBarProps> = ({
  searchQuery,
  setSearchQuery,
  isLightMode,
  setIsLightMode,
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");

  const chapters = [
    {
      title: "Chapter 1 Governance & Institution",
      description: "description lorem possum possum possum",
    },
    {
      title: "Chapter 2 Administration",
      description: "description lorem possum possum possum",
    },
    {
      title: "Chapter 3 Host Communities Development",
      description: "description lorem possum possum possum",
    },
    {
      title: "Chapter 4 Petroleum Industrial Fiscal Framework",
      description: "description lorem possum possum possum",
    },
    {
      title: "Chapter 5 Miscellaneous Provisions",
      description: "description lorem possum possum possum",
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 space-y-6">
        {/* Logo */}
        <div>
          <Image src={"/logo.png"} alt={"Logo"} width={60} height={60} />
        </div>

        {/* Search Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="New Query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#3a3a3a] border-[#4a4a4a] text-white placeholder:text-gray-400 focus:border-yellow-400"
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

      {/* Content Section - No scrolling */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        {/* PIA 2021 Document */}
        <div className="mb-8 pt-6 border-t border-[#3a3a3a]">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            PIA 2021 Document
          </h3>
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                className="flex flex-row items-center w-full justify-between text-gray-300 hover:text-white hover:bg-[#3a3a3a] text-left rounded-md cursor-pointer p-2"
              >
                <div className="w-[15rem]">
                  <p className="text-sm truncate">{chapter.title}</p>
                  <span className="text-light text-xs truncate">
                    {chapter.description}
                  </span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
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
      <div className="flex-shrink-0 p-6 border-t border-[#3a3a3a]">
        {/* User Profile */}
        <div className="p-5 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Williams Chang</p>
              <p className="text-xs text-gray-400">Account</p>
            </div>
          </div>
        </div>
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
