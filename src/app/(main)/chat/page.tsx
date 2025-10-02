"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import SearchResultCard from "@/components/ui/search-result-card";
import { Plus, SendHorizontal } from "lucide-react";

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    <>
      {/* Greeting */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-white mb-2">
          Hello, Williams
        </h1>
      </div>

      {/* Search Results Section */}
      {/* {searchQuery && (
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
      )} */}

      <div className="border border-gray-700 rounded-xl bg-dark">
        {/* Main Search Input */}
        <div className="pt-3 pb-6">
          <Textarea
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            rows={8}
            placeholder="Search for a section, upload a document, or draft a new document."
            className="!bg-dark text-lg border-none text-white placeholder:text-gray-400 focus:border-none resize-none !overflow-y-auto"
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
    </>
  );
};

export default ChatPage;
