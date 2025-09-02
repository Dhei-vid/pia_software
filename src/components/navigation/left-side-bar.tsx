import Image from "next/image";
import { Input } from "../ui/input";
import { Search, RotateCw, User, ChevronRight, Sun } from "lucide-react";
import { SetStateAction, Dispatch, FC } from "react";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch";

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

  return (
    <div className="flex flex-col w-80 p-6">
      <div className={"space-y-8"}>
        {/* Logo */}
        <div>
          <Image src={"/logo.png"} alt={"Logo"} width={60} height={60} />
        </div>

        {/* Search Bar */}
        <div className="space-y-3 mb-6">
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
          <div className="mb-8">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#3a3a3a]"
            >
              <RotateCw className="w-4 h-4 mr-3" />
              History
            </Button>
          </div>
        </div>
      </div>

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
              <div className={"w-[15rem]"}>
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
        <Button
          variant="ghost"
          onClick={() => setIsLightMode(!isLightMode)}
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#3a3a3a]"
        >
          <Sun className="w-4 h-4 mr-3" />
          Light mode
        </Button>
        <Switch id={"lightmode"} />
      </div>

      {/* User Profile */}
      <div className="p-5 rounded-lg mt-auto pt-6 border-t border-[#3a3a3a] border border-gray-700">
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
  );
};
