"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResultCard from "@/components/ui/search-result-card";

import { Plus, SendHorizontal, FileText, SquareCheck } from "lucide-react";

import { LeftSideBar } from "@/components/navigation/left-side-bar";
import RightSideBar from "@/components/navigation/right-side-bar";

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const HistoryTools = [
    { icon: FileText, label: "Saved Notes", active: false },
    { icon: SquareCheck, label: "Your Checklist", active: false },
  ];

  // Sample search results data
  const searchResults = [
    {
      title: "Petroleum Engineering Fundamentals",
      description:
        "Comprehensive guide covering drilling operations, reservoir engineering, and production optimization techniques used in modern petroleum engineering.",
      onViewFullSection: () =>
        console.log("Viewing Petroleum Engineering section"),
    },
    {
      title: "Environmental Impact Assessment",
      description:
        "Detailed analysis of environmental considerations in energy projects, including regulatory compliance and sustainability practices.",
      onViewFullSection: () =>
        console.log("Viewing Environmental Impact section"),
    },
    {
      title: "Renewable Energy Integration",
      description:
        "Best practices for integrating renewable energy sources into existing energy infrastructure and grid management systems.",
      onViewFullSection: () => console.log("Viewing Renewable Energy section"),
    },
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
          <div className="max-w-4xl mx-auto">
            {/* Greeting */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-white mb-2">
                Hello, Williams
              </h1>
            </div>

            {/* Search Results Section */}
            {searchQuery && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Search Results for &lsquo;{searchQuery}&lsquo;
                </h2>
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <SearchResultCard
                      key={index}
                      title={result.title}
                      description={result.description}
                      onViewFullSection={result.onViewFullSection}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="border border-gray-700 rounded-xl bg-dark">
              {/* Main Search Input */}
              <div className="pt-3 pb-12">
                <Input
                  placeholder="Search for a section, upload a document, or draft a new document."
                  className="text-lg border-none text-white placeholder:text-gray-400 focus:border-none rounded-xl"
                />
              </div>
              <div className="p-3 flex flex-row items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-12 h-12 hover:bg-[#3a3a3a] border border-gray-700 bg-transparent rounded-full"
                >
                  <Plus size={30} className="text-gray-400" />
                </Button>

                <Button className="group w-12 h-12 border border-green bg-transparent hover:bg-green text-white p-2 rounded-lg">
                  <SendHorizontal
                    size={30}
                    className="text-green group-hover:text-white"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Tools */}
      <div className="w-80 flex-shrink-0 h-full overflow-hidden">
        <RightSideBar tools={HistoryTools} />
      </div>
    </div>
  );
};

export default ChatPage;
