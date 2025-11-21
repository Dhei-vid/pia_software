"use client";

import { FC, SetStateAction, Dispatch, ChangeEvent, useRef } from "react";
import { Paperclip } from "lucide-react";

interface IFileUploader {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  btnText?: string;
  onFIleupload: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FileUploader: FC<IFileUploader> = ({ setFile, btnText }) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  // Handle File upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (e.target.files && file) {
      const uploaded = e.target.files[0];
      setFile(uploaded);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex items-center gap-2"
    >
      <Paperclip size={15} />
      <p className="text-sm">{btnText}</p>

      <input
        ref={hiddenFileInput}
        type={"file"}
        accept={
          ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};
export default FileUploader;
