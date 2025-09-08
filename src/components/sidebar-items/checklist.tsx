import { FC, useState } from "react";
import { CheckboxField } from "../ui/checkbox-field";

const checklistData = [
  {
    id: "1",
    title: "Review Chapter 1 - Governance & Institution",
    completed: false,
  },
  {
    id: "2",
    title: "Analyze Host Communities Development provisions",
    completed: false,
  },
  {
    id: "3",
    title: "Study Petroleum Industrial Fiscal Framework",
    completed: false,
  },
];

const CheckList = () => {
  const [items, setItems] = useState(checklistData);

  const handleToggle = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="space-y-4 w-[100%]">
      {items.map((item, index) => (
        <ChecklistSideBarItem key={index} {...item} onToggle={handleToggle} />
      ))}
    </div>
  );
};

export default CheckList;

interface IChecklistSideBarItem {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
}

const ChecklistSideBarItem: FC<IChecklistSideBarItem> = ({
  id,
  title,
  completed,
  onToggle,
}) => {
  return (
    <div className="p-3 flex flex-row gap-3 items-start hover:bg-lightgrey cursor-pointer transition-all duration-200 ease-in-out rounded-md">
      <CheckboxField
        label={title}
        id={id}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="mt-0.5"
      />
    </div>
  );
};
