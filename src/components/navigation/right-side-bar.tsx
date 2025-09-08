import { FC, useState } from "react";
import { LucideIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import SavedNotes from "../sidebar-items/notes";
import CheckList from "../sidebar-items/checklist";

interface RightSideBarProps {
  tools: {
    label: string;
    icon: LucideIcon;
    active: boolean;
  }[];
}

const RightSideBar: FC<RightSideBarProps> = ({ tools }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"saved-notes" | "checklist">(
    "saved-notes"
  );

  const handleToolClick = (toolLabel: string) => {
    if (toolLabel === "Saved Notes" || toolLabel === "Your Checklist") {
      setDrawerType(toolLabel === "Saved Notes" ? "saved-notes" : "checklist");
      setIsDrawerOpen(true);
    }
  };

  // Sample data for tools drawer

  const isNotes = drawerType === "saved-notes";
  const title = isNotes ? "Saved Notes" : "Your Checklist";

  return (
    <div className="h-full flex flex-col relative">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6">
        <h3 className="text-lg font-semibold text-white">Tools</h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => handleToolClick(tool.label)}
              className={`w-full justify-start text-gray-300 hover:text-white hover:bg-lightgrey ${
                tool.active ? "bg-lightgrey text-white" : ""
              }`}
            >
              <tool.icon size={20} className="mr-3" />
              <span className="text-sm">{tool.label}</span>
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

      {/* Tools Drawer */}
      <GenericDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={title}
        position="right"
      >
        <div className="space-y-6">
          {/* Items List */}
          {isNotes ? <SavedNotes /> : <CheckList />}
        </div>
      </GenericDrawer>
    </div>
  );
};

export default RightSideBar;
