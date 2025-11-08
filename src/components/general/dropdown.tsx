"use client";

import { FC, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
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
  title?: string;
  Icon: LucideIcon;
  onAction: () => void;
}

interface IDropDown {
  items: DropDownItems[];
  button: ReactNode;
  label?: string;
  contentStyle?: string;
}

export const Dropdown: FC<IDropDown> = ({
  items,
  button,
  label,
  contentStyle,
}) => {
  return (
    <DropdownMenu>
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
            onClick={item.onAction}
            key={index}
            className="hover:bg-lightgrey"
          >
            <div className="flex flex-row items-center gap-2">
              <item.Icon size={15} />
              <p className="text-sm">{item.title}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
