"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import DocumentViewer from "@/components/general/document-viewer";
import LoadingSpinner from "@/components/ui/loading";
import { DocumentService } from "@/api/documents/document";
import {
  DocumentContent,
} from "@/api/documents/document-types";
import useAuth from "@/hooks/useAuth";


export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const sectionId = searchParams.get("sectionId");
  const chapterTitle = searchParams.get("chapterTitle");
  const partTitle = searchParams.get("partTitle");
  const docId = searchParams.get("docId"); 
  const { user } = useAuth();

  // console.log('section ID', sectionId);
  // console.log('Chapter title ', chapterTitle);
  // console.log('Part title ', partTitle);
  // console.log('Document ID ', docId);

  const [documentContent, setDocumentContent] = useState<DocumentContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const documentId = docId || user?.documents?.[0]?.id;
  
  useEffect(() => {
    if (!documentId) return;
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await DocumentService.getAllDocumentContent(
          documentId,
          "structured"
        );
        if (isMounted && response.success && response.data?.content) {
          setDocumentContent(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching document content:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [documentId]);


  const resolved = useMemo(() => {
    if (!sectionId || !documentContent?.chapters) return null;
    for (const chapter of documentContent.chapters) {
      if (!Array.isArray(chapter?.parts)) continue;
      for (const part of chapter.parts) {
        if (!Array.isArray(part?.sections)) continue;
        const index = part.sections.findIndex((s) => s?.id === sectionId);
        if (index !== -1) {
          return {
            part,
            chapter,
            section: part.sections[index],
            sectionIndex: index,
            totalSections: part.sections.length,
          };
        }
      }
    }

    return null;
  }, [documentContent?.chapters, sectionId]);

  const part = resolved?.part ?? null;
  const chapter = resolved?.chapter ?? null;
  const section = resolved?.section ?? null;
  const currentSectionIndex = resolved?.sectionIndex ?? 0;
  const totalSections = resolved?.totalSections ?? 0;

  const {
    previousSectionTitle,
    nextSectionTitle,
    previousSectionNumber,
    nextSectionNumber,
  } = useMemo(() => {
    if (!part || !Array.isArray(part.sections)) {
      return {
        previousSectionTitle: "",
        nextSectionTitle: "",
        previousSectionNumber: 0,
        nextSectionNumber: 0,
      };
    }

    const prev =
      currentSectionIndex > 0 ? part.sections[currentSectionIndex - 1] : null;

    const next =
      currentSectionIndex < part.sections.length - 1
        ? part.sections[currentSectionIndex + 1]
        : null;

    return {
      previousSectionTitle: prev?.sectionTitle ?? "",
      nextSectionTitle: next?.sectionTitle ?? "",
      previousSectionNumber: prev?.sectionNumber ?? 0,
      nextSectionNumber: next?.sectionNumber ?? 0,
    };
  }, [part, currentSectionIndex]);

  const handlePreviousSection = () => {
    if (!part || !chapter || currentSectionIndex <= 0) return;

    const target = part.sections[currentSectionIndex - 1];
    if (target?.id) {
      startTransition(() => {
        const params = new URLSearchParams({
          sectionId: target.id,
          partTitle: part.partTitle,
          chapterTitle: chapter.chapterTitle,
          docId: documentId || "", 
        });
        router.push(`/chat/doc?${params.toString()}`);
      });
    }
  };

  const handleNextSection = () => {
    if (!part || !chapter || currentSectionIndex >= part.sections.length - 1) return;

    const target = part.sections[currentSectionIndex + 1];
    if (target?.id) {
      startTransition(() => {
        const params = new URLSearchParams({
          sectionId: target.id,
          partTitle: part.partTitle,
          chapterTitle: chapter.chapterTitle,
          docId: documentId || "", 
        });
        router.push(`/chat/doc?${params.toString()}`);
      });
    }
  };

  if (isLoading || (sectionId && !documentContent)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <p className="text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/chat")}
        className="cursor-pointer flex items-center text-sm space-x-2 text-gray-300 hover:text-white transition-colors mb-6 rounded-md border p-2"
      >
        <ChevronLeft size={18} />
        <span>Back to Chat</span>
      </button>

      <DocumentViewer
        documentContent={documentContent}
        sectionId={sectionId}
        chapterTitle={chapter?.chapterTitle ?? chapterTitle ?? null}
        partTitle={part?.partTitle ?? partTitle ?? null}
        sectionTitle={section?.sectionTitle ?? null}
        previousSectionTitle={previousSectionTitle}
        nextSectionTitle={nextSectionTitle}
        previousSectionNumber={previousSectionNumber}
        nextSectionNumber={nextSectionNumber}
        currentSectionIndex={currentSectionIndex}
        totalSections={totalSections}
        onPreviousSection={handlePreviousSection}
        onNextSection={handleNextSection}
        onSearch={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
      />
    </div>
  );
}





//Previous code before refactor to support multiple documents and section selection callback:


// "use client";

// import { useState, useEffect, useMemo, useTransition } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { ChevronLeft } from "lucide-react";

// import DocumentViewer from "@/components/general/document-viewer";
// import LoadingSpinner from "@/components/ui/loading";
// import { DocumentService } from "@/api/documents/document";
// import {
//   DocumentContent,
//   DocumentChapter,
//   DocumentSection,
// } from "@/api/documents/document-types";
// import useAuth from "@/hooks/useAuth";


// export default function Page() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isPending, startTransition] = useTransition();
//   const sectionId = searchParams.get("sectionId");
//   const chapterTitle = searchParams.get("chapterTitle");
//   const partTitle = searchParams.get("partTitle");
//   const selectedDocId = searchParams.get("docId");
//   const { user } = useAuth();

//   console.log('section ID', sectionId)
//   console.log('Chapter title ', chapterTitle)
//   console.log('Part title ', partTitle)

//   const [documentContent, setDocumentContent] =
//     useState<DocumentContent | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [availableDocuments, setAvailableDocuments] = useState(user?.documents || []);

//   /**
//    * Fetch document content
//    */
//    const documentId = selectedDocId || user?.documents?.[1]?.id; 
//   useEffect(() => {
//     if (!documentId) return;

//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         const response = await DocumentService.getAllDocumentContent(
//           documentId,
//           "structured"
//         );

//         if (isMounted && response.success && response.data?.content) {
//           setDocumentContent(response.data.content);
//         }
//       } catch (error) {
//         console.error("Error fetching document content:", error);
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [documentId]);

