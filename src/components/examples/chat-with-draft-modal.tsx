"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChatInput from "@/components/general/chat-input";
import DraftDocumentModal from "@/components/modals/draft-document-modal";
import { Copy } from "lucide-react";

const ChatWithDraftModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const handleMessageSubmit = (message: string) => {
    console.log("Message sent:", message);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setIsModalOpen(true);
  };

  const handleDraftDocument = () => {
    console.log("Drafting document with text:", copiedText);
    // Add your document drafting logic here
    // This could navigate to a document editor or open a new modal
  };

  const handleCancel = () => {
    console.log("User cancelled document drafting");
  };

  return (
    <div className="bg-dark min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-2xl mb-6">Chat with Draft Document Modal</h1>
        
        {/* Example chat messages with copy functionality */}
        <div className="bg-grey rounded-lg p-4 mb-6 space-y-4">
          <div className="text-white">
            <p className="mb-2">Example chat messages:</p>
            
            {/* Sample message 1 */}
            <div className="bg-lightgrey rounded-lg p-3 flex justify-between items-start">
              <div className="flex-1">
                <p className="text-white text-sm">
                  "According to Section 3 of the Petroleum Industry Act 2021, the Nigerian National Petroleum Company Limited shall be established as a limited liability company..."
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopyText("According to Section 3 of the Petroleum Industry Act 2021, the Nigerian National Petroleum Company Limited shall be established as a limited liability company...")}
                className="ml-2 text-white hover:bg-green-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {/* Sample message 2 */}
            <div className="bg-lightgrey rounded-lg p-3 flex justify-between items-start">
              <div className="flex-1">
                <p className="text-white text-sm">
                  "The upstream petroleum operations shall be regulated by the Nigerian Upstream Petroleum Regulatory Commission as established under this Act."
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopyText("The upstream petroleum operations shall be regulated by the Nigerian Upstream Petroleum Regulatory Commission as established under this Act.")}
                className="ml-2 text-white hover:bg-green-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-grey rounded-lg p-4">
          <ChatInput
            onSubmit={handleMessageSubmit}
            placeholder="Ask about the Petroleum Industry Act..."
            showAttachButton={true}
            showVoiceButton={true}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 text-white/70 text-sm">
          <p>💡 Click the copy button on any message above to see the Draft Document Modal in action!</p>
        </div>
      </div>

      {/* Draft Document Modal */}
      <DraftDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDraftDocument={handleDraftDocument}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ChatWithDraftModal;
