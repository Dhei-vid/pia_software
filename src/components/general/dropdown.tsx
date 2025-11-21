"use client";

import { Dispatch, FC, ReactNode, SetStateAction } from "react";
// import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropDownItems {
  components: ReactNode;
  // onAction: () => void;
}

interface IDropDown {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  items: DropDownItems[];
  button: ReactNode;
  label?: string;
  contentStyle?: string;
}

export const Dropdown: FC<IDropDown> = ({
  open,
  setOpen,
  items,
  button,
  label,
  contentStyle,
}) => {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>{button}</DropdownMenuTrigger>
      <DropdownMenuContent className={cn(contentStyle)}>
        {label && (
          <div className="space-y-2">
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </div>
        )}

        {items.map((item, index) => (
          <DropdownMenuItem
            // onClick={item.onAction}
            key={index}
            className="hover:!bg-lightgrey"
          >
            {item.components}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