//   /**
//    * Resolve section context
//    */
//   const resolved = useMemo(() => {
//     if (!sectionId || !documentContent?.chapters) return null;

//     for (const chapter of documentContent.chapters) {
//       if (!Array.isArray(chapter?.parts)) continue;

//       for (const part of chapter.parts) {
//         if (!Array.isArray(part?.sections)) continue;

//         const index = part.sections.findIndex((s) => s?.id === sectionId);

//         if (index !== -1) {
//           return {
//             part,
//             chapter,
//             section: part.sections[index],
//             sectionIndex: index,
//             totalSections: part.sections.length,
//           };
//         }
//       }
//     }

//     return null;
//   }, [documentContent?.chapters, sectionId]);

//   const part = resolved?.part ?? null;
//   const chapter = resolved?.chapter ?? null;
//   const section = resolved?.section ?? null;
//   const currentSectionIndex = resolved?.sectionIndex ?? 0;
//   const totalSections = resolved?.totalSections ?? 0;

//   /**
//    * Previous / next section metadata
//    */
//   const {
//     previousSectionTitle,
//     nextSectionTitle,
//     previousSectionNumber,
//     nextSectionNumber,
//   } = useMemo(() => {
//     if (!part || !Array.isArray(part.sections)) {
//       return {
//         previousSectionTitle: "",
//         nextSectionTitle: "",
//         previousSectionNumber: 0,
//         nextSectionNumber: 0,
//       };
//     }

//     const prev =
//       currentSectionIndex > 0 ? part.sections[currentSectionIndex - 1] : null;

//     const next =
//       currentSectionIndex < part.sections.length - 1
//         ? part.sections[currentSectionIndex + 1]
//         : null;

//     return {
//       previousSectionTitle: prev?.sectionTitle ?? "",
//       nextSectionTitle: next?.sectionTitle ?? "",
//       previousSectionNumber: prev?.sectionNumber ?? 0,
//       nextSectionNumber: next?.sectionNumber ?? 0,
//     };
//   }, [part, currentSectionIndex]);

//   /**
//    * Navigation handlers
//    */
//   const handlePreviousSection = () => {
//     if (!part || !chapter || currentSectionIndex <= 0) return;

//     const target = part.sections[currentSectionIndex - 1];
//     if (target?.id) {
//       startTransition(() => {
//         const params = new URLSearchParams({
//           sectionId: target.id,
//           partTitle: part.partTitle,
//           chapterTitle: chapter.chapterTitle,
//         });
//         router.push(`/chat/doc?${params.toString()}`);
//       });
//     }
//   };

//   const handleNextSection = () => {
//     if (!part || !chapter || currentSectionIndex >= part.sections.length - 1) return;

//     const target = part.sections[currentSectionIndex + 1];
//     if (target?.id) {
//       startTransition(() => {
//         const params = new URLSearchParams({
//           sectionId: target.id,
//           partTitle: part.partTitle,
//           chapterTitle: chapter.chapterTitle,
//         });
//         router.push(`/chat/doc?${params.toString()}`);
//       });
//     }
//   };

//   /**
//    * Loading state
//    */
//   if (isLoading || (sectionId && !documentContent)) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="flex items-center gap-2">
//           <LoadingSpinner size="sm" />
//           <p className="text-gray-400">Loading document...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Back Button */}
//       <button
//         onClick={() => router.push("/chat")}
//         className="cursor-pointer flex items-center text-sm space-x-2 text-gray-300 hover:text-white transition-colors mb-6 rounded-md border p-2"
//       >
//         <ChevronLeft size={18} />
//         <span>Back to Chat</span>
//       </button>

//       <DocumentViewer
//         documentContent={documentContent}
//         sectionId={sectionId}
//         chapterTitle={chapter?.chapterTitle ?? chapterTitle ?? null}
//         partTitle={part?.partTitle ?? partTitle ?? null}
//         sectionTitle={section?.sectionTitle ?? null}
//         previousSectionTitle={previousSectionTitle}
//         nextSectionTitle={nextSectionTitle}
//         previousSectionNumber={previousSectionNumber}
//         nextSectionNumber={nextSectionNumber}
//         currentSectionIndex={currentSectionIndex}
//         totalSections={totalSections}
//         onPreviousSection={handlePreviousSection}
//         onNextSection={handleNextSection}
//         onSearch={() => {}}
//         searchQuery=""
//         setSearchQuery={() => {}}
//       />
//     </div>
//   );
// }
