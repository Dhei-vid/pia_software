import { FC } from "react";
import { formatTimeAgo } from "@/common/helpers";
import { useRouter } from "next/navigation";

const savedNotesData = [
  {
    id: "1",
    title: "Important definition - Commission refers to th....",
    content:
      "Commission refers to the Petroleum Industry Commission established under this Act...",
    timestamp: "2025-08-01",
    link: "",
  },
  {
    id: "2",
    title: "Need to cross-reference with petroleum operatio...",
    content:
      "Cross-reference with petroleum operations and environmental regulations...",
    timestamp: "2025-07-01",
    link: "",
  },
  {
    id: "3",
    title: "Need to cross-reference with petroleum operati...",
    content: "Additional cross-reference notes for petroleum operations...",
    timestamp: new Date(),
    link: "",
  },
];

const SavedNotes = () => {
  return (
    <div className="space-y-4 w-[100%]">
      {savedNotesData.map((item, index) => (
        <NotesSideBarItems key={index} {...item} />
      ))}
    </div>
  );
};

export default SavedNotes;

interface INotesSideBarItems {
  title: string;
  content: string;
  link: string;
  timestamp: Date | string;
}

const NotesSideBarItems: FC<INotesSideBarItems> = ({
  content,
  timestamp,
  // title,
  link,
}) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(link)}
      className="p-3 text-left flex flex-row gap-5 justify-between hover:bg-lightgrey cursor-pointer transition-all duration-200 ease-in-out rounded-md"
    >
      <div>
        <p className="text-sm text-white truncate text-wrap line-clamp-2">
          {content}
        </p>
        {/* <p className="text-sm text-gray-400 truncate">{content}</p> */}
      </div>
      <p className="text-xs text-nowrap text-gray-400">
        {formatTimeAgo(new Date(timestamp))}
      </p>
    </button>
  );
};
