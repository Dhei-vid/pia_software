import { FC } from "react";
import { X, File } from "lucide-react";

interface ISelectedFile {
  fileName: string;
  fileType: string;
  onDelete: () => void;
}

export const SelectedFIleUI: FC<ISelectedFile> = ({
  fileName,
  fileType,
  onDelete,
}) => {
  const allowedMimeTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const isValidFile = () => {
    const hasValidMime = allowedMimeTypes.includes(fileType);

    return hasValidMime;
  };

  return (
    <div className="relative w-[50%]">
      <div className="border p-3 rounded-md flex flex-row gap-3 items-center bg-lightgrey">
        <div className="bg-green p-3 rounded-md">
          <File className="text-white" size={18} />
        </div>
        <div className="space-y-1">
          <p className="text-xs line-clamp-1">{fileName}</p>
          <p className="text-[10px]">{isValidFile() && "Document"}</p>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="cursor-pointer absolute top-2 right-2 border w-5 h-5 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-500/70 transiton-all ease-in-out duration-200"
      >
        <X className="text-white" size={15} />
      </button>
    </div>
  );
};
