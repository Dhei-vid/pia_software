import { FC, useState } from "react";
import { LucideIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import SavedNotes from "../sidebar-items/notes";
import CheckList from "../sidebar-items/checklist";
import ModalX from "../modals/modalx";
import ModalComponents from "../general/alert-modal";
import { FileText, SquareCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import DraftDocumentModal from "../modals/draft-document-modal";
import { toast } from "sonner";

// APIs
import { useNotes } from "@/hooks/useNotes";
import { useUser } from "@/contexts/UserContext";
import { useChecklists } from "@/hooks/useChecklists";

interface RightSideBarProps {
  tools: {
    label: string;
    icon: LucideIcon;
    active: boolean;
  }[];
}

const RightSideBar: FC<RightSideBarProps> = ({ tools }) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerType, setDrawerType] = useState<"saved-notes" | "checklist">(
    "saved-notes"
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>("");
  const [newChecklistName, setNewChecklistName] = useState<string>("");
  const [modalKey, setModalKey] = useState<number>(0);

  // Use user context
  const { user } = useUser();

  // Use notes hook
  const { createNote } = useNotes();

  // Use checklists hook
  const { createChecklist } = useChecklists();

  // const handleCopyToClipboard = () => {
  //   // Simulate copying to clipboard
  //   navigator.clipboard.writeText("Sample text to copy");
  //   setIsModalOpen(true);
  // };

  const handleDraftDocument = () => {
    console.log("Drafting document...");
    // Add your draft document logic here
  };

  const handleCancel = () => {
    console.log("Cancelled");
    // Add your cancel logic here
  };

  const handleToolClick = (toolLabel: string) => {
    if (toolLabel === "Saved Notes") {
      // Navigate to the full saved notes page
      setDrawerType("saved-notes");
      setIsDrawerOpen(true);
    } else if (toolLabel === "Your Checklist") {
      setDrawerType("checklist");
      setIsDrawerOpen(true);
    }
  };

  const isNotes = drawerType === "saved-notes";
  const title = isNotes ? "Saved Notes" : "Your Checklist";

  // Add Notes Modal Content
  const addNotesContent = (
    <div className="space-y-6">
      {/* Chapter Information Header */}
      {/* <div className="bg-dark border-1 border-lightgrey pb-4 rounded-md p-2">
        <h3 className="text-lg font-semibold text-white mb-2">
          Chapter 2, Part II, Section 81: Petroleum Mining Leases
        </h3>
        <div>
          <p className="text-sm text-gray-300 leading-relaxed">
            &quot;A petroleum mining lease shall be granted under sections 70
            (2) and 74 of this Act, where a prospective lease area contains
            petroleum field with suspended wells or continuing commercial
            production, where the corresponding petroleum mining lease has been
            revoked or has expired.&quot;
          </p>
        </div>
      </div> */}

      {/* Note Input Section */}
      <div>
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type your note here"
          className="min-h-32 !bg-transparent text-white placeholder:text-gray-400 resize-none border-none !overflow-y-auto"
        />
      </div>
    </div>
  );

  // Create New Checklist Modal Content
  const createChecklistContent = (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Create New Checklist
        </h3>
        <p className="text-gray-400 text-sm">
          Create a new checklist for your current section
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          Checklist Name
        </label>
        <input
          type="text"
          value={newChecklistName}
          onChange={(e) => setNewChecklistName(e.target.value)}
          placeholder="Enter checklist name..."
          className="w-full px-3 py-2 bg-dark border border-lightgrey rounded-md text-white placeholder:text-gray-400 focus:border-lightgrey focus:outline-none"
        />
      </div>
    </div>
  );

  const handleSaveNote = async () => {
    if (!newNote.trim() || !user) {
      console.log("No note content or document selected");
      return;
    }

    try {
      await createNote({
        body: newNote.trim(),
        documentId: user?.documentId,
      });

      // Clear the note input and force modal re-render
      setNewNote("");
      setModalKey((prev) => prev + 1);
      toast.success("Note saved successfully!");
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note. Please try again.");
    }
  };

  const handleCreateChecklist = async () => {
    if (!newChecklistName.trim() || !user) {
      console.log("No checklist name or document selected");
      return;
    }

    console.log(newChecklistName.trim());

    try {
      await createChecklist({
        name: newChecklistName.trim(),
        documentId: user?.documentId,
      });

      // Clear the checklist name input and force modal re-render
      setNewChecklistName("");
      setModalKey((prev) => prev + 1);
      toast.success("Checklist created successfully!");
      console.log("Checklist created successfully!");
    } catch (error) {
      console.error("Failed to create checklist:", error);
      toast.error("Failed to create checklist. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6">
        <h3 className="text-lg font-semibold text-white">Tools</h3>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-5 flex-1 overflow-y-auto px-6 pb-20">
        <div className="w-full space-y-3">
          {/* Add Notes Modal */}
          <div key={`note-modal-${modalKey}`}>
            <ModalX
              trigger={
                <ModalComponents.ModalTrigger
                  label="Add Note"
                  Icon={FileText}
                />
              }
              content={addNotesContent}
              onAction={handleSaveNote}
              modalStyle={"p-2"}
            />
          </div>

          {/* Create New Checklist Modal */}
          <div key={`checklist-modal-${modalKey}`}>
            <ModalX
              trigger={
                <ModalComponents.ModalTrigger
                  label="Create New Checklist"
                  Icon={SquareCheck}
                />
              }
              content={createChecklistContent}
              onAction={handleCreateChecklist}
            />
          </div>
        </div>

        <div className={"border-t border-lightgrey"} />

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

      <DraftDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDraftDocument={handleDraftDocument}
        onCancel={handleCancel}
      />

      {/* Tools Drawer */}
      <GenericDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          if (drawerType === "saved-notes") {
            router.push("/chat/saved-notes");
          } else if (drawerType === "checklist") {
            router.push("/chat/checklist");
          }
          setIsDrawerOpen(false);
        }}
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
