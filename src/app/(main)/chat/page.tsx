"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react"; // commented out Plus
import { useUser } from "@/contexts/UserContext";
import LoadingSpinner from "@/components/ui/loading";
import { extractErrorMessage } from "@/common/helpers";
import SearchResultCard from "@/components/ui/search-result-card";
import { SearchResult } from "@/api/ai/ai-type";

// APIs
import { AIService } from "@/api/ai/ai";
import { SearchResponse } from "@/api/ai/ai-type";

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isQueryResult, setIsQueryResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { user } = useUser();

  const scrollRef = useRef<HTMLDivElement>(null); // 👈 for auto-scroll

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!user?.documentId) {
        setError("No document ID found");
        return;
      }

      const response = (await AIService.search(
        user?.documentId,
        searchQuery
      )) as SearchResponse;

      if (response.success) {
        setIsQueryResult(true);
        setSearchResults(response.data.results);
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Auto scroll to bottom when new results appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [searchResults]);

  return (
    <div className={`flex flex-col w-full h-full overflow-hidden`}>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-width p-4 space-y-6"
      >
        {/* Greeting */}
        {(!isQueryResult || !searchQuery) && (
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-foreground/70 mb-2">
              Hello, {user?.fullName.split(" ")[0]}!
            </h1>
          </div>
        )}

        {/* Search Results Section */}
        {isQueryResult && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground/70 mb-4">
              Search Results for &lsquo;{searchQuery}&lsquo;
            </h2>
            <div className="space-y-3">
              {searchResults?.chunks.map((result, index) => (
                <SearchResultCard
                  key={index}
                  title={result.chapter}
                  description={result.content}
                  onViewFullSection={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-2 bg-transparent border border-red-200/50 rounded-md">
            <p className="text-red-300/50 text-xs">{error}</p>
          </div>
        )}
      </div>

      {/* 👇 Fixed bottom input area (your existing one — unchanged) */}
      <div className="border border-foreground/30 bg-dark p-3 sticky bottom-0 rounded-lg">
        <div className="pt-3 pb-6">
          <Textarea
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            rows={8}
            placeholder="Search for a section, upload a document, or draft a new document."
            className="!bg-dark dark:!bg-transparent text-lg border-none text-muted-foreground placeholder:text-gray-400 focus:border-none resize-none !overflow-y-auto"
          />
        </div>
        <div className="p-3 flex flex-row items-center justify-between">
          {/* <Button
            variant="outline"
            size="sm"
            className="w-12 h-12 hover:bg-[#3a3a3a] border border-foreground/50 bg-transparent rounded-full"
          >
            <Plus size={30} className="text-foreground/50" />
          </Button> */}

          <Button
            disabled={loading}
            onClick={() => handleSearch()}
            className="ml-auto group w-12 h-12 border border-green bg-transparent hover:bg-green p-2 rounded-lg text-green hover:text-white"
          >
            {loading ? (
              <LoadingSpinner size={"sm"} />
            ) : (
              <SendHorizontal size={30} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
