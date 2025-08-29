"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Send, FileText, CheckSquare } from "lucide-react";

import { LeftSideBar } from "@/components/navigation/left-side-bar";
import RightSideBar from "@/components/navigation/right-side-bar";

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLightMode, setIsLightMode] = useState(false);

  const tools = [
    { icon: FileText, label: "Add Notes", active: false },
    { icon: CheckSquare, label: "Create New Checklist", active: false },
    { icon: FileText, label: "Saved Notes", active: false },
    { icon: CheckSquare, label: "Your Checklist", active: true },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="flex h-[calc(100vh-48px)]">
        {/* Left Sidebar - Navigation */}
        <LeftSideBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
        />

        {/* Main Content Area */}
        <div className="m-12 rounded-md flex-1 bg-dark p-8">
          <div className="max-w-4xl mx-auto">
            {/* Greeting */}
            <div className="mb-8">
              <h1 className="text-4xl font-serif text-white mb-2">
                Hello, Williams
              </h1>
            </div>

            {/* Main Search Input */}
            <div className="relative">
              <Input
                placeholder="Search for a section, upload a document, or draft a new document."
                className="h-16 text-lg bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-gray-400 focus:border-yellow-400 rounded-xl"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-[#3a3a3a]"
                >
                  <Plus className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tools */}
        <RightSideBar tools={tools} />
      </div>
    </div>
  );
};

export default ChatPage;
