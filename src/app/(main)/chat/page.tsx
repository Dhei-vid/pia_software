"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Plus, ChevronDown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import LoadingSpinner from "@/components/ui/loading";
import { extractErrorMessage } from "@/common/helpers";
import SearchResultCard from "@/components/ui/search-result-card";
import { SearchResult,  TaxResult, TaxQueryResponse  } from "@/api/ai/ai-type";
import { Dropdown } from "@/components/general/dropdown";
import { toast } from "sonner";
import FileUploader from "@/components/ui/file-uploader";
import { Separator } from "@/components/ui/separator";
import { SelectedFIleUI } from "@/components/ui/selected-file";
import { AIService } from "@/api/ai/ai";
import { SearchResponse } from "@/api/ai/ai-type";
import { ComplianceDocument } from "@/api/compliance/compliance";
import { DocumentService } from "@/api/documents/document";
import { DocumentSection } from "@/api/documents/document-types";
import TaxResultCard from "@/components/ui/tax-result-card";

// Document types
const DOCUMENT_TYPES = {
  PIA: "pia",
  NTA: "nta",
} as const;

type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

const ChatPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isQueryResult, setIsQueryResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>(DOCUMENT_TYPES.PIA);
  const [isDocumentSelectorOpen, setIsDocumentSelectorOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | TaxResult | null>(null);
  const { user } = useUser();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Get document IDs from user
  const piaDocument = user?.documents?.find(doc => 
    doc.title.toLowerCase().includes('pia') || 
    doc.title.includes('Petroleum Industry Act')
  );
  
  const ntaDocument = user?.documents?.find(doc => 
    doc.title.toLowerCase().includes('tax') || 
    doc.title.includes('NIGERIA TAX ACT')
  );

  // Log user data
  useEffect(() => {
    if (user) {
      console.log("=== USER DATA ===");
      console.log("User object:", user);
      console.log("PIA Document:", piaDocument);
      console.log("NTA Document:", ntaDocument);
    }
  }, [user, piaDocument, ntaDocument]);

  const handleSearch = async () => {
  if (!searchQuery.trim()) {
    toast.error("Please enter a query");
    return;
  }

  setLoading(true);
  setError("");
  setIsQueryResult(false);
  setSearchResults(null);
    const currentQuery = searchQuery;
  try {
    // console.log("=== SEARCH EXECUTION ===");
    // console.log("Selected document type:", selectedDocumentType);
    // console.log("Search query:", searchQuery);

    let response;

    if (selectedDocumentType === DOCUMENT_TYPES.PIA) {
      const docId = piaDocument?.id || user?.documents?.[0]?.id;
      
      if (!docId) {
        throw new Error("PIA document not found");
      }

      console.log("Using PIA document ID:", docId);
      response = await AIService.search(docId, searchQuery);
    } else {

      response = await AIService.taxQuery(searchQuery);
    }

    console.log("Search response:", response);

    if (response.success) {
      setIsQueryResult(true);
      
      // Handle different response structures
      if (selectedDocumentType === DOCUMENT_TYPES.NTA) {
        // For tax responses, structure might be different
        setSearchResults(response.data || response);
      } else {
        // For PIA responses
        setSearchResults(response.data?.results || response.data);
      }
      setSearchQuery("");
    } else {
      throw new Error(response.message || "Search failed");
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error("Search error:", error);
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    const fileName = selectedFile.name;

    try {
      // console.log("=== FILE UPLOAD ===");
      // console.log("Selected document type:", selectedDocumentType);
      // console.log("Uploading file:", selectedFile.name);

      let response;

      if (selectedDocumentType === DOCUMENT_TYPES.PIA) {
        // Use PIA compliance endpoint
        response = await ComplianceDocument.uploadDocument(selectedFile);
        
        if (response?.success) {
          toast.loading("Redirecting to compliance report...", {
            id: "compliance-report",
          });
          router.push(
            `/chat/compliance-report?comparisonId=${response.data.comparisonId}`
          );
          toast.success("Redirected to compliance report", {
            id: "compliance-report",
          });
          setSelectedFile(null);
        }
      } else {
        // Use NTA tax document upload endpoint
        response = await AIService.taxDocumentUpload(selectedFile);
        
        if (response?.success) {
          // Navigate to the tax document analysis page
          router.push(
            `/chat/compliance-report?comparisonId=${response.data.id}&type=tax-document`
          );
          toast.success("Document analyzed successfully");
          setSelectedFile(null);
        }
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Upload error:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setOpenDropDown(false);
    }
  };

  // Auto scroll to bottom when new results appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [searchResults]);

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        await DocumentService.getAllDocuments();
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocument();
  }, []);

  // Handle file selection
  useEffect(() => {
    if (selectedFile) {
      handleFileUpload();
    }
  }, [selectedFile]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden p-6">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-width space-y-6"
      >
        {/* Greeting */}
        {(!isQueryResult || !searchQuery) && (
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-foreground/70 mb-2">
              Hello, {user?.fullName?.split(" ")[0] || "User"}!
            </h1>
          </div>
        )}
        {/* Search Results */}
        {isQueryResult && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground/70 mb-4">
              {selectedDocumentType === DOCUMENT_TYPES.PIA 
                ? `Search Results for '${searchQuery}'`
                : `Tax Analysis for '${searchQuery}'`
              }
            </h2>
            
            <div className="space-y-3">
              {/* PIA Results - Use SearchResultCard */}
              {selectedDocumentType === DOCUMENT_TYPES.PIA && 
              searchResults && 
              'chunks' in searchResults && 
              searchResults.chunks?.map((result, index) => (
                <SearchResultCard
                  key={index}
                  title={result.chapter}
                  description={result.content}
                  onViewFullSection={() => {}}
                />
              ))}

              {/* NTA/Tax Results - Use TaxResultCard */}
              {selectedDocumentType === DOCUMENT_TYPES.NTA && searchResults && (
                <TaxResultCard
                  message={(searchResults as any).message}
                  answer={(searchResults as any).answer || (searchResults as any).result?.answer}
                  confidence={(searchResults as any).confidence || (searchResults as any).result?.confidence}
                  eligible={(searchResults as any).result?.taxCalculation?.eligible}
                  calculation={(searchResults as any).result?.taxCalculation}
                  references={(searchResults as any).result?.references || (searchResults as any).references}
                />
              )}
            </div>
          </div>
        )}
            
        {/* Error Display */}
        {error && (
          <div className="mt-3 p-2 bg-transparent border border-red-200/50 rounded-md">
            <p className="text-red-300/50 text-xs">{error}</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border border-foreground/30 bg-dark p-3 sticky bottom-0 rounded-lg">
        {/* Document Type Selector */}
        <div className="mb-4 flex items-center gap-2">
          {/* <span className="text-sm text-muted-foreground">Document:</span> */}
          <div className="relative">
            <button
              onClick={() => setIsDocumentSelectorOpen(!isDocumentSelectorOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-dark border border-lightgrey rounded-md text-sm text-foreground hover:bg-lightgrey transition-colors"
            >
              <span>{selectedDocumentType === DOCUMENT_TYPES.PIA ? "PIA 2021" : "NTA (Nigeria Tax Act)"}</span>
              <ChevronDown size={14} className={`transition-transform ${isDocumentSelectorOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDocumentSelectorOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-dark border border-lightgrey rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    setSelectedDocumentType(DOCUMENT_TYPES.PIA);
                    setIsDocumentSelectorOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-lightgrey transition-colors first:rounded-t-md"
                >
                  PIA 2021
                </button>
                <button
                  onClick={() => {
                    setSelectedDocumentType(DOCUMENT_TYPES.NTA);
                    setIsDocumentSelectorOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-lightgrey transition-colors last:rounded-b-md"
                >
                  NTA (Nigeria Tax Act)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 pb-6">
          <Textarea
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSearch();
              }
            }}
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
                      btnText={`Upload for ${selectedDocumentType === DOCUMENT_TYPES.PIA ? 'PIA Compliance' : 'Tax Analysis'}`}
                    />
                  </div>
                ),
              },
            ]}
          />

          <Button
            disabled={loading || !searchQuery.trim()}
            onClick={handleSearch}
            className="ml-auto group w-12 h-12 border border-green bg-transparent hover:bg-green p-2 rounded-lg text-green hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            <SelectedFIleUI
              fileName={selectedFile.name}
              fileType={selectedFile.type}
              onDelete={() => setSelectedFile(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;










// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { SendHorizontal, Plus } from "lucide-react";
// import { useUser } from "@/contexts/UserContext";
// import LoadingSpinner from "@/components/ui/loading";
// import { extractErrorMessage } from "@/common/helpers";
// import SearchResultCard from "@/components/ui/search-result-card";
// import { SearchResult } from "@/api/ai/ai-type";
// import { Dropdown } from "@/components/general/dropdown";
// import { toast } from "sonner";
// import FileUploader from "@/components/ui/file-uploader";
// import { Separator } from "@/components/ui/separator";
// import { SelectedFIleUI } from "@/components/ui/selected-file";
// import { AIService } from "@/api/ai/ai";
// import { SearchResponse } from "@/api/ai/ai-type";
// import { ComplianceDocument } from "@/api/compliance/compliance";
// import { DocumentService } from "@/api/documents/document";
// import { DocumentSection } from "@/api/documents/document-types";

// const ChatPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
//   const [isQueryResult, setIsQueryResult] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const { user } = useUser();

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [openDropDown, setOpenDropDown] = useState<boolean>(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);


//    useEffect(() => {
//     if (user) {
//       console.log("=== USER DATA ===");
//       console.log("User object:", user);
//       console.log("User documentId:", user.documentId);
//       console.log("User documents array:", user.documents);
//       if (user.documents && user.documents.length > 0) {
//         user.documents.forEach((doc, index) => {
//           console.log(`Document ${index + 1}:`, {
//             id: doc.id,
//             title: doc.title
//           });
//         });
//       }
//     }
//   }, [user]);

//   const selectedDocId = searchParams.get("docId");


//     // Log which document ID is being used for search
//   const documentIdToUse = user?.documentId || selectedDocId || (user?.documents && user.documents[0]?.id);
  
//   console.log("=== DOCUMENT ID SELECTION ===");
//   console.log("user?.documentId:", user?.documentId);
//   console.log("selectedDocId from URL:", selectedDocId);
//   console.log("first document from array:", user?.documents?.[0]?.id);
//   console.log("FINAL DOCUMENT ID TO USE:", documentIdToUse);

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       if (!user?.documentId) {
//         setError("No document ID found");
//         return;
//       }

//       const response = (await AIService.search(
//         user?.documentId,
//         searchQuery
//       )) as SearchResponse;

//       if (response.success) {
//         setIsQueryResult(true);
//         setSearchResults(response.data.results);
//       }
//     } catch (error) {
//       const errorMessage = extractErrorMessage(error);
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTo({
//         top: scrollRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [searchResults]);

//   useEffect(() => {
//     const fetchDocument = async () => {
//       await DocumentService.getAllDocuments();
//     };

//     fetchDocument();
//   }, []);

//   useEffect(() => {
//     const checkFileCompliance = async () => {
//       if (selectedFile === null || !selectedFile) return;

//       const response = await ComplianceDocument.uploadDocument(
//         selectedFile as File
//       );

//       if (response?.success) {
//         toast.loading("Redirecting to compliance report...", {
//           id: "compliance-report",
//         });
//         router.push(
//           `/chat/compliance-report?comparisonId=${response.data.comparisonId}`
//         );

//         toast.success("Redirected to compliance report", {
//           id: "compliance-report",
//         });
//       }
//     };

//     checkFileCompliance();
//   }, [selectedFile, router]);

//   return (
//     <div className="flex flex-col w-full h-full overflow-hidden p-6">
//       <div
//         ref={scrollRef}
//         className="flex-1 overflow-y-auto scrollbar-width space-y-6"
//       >
//         {/* Greeting */}
//         {(!isQueryResult || !searchQuery) && (
//           <div className="mb-8 text-center">
//             <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-foreground/70 mb-2">
//               Hello, {user?.fullName.split(" ")[0]}!
//             </h1>
//           </div>
//         )}
//         {isQueryResult && (
//           <div className="mb-8">
//             <h2 className="text-xl font-semibold text-foreground/70 mb-4">
//               Search Results for &lsquo;{searchQuery}&lsquo;
//             </h2>
//             <div className="space-y-3">
//               {searchResults?.chunks.map((result, index) => (
//                 <SearchResultCard
//                   key={index}
//                   title={result.chapter}
//                   description={result.content}
//                   onViewFullSection={() => {}}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mt-3 p-2 bg-transparent border border-red-200/50 rounded-md">
//             <p className="text-red-300/50 text-xs">{error}</p>
//           </div>
//         )}
//       </div>
//       <div className="border border-foreground/30 bg-dark p-3 sticky bottom-0 rounded-lg">
//         <div className="pt-3 pb-6">
//           <Textarea
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             rows={8}
//             placeholder="Search for a section, upload a document, or draft a new document."
//             className="!bg-dark dark:!bg-transparent text-lg border-none text-muted-foreground placeholder:text-gray-400 focus:border-none resize-none !overflow-y-auto"
//           />
//         </div>
//         <div className="p-3 flex flex-row items-center justify-between">
//           <Dropdown
//             open={openDropDown}
//             setOpen={setOpenDropDown}
//             button={
//               <div className="cursor-pointer flex items-center justify-center group h-12 w-12 hover:bg-lightgrey border border-foreground/30 bg-transparent rounded-full duration-300">
//                 <Plus size={20} className="text-foreground/50" />
//               </div>
//             }
//             contentStyle="ml-27"
//             items={[
//               {
//                 components: (
//                   <div onClick={(e) => e.stopPropagation()}>
//                     <FileUploader
//                       file={selectedFile}
//                       setFile={(e) => {
//                         setSelectedFile(e);
//                         setOpenDropDown(false);
//                       }}
//                       onFIleupload={() => {}}
//                       btnText="Add Files"
//                     />
//                   </div>
//                 ),
//               },
//             ]}
//           />
//           <Button
//             disabled={loading}
//             onClick={() => handleSearch()}
//             className="ml-auto group w-12 h-12 border border-green bg-transparent hover:bg-green p-2 rounded-lg text-green hover:text-white"
//           >
//             {loading ? (
//               <LoadingSpinner size={"sm"} />
//             ) : (
//               <SendHorizontal size={30} />
//             )}
//           </Button>
//         </div>

//         {selectedFile && (
//           <div className="space-y-4">
//             <Separator />
//             {selectedFile ? (
//               <SelectedFIleUI
//                 fileName={selectedFile.name}
//                 fileType={selectedFile.type}
//                 onDelete={() => setSelectedFile(null)}
//               />
//             ) : null}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

























// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { SendHorizontal, Plus } from "lucide-react";
// import { useUser } from "@/contexts/UserContext";
// import LoadingSpinner from "@/components/ui/loading";
// import { extractErrorMessage } from "@/common/helpers";
// import SearchResultCard from "@/components/ui/search-result-card";
// import { SearchResult } from "@/api/ai/ai-type";
// import { Dropdown } from "@/components/general/dropdown";
// import { toast } from "sonner";

// import FileUploader from "@/components/ui/file-uploader";
// import { Separator } from "@/components/ui/separator";
// import { SelectedFIleUI } from "@/components/ui/selected-file";

// // APIs
// import { AIService } from "@/api/ai/ai";
// import { SearchResponse } from "@/api/ai/ai-type";
// import { ComplianceDocument } from "@/api/compliance/compliance";
// import { DocumentService } from "@/api/documents/document";

// const ChatPage = () => {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
//   const [isQueryResult, setIsQueryResult] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const { user } = useUser();

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [openDropDown, setOpenDropDown] = useState<boolean>(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   // Handle Search
//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       if (!user?.documentId) {
//         setError("No document ID found");
//         return;
//       }

//       const response = (await AIService.search(
//         user?.documentId,
//         searchQuery
//       )) as SearchResponse;

//       if (response.success) {
//         setIsQueryResult(true);
//         setSearchResults(response.data.results);
//       }
//     } catch (error) {
//       const errorMessage = extractErrorMessage(error);
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 👇 Auto scroll to bottom when new results appear
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTo({
//         top: scrollRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [searchResults]);

//   // Handle get document
//   useEffect(() => {
//     const fetchDocument = async () => {
//       await DocumentService.getAllDocuments();
//     };

//     fetchDocument();
//   });

//   // check compliance document
//   useEffect(() => {
//     const checkFileCompliance = async () => {
//       if (selectedFile === null || !selectedFile) return;

//       const response = await ComplianceDocument.uploadDocument(
//         selectedFile as File
//       );

//       if (response?.success) {
//         toast.loading("Redirecting to compliance report...", {
//           id: "compliance-report",
//         });
//         router.push(
//           `/chat/compliance-report?comparisonId=${response.data.comparisonId}`
//         );

//         toast.success("Redirected to compliance report", {
//           id: "compliance-report",
//         });
//       }
//     };

//     checkFileCompliance();
//   }, [selectedFile]);

//   return (
//     <div className={`flex flex-col w-full h-full overflow-hidden`}>
//       <div
//         ref={scrollRef}
//         className="flex-1 overflow-y-auto scrollbar-width space-y-6"
//       >
//         {/* Greeting */}
//         {(!isQueryResult || !searchQuery) && (
//           <div className="mb-8 text-center">
//             <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-foreground/70 mb-2">
//               Hello, {user?.fullName.split(" ")[0]}!
//             </h1>
//           </div>
//         )}

//         {/* Search Results Section */}
//         {isQueryResult && (
//           <div className="mb-8">
//             <h2 className="text-xl font-semibold text-foreground/70 mb-4">
//               Search Results for &lsquo;{searchQuery}&lsquo;
//             </h2>
//             <div className="space-y-3">
//               {searchResults?.chunks.map((result, index) => (
//                 <SearchResultCard
//                   key={index}
//                   title={result.chapter}
//                   description={result.content}
//                   onViewFullSection={() => {}}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mt-3 p-2 bg-transparent border border-red-200/50 rounded-md">
//             <p className="text-red-300/50 text-xs">{error}</p>
//           </div>
//         )}
//       </div>

//       {/* 👇 Fixed bottom input area (your existing one — unchanged) */}
//       <div className="border border-foreground/30 bg-dark p-3 sticky bottom-0 rounded-lg">
//         <div className="pt-3 pb-6">
//           <Textarea
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             rows={8}
//             placeholder="Search for a section, upload a document, or draft a new document."
//             className="!bg-dark dark:!bg-transparent text-lg border-none text-muted-foreground placeholder:text-gray-400 focus:border-none resize-none !overflow-y-auto"
//           />
//         </div>
//         <div className="p-3 flex flex-row items-center justify-between">
//           <Dropdown
//             open={openDropDown}
//             setOpen={setOpenDropDown}
//             button={
//               <div className="cursor-pointer flex items-center justify-center group h-12 w-12 hover:bg-lightgrey border border-foreground/30 bg-transparent rounded-full duration-300">
//                 <Plus size={20} className="text-foreground/50" />
//               </div>
//             }
//             contentStyle="ml-27"
//             items={[
//               {
//                 components: (
//                   <div onClick={(e) => e.stopPropagation()}>
//                     <FileUploader
//                       file={selectedFile}
//                       setFile={(e) => {
//                         setSelectedFile(e);
//                         setOpenDropDown(false);
//                       }}
//                       onFIleupload={() => {}}
//                       btnText="Add Files"
//                     />
//                   </div>
//                 ),
//               },
//             ]}
//           />
//           <Button
//             disabled={loading}
//             onClick={() => handleSearch()}
//             className="ml-auto group w-12 h-12 border border-green bg-transparent hover:bg-green p-2 rounded-lg text-green hover:text-white"
//           >
//             {loading ? (
//               <LoadingSpinner size={"sm"} />
//             ) : (
//               <SendHorizontal size={30} />
//             )}
//           </Button>
//         </div>

//         {selectedFile && (
//           <div className="space-y-4">
//             <Separator />
//             {selectedFile ? (
//               <SelectedFIleUI
//                 fileName={selectedFile.name}
//                 fileType={selectedFile.type}
//                 onDelete={() => setSelectedFile(null)}
//               />
//             ) : null}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
