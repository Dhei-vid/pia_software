"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, SendHorizontal, FileText, CheckSquare } from "lucide-react";

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
    <div className="text-white">
      <div className="flex">
        {/* Left Sidebar - Navigation */}
        <LeftSideBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
        />

        {/* Main Content Area */}
        <div className="m-8 rounded-md flex-1 bg-dark p-8">
          <div className="max-w-4xl mx-auto">
            {/* Greeting */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-serif text-white mb-2">
                Hello, Williams
              </h1>
            </div>

            {/* Main Search Input */}
            <div className={"border border-gray-700 rounded-xl bg-dark"}>
              <div className={"pt-3 pb-12"}>
                <Input
                  placeholder="Search for a section, upload a document, or draft a new document."
                  className={
                    "text-lg border-none text-white placeholder:text-gray-400 focus:border-none rounded-xl"
                  }
                />
              </div>
              <div className={"p-3 flex flex-row items-center justify-between"}>
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

        {/* Right Sidebar - Tools */}
        <RightSideBar tools={tools} />
      </div>
    </div>
  );
};

export default ChatPage;
