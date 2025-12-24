"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Searches } from "@/api/documents/document-types";
import { formatTimeAgo } from "@/common/helpers";
import { Spinner } from "../ui/spinner";

interface IHistoryList {
  history: Searches[];
  isLoading: boolean;
  error?: string;
}

const HistoryList: FC<IHistoryList> = ({ history, isLoading, error }) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-row gap-2 items-center justify-center py-8">
        <Spinner className="w-4 h-4" />
        <p className="text-xs text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-row gap-2 items-center justify-center py-8">
        <p className="text-xs text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* History List */}
      <div className="space-y-2">
        {history && history.length > 0 ? (
          history.map((item) => (
            <button
              key={item.id}
              className="group py-3 rounded-md hover:bg-lightgrey cursor-pointer transition-colors w-full"
            >
              <div className="flex space-x-3 flex-1 overflow-hidden">
                <div className="text-balance text-ellipsis">
                  <p className="w-full text-left text-sm text-foreground">
                    {item.query}
                  </p>
                  <p className="text-left text-xs text-muted-foreground">
                    {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8">
            <SearchIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No history found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
