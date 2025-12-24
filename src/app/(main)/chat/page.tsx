"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Plus } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import LoadingSpinner from "@/components/ui/loading";
import { extractErrorMessage } from "@/common/helpers";
import SearchResultCard from "@/components/ui/search-result-card";
import { SearchResult } from "@/api/ai/ai-type";
import { Dropdown } from "@/components/general/dropdown";

import FileUploader from "@/components/ui/file-uploader";
import { Separator } from "@/components/ui/separator";
import { SelectedFIleUI } from "@/components/ui/selected-file";

// APIs
import { AIService } from "@/api/ai/ai";
import { SearchResponse } from "@/api/ai/ai-type";
import { ComplianceDocument } from "@/api/compliance/compliance";
import { DocumentService } from "@/api/documents/document";

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isQueryResult, setIsQueryResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { user } = useUser();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle Search
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

  // Handle get document
  useEffect(() => {
    const fetchDocument = async () => {
      const response = await DocumentService.getAllDocuments();
    };

    fetchDocument();
  });

  // check compliance document
  useEffect(() => {
    const checkFileCompliance = async () => {
      if (selectedFile === null || !selectedFile) return;

      await ComplianceDocument.uploadDocument(selectedFile as File);
    };

    checkFileCompliance();
  }, [selectedFile]);

  return (
    <div className={`flex flex-col w-full h-full overflow-hidden`}>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-width space-y-6"
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
          <Dropdown
            open={openDropDown}
            setOpen={setOpenDropDown}
            button={
              <div className="cursor-pointer flex items-center justify-center group h-12 w-12 hover:bg-lightgrey border border-foreground/30 bg-transparent rounded-full duration-300">
                <Plus size={20} className="text-foreground/50" />
              </div>
            }
            contentStyle="ml-27"
            items={[
              {
                components: (
                  <div onClick={(e) => e.stopPropagation()}>
                    <FileUploader
                      file={selectedFile}
                      setFile={(e) => {
                        setSelectedFile(e);
                        setOpenDropDown(false);
                      }}
                      onFIleupload={() => {}}
                      btnText="Add Files"
                    />
                  </div>
                ),
              },
            ]}
          />
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

        {selectedFile && (
          <div className="space-y-4">
            <Separator />
            {selectedFile ? (
              <SelectedFIleUI
                fileName={selectedFile.name}
                fileType={selectedFile.type}
                onDelete={() => setSelectedFile(null)}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
