"use client";

import Image from "next/image";
import { Input } from "../ui/input";
import { Search, RotateCw, Sun, Moon } from "lucide-react";
import { SetStateAction, Dispatch, FC, useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import UserProfile from "./user-profile";
import { HistoryData, Searches } from "@/api/documents/document-types";

import HistoryList from "../sidebar-items/history";
import NewTableOfContent from "../sidebar-items/new-table-of-content";
import { DocumentSection } from "@/api/documents/document-types";
import { useTheme } from "@/contexts/ThemeContext";
import { extractErrorMessage } from "@/common/helpers";

// API
import useAuth from "@/hooks/useAuth";
import { DocumentService } from "@/api/documents/document";
import { Spinner } from "../ui/spinner";

interface ILeftSideBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onSectionSelect?: (
    section: DocumentSection,
    chapterTitle: string,
    partTitle: string,
    sections: DocumentSection[],
    partId: string,
    documentId: string
  ) => void;
  selectedDocumentId?: string; 
  onDocumentChange?: (docId: string) => void; 
}

export const LeftSideBar: FC<ILeftSideBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSectionSelect,
  selectedDocumentId, 
  onDocumentChange, 
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [query, setQuery] = useState<HistoryData>();

  const [history, setHistory] = useState<Searches[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    if (isHistoryOpen) {
      fetchData(1);
      setHistory([]);
      setCurrentPage(1);
      setTotalPages(1);
      setHasMore(true);
    }
  }, [isHistoryOpen]);

  const fetchData = async (page: number) => {
    if (!user?.documents?.[0]?.id) return;
    // setIsLoading(true);
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    try {
      const historyResponse = await DocumentService.getSearchHistory(page, 10);
      // setQuery(historyResponse.data);
      if (historyResponse.success) {
        const newSearches = historyResponse.data.searches;
        const pagination = historyResponse.data.pagination;
        setQuery(historyResponse.data);
          
        console.log(`Received ${newSearches.length} items, total pages: ${pagination.pages}`);
          
        setHistory(prev => page === 1 ? newSearches : [...prev, ...newSearches]);
        setTotalPages(pagination.pages);
        setHasMore(page < pagination.pages);
        setCurrentPage(page);
      }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    console.log('Load more called', { hasMore, isLoadingMore, currentPage, totalPages });
    if (hasMore && !isLoadingMore && currentPage < totalPages) {
      fetchData(currentPage + 1);
    }
  }, [hasMore, isLoadingMore, currentPage, totalPages]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 space-y-4">
        {/* Logo */}
        <div>
          <Image src={"/logo.png"} alt={"Logo"} width={30} height={30} />
        </div>

        {/* Document Switcher - Add this if you want document switching */}
        {user?.documents && user.documents.length > 1 && onDocumentChange && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Select Document</label>
            <select
              value={selectedDocumentId || user?.documents?.[0]?.id}
              onChange={(e) => onDocumentChange(e.target.value)}
              className="w-full p-2 bg-dark border border-lightgrey rounded-md text-sm text-foreground"
            >
              {user.documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="New Query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark border-lightgrey text-foreground placeholder:text-muted-foreground focus:border-yellow-400"
            />
          </div>

          {/* History */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setIsHistoryOpen(true)}
              className="w-full justify-start text-foreground/70 hover:text-foreground hover:!bg-lightgrey py-6"
            >
              <RotateCw className={"mr-2"} size={8} />
              History
            </Button>
          </div>
        </div>
      </div>

      {/* Table of Content */}
      <NewTableOfContent 
        searchQuery={searchQuery}
        // onSectionSelect={onSectionSelect} 
      />

      {/* Fixed Footer Section */}
      <div className="w-full flex-shrink-0 p-6 border-t border-lightgrey">
        {/* Light Mode Toggle */}
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex flex-row items-center justify-start text-foreground/70">
            {theme === "dark" ? (
              <Moon className={"w-4 h-4 mr-3"} />
            ) : (
              <Sun className={"w-4 h-4 mr-3"} />
            )}

            <p className="text-sm">
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </p>
          </div>
          <Switch
            id={"lightmode"}
            checked={theme === "light"}
            onCheckedChange={() => {
              toggleTheme();
            }}
          />
        </div>

        {/* User Profile */}
        <UserProfile />
      </div>

      <GenericDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="History"
        position="left"
      >
        <div className="h-full overflow-y-auto">
        <HistoryList
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          // history={query?.searches ?? []}
          history={history}
          error={error}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        /> 
        </div>
      </GenericDrawer>
    </div>
  );
};

export default LeftSideBar;



// "use client";

// import Image from "next/image";
// import { Input } from "../ui/input";
// import { Search, RotateCw, Sun, Moon } from "lucide-react";
// import { SetStateAction, Dispatch, FC, useState, useEffect, useRef } from "react";
// import { Button } from "../ui/button";
// import { Switch } from "@/components/ui/switch";
// import { GenericDrawer } from "@/components/ui/generic-drawer";
// import UserProfile from "./user-profile";
// import { HistoryData } from "@/api/documents/document-types";

// import HistoryList from "../sidebar-items/history";
// import NewTableOfContent from "../sidebar-items/new-table-of-content";
// import TableOfContent from "../sidebar-items/table-of-content";
// import { DocumentSection } from "@/utils/documentParser";
// import { useTheme } from "@/contexts/ThemeContext";
// import { extractErrorMessage } from "@/common/helpers";

// // API
// import useAuth from "@/hooks/useAuth";
// import { DocumentService } from "@/api/documents/document";

// interface ILeftSideBarProps {
//   searchQuery: string;
//   setSearchQuery: Dispatch<SetStateAction<string>>;
//   onSectionSelect?: (
//     section: DocumentSection,
//     chapterTitle: string,
//     partTitle: string,
//     sections: DocumentSection[],
//     partId: string
//   ) => void;
// }

// export const LeftSideBar: FC<ILeftSideBarProps> = ({
//   searchQuery,
//   setSearchQuery,
//   onSectionSelect,
// }) => {
//   const { user } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [isHistoryOpen, setIsHistoryOpen] = useState(false);
//   const [query, setQuery] = useState<HistoryData>();
//   const [documentContent, setDocumentContent] = useState(null);
//   const [hasLoadedDocuments, setHasLoadedDocuments] = useState(false); 
//   const fetchAttemptedRef = useRef(false);

//   console.log("User in LeftSideBar:", user);
//  const firstDocumentId = user?.documents?.[0]?.id;
// console.log
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!firstDocumentId) return;
//       setIsLoading(true);
//       try {
//         // const firstDocumentId = user.documents[0]?.id;
//         // const secondDocumentId = user.documents[1]?.id;

