"use client";

import { FC, useState, useEffect } from "react";
import { CheckboxField } from "../ui/checkbox-field";
import LoadingSpinner from "../ui/loading";
import { useChecklists } from "@/hooks/useChecklists";
import { useUser } from "@/contexts/UserContext";
import { Checklist } from "@/api/checklist/checklist-type";

const CheckList = () => {
  const { user } = useUser();
  const { checklists, fetchChecklists, loading, error } = useChecklists();
  const [items, setItems] = useState<Checklist[]>(checklists);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const response = await fetchChecklists(user?.documentId);
      setItems(response.checklist);
    })();
  }, [user, fetchChecklists]);

  const handleToggle = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <div className="text-gray-400 text-sm">Loading checklist...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400 text-sm">
          Error loading checklist: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-[100%]">
      {items && items.length > 0 ? (
        items?.map((it, index) => (
          <ChecklistSideBarItem
            key={it.id ?? index}
            id={it.id}
            item={it.item ?? ""}
            completed={it.completed}
            onToggle={handleToggle}
          />
        ))
      ) : (
        <div className={"flex items-center justify-center pt-5"}>
          <p className="text-sm text-grey">No checklists found.</p>
        </div>
      )}
    </div>
  );
};

export default CheckList;

interface IChecklistSideBarItem {
  id: string;
  item: string;
  completed: boolean;
  onToggle: (id: string) => void;
}

const ChecklistSideBarItem: FC<IChecklistSideBarItem> = ({
  id,
  item,
  completed,
  onToggle,
}) => {
  return (
    <div className="flex flex-row gap-3 items-start cursor-pointer transition-all duration-200 ease-in-out rounded-md">
      <CheckboxField
        label={item}
        id={id}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="mt-0.5"
      />
    </div>
  );
};
