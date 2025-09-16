"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Paperclip, Mic } from "lucide-react";

interface ChatInputProps {
  onSubmit?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  showAttachButton?: boolean;
  showVoiceButton?: boolean;
  onAttachFile?: () => void;
  onVoiceRecord?: () => void;
}

interface ChatInputState {
  isRecording: boolean;
  messageCount: number;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  placeholder = "Type a message...",
  disabled = false,
  maxLength = 2000,
  className = "",
  showAttachButton = false,
  showVoiceButton = false,
  onAttachFile,
  onVoiceRecord,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ChatInputState>({
    isRecording: false,
    messageCount: 0,
  });

  const submit = (): void => {
    const message = ref.current?.innerText.trim();
    if (!message || message.length === 0) return;
    
    onSubmit?.(message);
    ref.current!.innerHTML = "";
    ref.current?.focus();
    
    setState(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const handleInput = (): void => {
    const currentLength = ref.current?.innerText.length || 0;
    if (currentLength > maxLength) {
      // Truncate content if it exceeds max length
      const text = ref.current?.innerText.substring(0, maxLength) || "";
      ref.current!.innerHTML = text;
    }
  };

  const handleAttachFile = (): void => {
    onAttachFile?.();
  };

  const handleVoiceRecord = (): void => {
    setState(prev => ({
      ...prev,
      isRecording: !prev.isRecording,
    }));
    onVoiceRecord?.();
  };

  useEffect(() => {
    // Focus the input when component mounts
    ref.current?.focus();
  }, []);

  const currentLength = ref.current?.innerText.length || 0;
  const isNearLimit = currentLength > maxLength * 0.8;

  return (
    <div className={`flex items-end gap-2 p-3 bg-dark border border-gray-700 rounded-xl ${className}`}>
      {/* Action Buttons */}
      {showAttachButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAttachFile}
          disabled={disabled}
          className="w-12 h-12 hover:bg-[#3a3a3a] border border-gray-700 bg-transparent rounded-full p-0"
        >
          <Paperclip className="w-4 h-4 text-gray-400" />
        </Button>
      )}

      {/* Chat Input Area */}
      <div className="flex-1 relative">
        <div
          ref={ref}
          contentEditable={!disabled}
          role="textbox"
          aria-multiline="true"
          data-placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onInput={handleInput}
          className={`
            min-h-[44px] max-h-[220px] px-3 py-2 
            bg-transparent text-white placeholder:text-gray-400 
            border-none outline-none overflow-y-auto
            whitespace-pre-wrap break-words text-sm leading-relaxed
            focus:outline-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
          `}
          suppressContentEditableWarning
          style={{
            resize: 'none',
          }}
        />
        
        {/* Character Count */}
        {maxLength > 0 && (
          <div className={`absolute bottom-1 right-2 text-xs ${
            isNearLimit ? 'text-yellow-400' : 'text-gray-500'
          }`}>
            {currentLength}/{maxLength}
          </div>
        )}
      </div>

      {/* Voice Recording Button */}
      {showVoiceButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleVoiceRecord}
          disabled={disabled}
          className={`w-12 h-12 border rounded-full p-0 transition-colors ${
            state.isRecording 
              ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20' 
              : 'border-gray-700 bg-transparent hover:bg-[#3a3a3a]'
          }`}
        >
          <Mic className={`w-4 h-4 ${
            state.isRecording ? 'text-red-500' : 'text-gray-400'
          }`} />
        </Button>
      )}

      {/* Send Button */}
      <Button
        onClick={submit}
        disabled={disabled || currentLength === 0}
        className="group w-12 h-12 border border-green bg-transparent hover:bg-green text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SendHorizontal
          size={20}
          className="text-green group-hover:text-white"
        />
      </Button>
    </div>
  );
};

export default ChatInput;
