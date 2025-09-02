import { FC } from "react";
import { LucideIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RightSideBarProps {
  tools: {
    label: string;
    icon: LucideIcon;
    active: boolean;
  }[];
}

const RightSideBar: FC<RightSideBarProps> = ({ tools }) => {
  return (
    <div className="h-full flex flex-col relative">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Tools</h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start text-gray-300 hover:text-white hover:bg-[#3a3a3a] ${
                tool.active ? "bg-[#3a3a3a] text-white" : ""
              }`}
            >
              <tool.icon className="w-4 h-4 mr-3" />
              <span className="text-sm">{tool.label}</span>
              {tool.active && (
                <div className="ml-auto w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Fixed Help Button */}
      <div className="absolute bottom-6 right-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] p-0"
        >
          <HelpCircle size={20} className="text-gray-400" />
        </Button>
      </div>
    </div>
  );
};

export default RightSideBar;
