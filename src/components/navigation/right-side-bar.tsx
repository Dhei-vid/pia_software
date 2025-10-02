import { FC, useState } from "react";
import { LucideIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import SavedNotes from "../sidebar-items/notes";
import CheckList from "../sidebar-items/checklist";
import CreateModal from "../modals/create-modal";
import ModalComponents from "../general/alert-modal";
import { FileText, SquareCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import DraftDocumentModal from "../modals/draft-document-modal";

// APIs
import { useNotes } from "@/hooks/useNotes";
import { useDocuments } from "@/hooks/useDocuments";

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

  // Get the first document for note creation
  const { documents } = useDocuments();
  const selectedDocument = documents.length > 0 ? documents[0] : null;

  // Use notes hook
  const { createNote, loading: noteLoading } = useNotes();

  const handleCopyToClipboard = () => {
    // Simulate copying to clipboard
    navigator.clipboard.writeText("Sample text to copy");
    setIsModalOpen(true);
  };

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
      router.push("/chat/saved-notes");
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
          placeholder="Enter checklist name..."
          className="w-full px-3 py-2 bg-dark border border-lightgrey rounded-md text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none"
        />
      </div>
    </div>
  );

  const handleSaveNote = async () => {
    if (!newNote.trim() || !selectedDocument) {
      console.log("No note content or document selected");
      return;
    }

    try {
      await createNote({
        body: newNote.trim(),
        documentId: selectedDocument.id,
      });

      // Clear the note input
      setNewNote("");
      console.log("Note saved successfully!");
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleCreateChecklist = () => {
    // Handle create checklist logic
    console.log("Creating checklist...");
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
          <CreateModal
            trigger={
              <ModalComponents.ModalTrigger label="Add Note" Icon={FileText} />
            }
            content={addNotesContent}
            onAction={handleSaveNote}
            modalStyle={"p-2"}
          />

          {/* Create New Checklist Modal */}
          <CreateModal
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
