import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LucideIcon } from "lucide-react";

interface SelectItems {
  Icon?: LucideIcon;
  value: string;
}

interface ISelectComp {
  placeholder: string;
  header: string;
  selectItems: SelectItems[];
}

const SelectComp: React.FC<ISelectComp> = ({
  placeholder,
  header,
  selectItems,
}) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px] border-lightgrey">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{header}</SelectLabel>
          {selectItems.map((item, index) => (
            <SelectItem
              key={index}
              value={item.value}
              className="flex flex-row gap-3"
            >
              {item.Icon && <item.Icon size={20} />}
              <p className="text-sm capitalize">{item.value}</p>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComp;
