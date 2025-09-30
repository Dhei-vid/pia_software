"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoteCard from "@/components/ui/note-card";
import { toast } from "sonner";

// Sample notes data based on the image
const sampleNotes = [
  {
    id: "1",
    linkedSection: {
      title: "Section 86: Application for a Mining Lease",
      href: "/section/86",
    },
    excerpt:
      "2. A petroleum mining lease shall be granted under sections 70 (2) and 74 of this Act, where a prospe...",
    content:
      "Follow up with legal on the required documentation for this application. See more details from the commission and make your notes clear.",
    timestamp: new Date("2025-08-25T14:30:00"),
  },
  {
    id: "2",
    content:
      "Need to cross-reference with petroleum operations chapter for complete understanding.",
    timestamp: new Date("2025-08-25T14:30:00"),
  },
  {
    id: "3",
    content:
      "Need to cross-reference with petroleum operations chapter for complete understanding.",
    timestamp: new Date("2025-08-25T14:30:00"),
  },
];

export default function Page() {
  const [notes, setNotes] = useState(sampleNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("7");

  const handleEditNote = (id: string) => {
    toast.info("Edit functionality will be implemented");
    console.log("Editing note:", id);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    toast.success("Note deleted successfully");
  };

  const handleViewLinked = (href: string) => {
    toast.info(`Navigating to: ${href}`);
    console.log("Viewing linked section:", href);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.linkedSection?.title &&
        note.linkedSection.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-white mb-2">
          Saved Notes
        </h1>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search your notes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-gray-700 text-white placeholder:text-gray-400 focus:border-yellow-400 h-12"
          />
        </div>
        <div className="">
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
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              linkedSection={note.linkedSection}
              excerpt={note.excerpt}
              content={note.content}
              timestamp={note.timestamp}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onViewLinked={handleViewLinked}
            />
          ))
        ) : (
          <div className="bg-dark border border-gray-700 rounded-xl p-6 text-center">
            <p className="text-gray-400">
              {searchQuery
                ? "No notes found matching your search"
                : "No notes available"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
