"use client";

import { Dispatch, SetStateAction, FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IDateFilter {
  timeFilter: string;
  setTimeFilter: Dispatch<SetStateAction<string>>;
}

const DateFilter: FC<IDateFilter> = ({ timeFilter, setTimeFilter }) => {
  return (
    <Select value={timeFilter} onValueChange={setTimeFilter}>
      <SelectTrigger className="bg-transparent border-gray-700 text-white !h-12">
        <SelectValue placeholder="Time filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Last 24 hours</SelectItem>
        <SelectItem value="7">Last 7 days</SelectItem>
        <SelectItem value="30">Last 30 days</SelectItem>
        <SelectItem value="all">All time</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DateFilter;
