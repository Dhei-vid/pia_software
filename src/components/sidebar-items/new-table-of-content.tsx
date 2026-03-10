"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import { keepLettersAndSpaces } from "@/common/helpers";

import { DocumentService } from "@/api/documents/document";
import { DocumentContent } from "@/api/documents/document-types";
import { DocumentSection } from "@/api/documents/document-types";

interface NewTableOfContentProps {
  searchQuery?: string;
  onSectionSelect?: (
    section: DocumentSection,
    chapterTitle: string,
    partTitle: string,
    sections: DocumentSection[],
    partId: string
  ) => void;
}

const NewTableOfContent: FC<NewTableOfContentProps> = ({ searchQuery = "", onSectionSelect }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<{ [key: string]: DocumentContent }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState<boolean>(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(new Set());
  const [selectedPartForDrawer, setSelectedPartForDrawer] = useState<{
    id: string;
    title: string;
    number: number;
    documentId: string;
    chapterTitle: string;
  } | null>(null);

  // Fetch ALL documents
  useEffect(() => {
    const fetchAllDocuments = async () => {
      if (!user?.documents || user.documents.length === 0) return;

      // Initialize loading states
      const initialLoading: { [key: string]: boolean } = {};
      user.documents.forEach(doc => {
        initialLoading[doc.id] = true;
      });
      setLoading(initialLoading);

      // Fetch each document
      const fetchPromises = user.documents.map(async (doc) => {
        try {
          const response = await DocumentService.getAllDocumentContent(
            doc.id,
            "structured"
          );
          return { 
            documentId: doc.id, 
            content: response.data.content 
          };
        } catch (error) {
          console.error(`Error fetching document ${doc.id}:`, error);
          return { 
            documentId: doc.id, 
            content: null 
          };
        } finally {
          setLoading(prev => ({ ...prev, [doc.id]: false }));
        }
      });

      const results = await Promise.all(fetchPromises);
      
      // Update documents state
      const docsMap: { [key: string]: DocumentContent } = {};
      results.forEach(result => {
        if (result.content) {
          docsMap[result.documentId] = result.content;
        }
      });
      setDocuments(docsMap);
      
      // Auto-expand all documents by default
      if (user.documents.length > 0) {
        setExpandedDocuments(new Set(user.documents.map(doc => doc.id)));
      }
    };

    fetchAllDocuments();
  }, [user]);

  // Handle document toggle
  const handleDocumentClick = (documentId: string) => {
    setExpandedDocuments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  };

  // Handle chapter toggle
  const handleChapterClick = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  // Handle parts click
  const handlePartClick = (
    partId: string,
    partTitle: string,
    partNumber: number,
    documentId: string,
    chapterTitle: string
  ) => {
    setSelectedPart(partId);
    setSelectedPartForDrawer({
      id: partId,
      title: partTitle,
      number: partNumber,
      documentId,
      chapterTitle,
    });
    setIsSectionsDrawerOpen(true);
  };

  if (!user?.documents || user.documents.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          No documents found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex-1 px-6 pb-6 overflow-y-auto scrollbar-width">
      {/* Render each document */}
      {user.documents.map((doc) => {
        const documentContent = documents[doc.id];
        const isLoading = loading[doc.id];
        const isDocumentExpanded = expandedDocuments.has(doc.id);

        return (
          <div key={doc.id} className="space-y-2">
            {/* Document Title - Click to expand/collapse */}
            <button
              onClick={() => handleDocumentClick(doc.id)}
              className={cn(
                "flex flex-row items-center w-full justify-between text-foreground hover:bg-lightgrey rounded-md cursor-pointer p-3 group border border-lightgrey",
                isDocumentExpanded ? "bg-lightgrey/50" : ""
              )}
            >
              <div className="flex flex-col w-[13rem]">
                <span className="text-sm font-semibold text-foreground truncate">
                  {documentContent?.title || doc.title}
                </span>
                {documentContent?.year && (
                  <span className="text-xs text-muted-foreground">
                    {documentContent.actNumber} • {documentContent.year}
                  </span>
                )}
              </div>
              <div className="flex-shrink-0 ml-2">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                ) : isDocumentExpanded ? (
                  <ChevronDown size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={16} className="text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Document Chapters (shown when expanded) */}
            {isDocumentExpanded && documentContent && (
              <div className="ml-3 space-y-1 border-l-2 border-lightgrey pl-3">
                {documentContent.chapters.map((chapter, index) => (
                  <div key={chapter.id || index} className="space-y-1">
                    {/* Chapter Title */}
                    <button
                      onClick={() => handleChapterClick(chapter.id)}
                      className={cn(
                        expandedChapters.has(chapter.id) ? "bg-lightgrey" : "",
                        "flex flex-row items-center w-full justify-between text-foreground/70 hover:text-foreground hover:bg-lightgrey text-left rounded-md cursor-pointer p-2 group"
                      )}
                    >
                      <div className="flex flex-col w-[11rem]">
                        <span className="uppercase text-xs text-foreground truncate">
                          chapter {chapter.chapterNumber}
                        </span>
                        <span className="text-xs font-light truncate capitalize">
                          {chapter.chapterTitle}
                        </span>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {expandedChapters.has(chapter.id) ? (
                          <ChevronDown size={14} className="text-muted-foreground" />
                        ) : (
                          <ChevronRight size={14} className="text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded parts */}
                    {expandedChapters.has(chapter.id) && (
                      <div className="ml-3 space-y-1">
                        {chapter.parts.map((part, index) => (
                          <div key={part.id || index}>
                            <button
                              onClick={() =>
                                handlePartClick(
                                  part.id,
                                  part.partTitle,
                                  part.partNumber,
                                  doc.id, // This is the key - passing the document ID
                                  chapter.chapterTitle
                                )
                              }
                              className={cn(
                                selectedPart === part.id
                                  ? "bg-dark border border-lightgrey"
                                  : "hover:bg-dark",
                                "rounded-md cursor-pointer py-2 p-2 transition-colors text-xs text-left text-muted-foreground w-full truncate"
                              )}
                            >
                              PART {part.partNumber} - {part.partTitle}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Document sections Drawer */}
      <GenericDrawer
        isOpen={isSectionsDrawerOpen}
        onClose={() => {
          setIsSectionsDrawerOpen(false);
          setSelectedPartForDrawer(null);
        }}
        headerStyle="text-xs"
        isHeaderArrow={true}
        title={`Part ${selectedPartForDrawer?.number} - ${
          selectedPartForDrawer?.title || "Sections"
        }`}
        position="left"
      >
        {selectedPartForDrawer && (
          <DocumentPart 
            selectedPart={selectedPartForDrawer.id} 
            document={documents[selectedPartForDrawer.documentId]}
            documentId={selectedPartForDrawer.documentId}
            chapterTitle={selectedPartForDrawer.chapterTitle}
            onSectionSelect={onSectionSelect}
          />
        )}
      </GenericDrawer>
    </div>
  );
};

interface IDocumentPart {
  selectedPart: string;
  document: DocumentContent;
  documentId: string;
  chapterTitle: string;
  onSectionSelect?: (
    section: DocumentSection,
    chapterTitle: string,
    partTitle: string,
    sections: DocumentSection[],
    partId: string
  ) => void;
}

const DocumentPart: FC<IDocumentPart> = ({ 
  selectedPart, 
  document, 
  documentId,
  chapterTitle,
  onSectionSelect 
}) => {
  const router = useRouter();

  const getSelectedPartWithChapter = (selectedPart: string, document: DocumentContent) => {
    for (const chapter of document?.chapters ?? []) {
      const found = chapter.parts.find((part) => part.id === selectedPart);
      if (found) {
        return {
          part: found,
          chapter: chapter,
        };
      }
    }
    return null;
  };

  const partData = getSelectedPartWithChapter(selectedPart, document);

  const handleSectionClick = (section: DocumentSection) => {
    if (!partData) return;
    
    console.log("Section clicked:", {
      section,
      partData,
      documentId,
      chapterTitle
    });

    if (onSectionSelect) {
      // Use the callback
      onSectionSelect(
        section,
        partData.chapter.chapterTitle,
        partData.part.partTitle,
        partData.part.sections,
        partData.part.id
      );
    } else {
      // Fallback to direct navigation with document ID
      const params = new URLSearchParams({
        sectionId: section.id,
        partTitle: partData.part.partTitle,
        chapterTitle: partData.chapter.chapterTitle,
        docId: documentId, // Always include document ID
      });
      
      router.push(`/chat/doc?${params.toString()}`);
    }
  };

  if (!partData) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No sections found
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      {partData.part.sections.map((section, index) => (
        <button
          key={section.id || index}
          onClick={() => handleSectionClick(section)}
          className="cursor-pointer text-left hover:bg-lightgrey w-full space-y-1 p-2 rounded-md transition-colors"
        >
          <p className="text-xs text-muted-foreground">
            Section {section?.sectionNumber}
          </p>
          <p className="text-xs text-foreground line-clamp-1">
            {keepLettersAndSpaces(section?.sectionTitle)}
          </p>
        </button>
      ))}
    </div>
  );
};

export default NewTableOfContent;




//Previous code before refactor to support multiple documents and section selection callback:

// "use client";

// import { cn } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import { FC, useEffect, useState } from "react";
// import { ChevronRight, ChevronDown } from "lucide-react";

// import useAuth from "@/hooks/useAuth";
// // import { TOC } from "@/api/documents/document-types";
// import { GenericDrawer } from "@/components/ui/generic-drawer";
// import { keepLettersAndSpaces } from "@/common/helpers";

// import { DocumentService } from "@/api/documents/document";
// import { DocumentContent, DocumentChapter } from "@/api/documents/document-types";
// import { DocumentSection } from "@/api/documents/document-types";

// interface NewTableOfContentProps {
//   searchQuery?: string;
//   onSectionSelect?: (
//     section: DocumentSection,
//     chapterTitle: string,
//     partTitle: string,
//     sections: DocumentSection[],
//     partId: string,
//     documentId: string 
//   ) => void;
// }

// const NewTableOfContent: FC<NewTableOfContentProps> = ({ searchQuery = "", onSectionSelect }) => {
//   const { user } = useAuth();
//   const [document, setDocument] = useState<DocumentContent | null>(null);

//   const [selectedPart, setSelectedPart] = useState<string>("");
//   const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] =
//     useState<boolean>(false);
//   const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
//     new Set()
//   );
//   const [selectedPartForDrawer, setSelectedPartForDrawer] = useState<{
//     id: string;
//     title: string;
//     number: number;
//   } | null>(null);

//   // Calling the TOC
//   const firstDocumentId = user?.documents?.[1]?.id;
//   console.log("First Document ID:", firstDocumentId);
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!firstDocumentId) return;

//       const response = await DocumentService.getAllDocumentContent(
//         firstDocumentId,
//         "structured"
//       );
//       setDocument(response.data.content);
//     };

//     fetchData();
//   }, [user]);

//   // Handle chapter toggle
//   const handleChapterClick = (chapterId: string) => {
//     setExpandedChapters((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(chapterId)) {
//         newSet.delete(chapterId);
//       } else {
//         newSet.add(chapterId);
//       }
//       return newSet;
//     });
//   };

//   // Handle parts click
//   const handlePartClick = (
//     partId: string,
//     partTitle: string,
//     partNumber: number
//   ) => {
//     setSelectedPart(partId);
//     setSelectedPartForDrawer({
//       id: partId,
//       title: partTitle,
//       number: partNumber,
//     });
//     setIsSectionsDrawerOpen(true);
//   };

//   // Filter chapters and parts based on search query
//   const filterChapters = (): DocumentChapter[] => {
//     if (!document?.chapters) return [];
    
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) return document.chapters;

//     // Extract chapter/part number from query if it's a specific search
//     const chapterMatch = query.match(/^chapter\s*(\d+)$/);
//     const partMatch = query.match(/^part\s*(\d+)$/);
//     const targetChapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : null;
//     const targetPartNumber = partMatch ? parseInt(partMatch[1], 10) : null;

//     const filtered: DocumentChapter[] = [];
    
//     document.chapters.forEach((chapter) => {
//       // Check chapter matching: title, number, and formatted display string "chapter {number} - {title}"
//       const chapterTitleMatch = chapter.chapterTitle.toLowerCase().includes(query);
//       const chapterNumberStr = chapter.chapterNumber.toString();
      
//       // If query is specifically "chapter X", only match exact number
//       let chapterNumberMatch = false;
//       if (targetChapterNumber !== null) {
//         chapterNumberMatch = chapter.chapterNumber === targetChapterNumber;
//       } else {
//         // For other queries, check if it's just a number or contains the number
//         chapterNumberMatch = chapterNumberStr === query;
//       }
      
//       // Check formatted string like "chapter 1 - Title" (case-insensitive)
//       const formattedChapterString = `chapter ${chapter.chapterNumber} - ${chapter.chapterTitle}`.toLowerCase();
//       const formattedChapterStringMatch = formattedChapterString.includes(query);
//       // Also check if query is just "chapter 1" or "chapter1"
//       const chapterQueryMatch = query === `chapter ${chapterNumberStr}` || query === `chapter${chapterNumberStr}`;
      
//       const chapterMatches = chapterTitleMatch || chapterNumberMatch || formattedChapterStringMatch || chapterQueryMatch;
      
//       // Filter parts that match the query
//       // Check: part title, part number, and formatted display string "PART {number} - {title}"
//       const matchingParts = chapter.parts.filter((part) => {
//         const partTitleMatch = part.partTitle.toLowerCase().includes(query);
//         const partNumberStr = part.partNumber.toString();
        
//         // If query is specifically "part X", only match exact number
//         let partNumberMatch = false;
//         if (targetPartNumber !== null) {
//           partNumberMatch = part.partNumber === targetPartNumber;
//         } else {
//           // For other queries, check if it's just a number
//           partNumberMatch = partNumberStr === query;
//         }
        
//         // Check formatted string like "PART 2 - Title" (case-insensitive)
//         const formattedPartString = `part ${part.partNumber} - ${part.partTitle}`.toLowerCase();
//         const formattedPartStringMatch = formattedPartString.includes(query);
//         // Also check if query is just "part 2" or "part2"
//         const partQueryMatch = query === `part ${partNumberStr}` || query === `part${partNumberStr}`;
        
//         return partTitleMatch || partNumberMatch || formattedPartStringMatch || partQueryMatch;
//       });

//       // Show chapter if chapter matches or if any part matches
//       if (chapterMatches || matchingParts.length > 0) {
//         filtered.push({
//           ...chapter,
//           parts: chapterMatches ? chapter.parts : matchingParts,
//         });
//       }
//     });
    
//     return filtered;
//   };

//   // Auto-expand chapters that have matching parts when searching
//   useEffect(() => {
//     if (searchQuery.trim() && document) {
//       const query = searchQuery.toLowerCase().trim();
//       const chaptersToExpand = new Set<string>();
      
//       // Extract chapter/part number from query if it's a specific search
//       const chapterMatch = query.match(/^chapter\s*(\d+)$/);
//       const partMatch = query.match(/^part\s*(\d+)$/);
//       const targetChapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : null;
//       const targetPartNumber = partMatch ? parseInt(partMatch[1], 10) : null;
      
//       document.chapters.forEach((chapter) => {
//         // Check if chapter matches
//         const chapterTitleMatch = chapter.chapterTitle.toLowerCase().includes(query);
//         const chapterNumberStr = chapter.chapterNumber.toString();
        
//         let chapterNumberMatch = false;
//         if (targetChapterNumber !== null) {
//           chapterNumberMatch = chapter.chapterNumber === targetChapterNumber;
//         } else {
//           chapterNumberMatch = chapterNumberStr === query;
//         }
        
//         const formattedChapterString = `chapter ${chapter.chapterNumber} - ${chapter.chapterTitle}`.toLowerCase();
//         const formattedChapterStringMatch = formattedChapterString.includes(query);
//         const chapterQueryMatch = query === `chapter ${chapterNumberStr}` || query === `chapter${chapterNumberStr}`;
//         const chapterMatches = chapterTitleMatch || chapterNumberMatch || formattedChapterStringMatch || chapterQueryMatch;
        
//         // Check if any part matches
//         const hasMatchingPart = chapter.parts.some((part) => {
//           const partTitleMatch = part.partTitle.toLowerCase().includes(query);
//           const partNumberStr = part.partNumber.toString();
          
//           let partNumberMatch = false;
//           if (targetPartNumber !== null) {
//             partNumberMatch = part.partNumber === targetPartNumber;
//           } else {
//             partNumberMatch = partNumberStr === query;
//           }
          
//           const formattedPartString = `part ${part.partNumber} - ${part.partTitle}`.toLowerCase();
//           const formattedPartStringMatch = formattedPartString.includes(query);
//           const partQueryMatch = query === `part ${partNumberStr}` || query === `part${partNumberStr}`;
          
//           return partTitleMatch || partNumberMatch || formattedPartStringMatch || partQueryMatch;
//         });
        
//         if (chapterMatches || hasMatchingPart) {
//           chaptersToExpand.add(chapter.id);
//         }
//       });
      
//       setExpandedChapters(chaptersToExpand);
//     } else if (!searchQuery.trim()) {
//       // Reset to no expanded chapters when search is cleared
//       setExpandedChapters(new Set());
//     }
//   }, [searchQuery, document]);

//   if (!document) {
//     return (
//       <div className="flex items-center justify-center">
//         <p className="text-sm text-muted-foreground">
//           Document Table of Content Not Found
//         </p>
//       </div>
//     );
//   }

//   const filteredChapters = filterChapters();

//   return (
//     <div className="space-y-2 flex-1 px-6 pb-6 overflow-y-auto scrollbar-width">
//       {/* Table of Content Title */}
//       <div className="px-2">
//         <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
//           {document?.title}
//         </p>
//       </div>
//       {/* Document TOC */}
//       <div className="space-y-1">
//         {filteredChapters.length > 0 ? (
//           filteredChapters.map((chapter, index) => {
//           return (
//             <div key={index} className="space-y-1">
//               <button
//                 onClick={() => {
//                   handleChapterClick(chapter?.id);
//                 }}
//                 className={cn(
//                   expandedChapters.has(chapter.id) ? "bg-lightgrey" : "",
//                   "flex flex-row items-center w-full justify-between text-foreground/70 hover:text-foreground hover:bg-lightgrey text-left rounded-md cursor-pointer p-2 group"
//                 )}
//               >
//                 <div className="flex flex-col w-[13rem]">
//                   <span className="uppercase text-sm text-foreground truncate">
//                     chapter {chapter?.chapterNumber}
//                   </span>
//                   <span className="text-xs font-light truncate capitalize">
//                     {chapter?.chapterTitle}
//                   </span>
//                 </div>
//                 <div className="flex-shrink-0 ml-2">
//                   {expandedChapters.has(chapter.id) ? (
//                     <ChevronDown
//                       size={16}
//                       className="text-muted-foreground group-hover:text-foreground"
//                     />
//                   ) : (
//                     <ChevronRight
//                       size={16}
//                       className="text-muted-foreground group-hover:text-foreground"
//                     />
//                   )}
//                 </div>
//               </button>

//               {/* expanded parts */}
//               {expandedChapters.has(chapter.id) && (
//                 <div className="ml-3 space-y-1">
//                   {chapter?.parts.map((part, index) => {
//                     return (
//                       <div key={index}>
//                         <button
//                           onClick={() =>
//                             handlePartClick(
//                               part.id,
//                               part.partTitle,
//                               part.partNumber
//                             )
//                           }
//                           className={cn(
//                             selectedPart === part.id
//                               ? "bg-dark border border-lightgrey"
//                               : "hover:bg-dark",
//                             "rounded-md cursor-pointer py-3 p-2 transition-colors text-xs text-left text-muted-foreground w-full"
//                           )}
//                         >
//                           PART {part.partNumber} - {part.partTitle}
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })) : (
//           <div className="px-2 py-4">
//             <p className="text-xs text-muted-foreground text-center">
//               No chapters or parts found matching &quot;{searchQuery}&quot;
//             </p>
//           </div>
//         )}
//       </div>
//       {/* Document sections Drawer */}
//       <GenericDrawer
//         isOpen={isSectionsDrawerOpen}
//         onClose={() => {
//           setIsSectionsDrawerOpen(false);
//           setSelectedPartForDrawer(null);
//         }}
//         headerStyle="text-xs"
//         isHeaderArrow={true}
//         title={`Part ${selectedPartForDrawer?.number} - ${
//           selectedPartForDrawer?.title || "Sections"
//         }`}
//         position="left"
//       >
//         <DocumentPart selectedPart={selectedPart} document={document} />
//       </GenericDrawer>
//     </div>
//   );
// };

// export default NewTableOfContent;

// interface IDocumentPart {
//   selectedPart: string;
//   document: DocumentContent;
// }

// const DocumentPart: FC<IDocumentPart> = ({ selectedPart, document }) => {
//   const router = useRouter();

//   const getSelectedPartWithChapter = (selectedPart: string, document: DocumentContent) => {
//     for (const chapter of document?.chapters ?? []) {
//       const found = chapter.parts.find((part) => part.id === selectedPart);
//       if (found) {
//         return {
//           part: found,
//           chapter: chapter,
//         };
//       }
//     }
//     return null;
//   };

//   const partData = getSelectedPartWithChapter(selectedPart, document);

//   return (
//     <div className="flex flex-col space-y-3">
//       {partData &&
//         partData.part.sections.map((section, index) => (
//           <button
//             key={index}
//             onClick={() => router.push(`/chat/doc?sectionId=${section?.id}&partTitle=${encodeURIComponent(partData.part.partTitle)}&chapterTitle=${encodeURIComponent(partData.chapter.chapterTitle)}`)}
//             className="cursor-pointer text-left hover:bg-lightgrey w-full space-y-1 p-2 rounded-md transition-colors"
//           >
//             <p className="text-xs text-muted-foreground">
//               Section {section?.sectionNumber}
//             </p>
//             <p className="text-xs text-foreground line-clamp-1">
//               {keepLettersAndSpaces(section?.sectionTitle)}
//             </p>
//           </button>
//         ))}
//     </div>
//   );
// };
