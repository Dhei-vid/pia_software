import { FC } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface IChapterNavigation {
  sectionNumber: number;
  rightTitle: string;
  leftTitle: string;
}

const ChapterNavigation: FC<IChapterNavigation> = ({
  sectionNumber,
  rightTitle,
  leftTitle,
}) => {
  return (
    <div className="grid grid-cols-2 divide-x divide-gray-100 border border-gray-200 rounded-lg p-3">
      <div>
        <ChevronLeft size={18} />
        <div>
          <p className={"text-gray-300"}>Previous</p>
          <div className="space-y-1">
            <p>Section: {sectionNumber}</p>
            <p>{leftTitle}</p>
          </div>
        </div>
      </div>

      <div>
        <ChevronRight size={18} />
        <div>
          <p className={"text-gray-300"}>Next</p>
          <div className="space-y-1">
            <p>Section: {sectionNumber + 1}</p>
            <p>{rightTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterNavigation;