//         const historyResponse = await DocumentService.getSearchHistory();
//         const documentContent = await DocumentService.getAllDocumentContent(
//           firstDocumentId,
//           "structured"
//         );
//         setQuery(historyResponse.data);
//         setDocumentContent(documentContent.data.content);
//       } catch (error) {
//         const errorMessage = extractErrorMessage(error);
//         setError(errorMessage);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [isHistoryOpen, user]);

//   console.log("Document Data ", documentContent);
//   console.log("history Data ", query);

//   return (
//     <div className="h-full flex flex-col overflow-hidden">
//       {/* Fixed Header Section */}
//       <div className="flex-shrink-0 p-6 space-y-4">
//         {/* Logo */}
//         <div>
//           <Image src={"/logo.png"} alt={"Logo"} width={30} height={30} />
//         </div>

//         {/* Search Bar */}
//         <div className="space-y-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//             <Input
//               placeholder="New Query"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 bg-dark border-lightgrey text-foreground placeholder:text-muted-foreground focus:border-yellow-400"
//             />
//           </div>

//           {/* History */}
//           <div>
//             <Button
//               variant="ghost"
//               onClick={() => setIsHistoryOpen(true)}
//               className="w-full justify-start text-foreground/70 hover:text-foreground hover:!bg-lightgrey py-6"
//             >
//               <RotateCw className={"mr-2"} size={8} />
//               History
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Table of Content */}
//       <NewTableOfContent 
//         searchQuery={searchQuery}
//         onSectionSelect={() => onSectionSelect} 
//       />

//       {/* Fixed Footer Section */}
//       <div className="w-full flex-shrink-0 p-6 border-t border-lightgrey">
//         {/* Light Mode Toggle */}
//         <div className="flex flex-row items-center justify-between mb-8">
//           <div className="flex flex-row items-center justify-start text-foreground/70">
//             {theme === "dark" ? (
//               <Moon className={"w-4 h-4 mr-3"} />
//             ) : (
//               <Sun className={"w-4 h-4 mr-3"} />
//             )}

//             <p className="text-sm">
//               {theme === "dark" ? "Dark mode" : "Light mode"}
//             </p>
//           </div>
//           <Switch
//             id={"lightmode"}
//             checked={theme === "light"}
//             onCheckedChange={() => {
//               toggleTheme();
//             }}
//           />
//         </div>

//         {/* User Profile */}
//         <UserProfile />
//       </div>

//       {/* History Drawer */}
//       <GenericDrawer
//         isOpen={isHistoryOpen}
//         onClose={() => setIsHistoryOpen(false)}
//         title="History"
//         position="left"
//       >
//         <HistoryList
//           isLoading={isLoading}
//           history={query?.searches ?? []}
//           error={error}
//         />
//       </GenericDrawer>
//     </div>
//   );
// };
