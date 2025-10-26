"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NoteCard from "@/components/ui/note-card";
import { useNotes } from "@/hooks/useNotes";
import { toast } from "sonner";
import { EditNoteDialog } from "@/components/modals/edit-note-dialog";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-dialog";
import DateFilter from "@/components/general/date-filter";

export default function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("7");
  const [editingNote, setEditingNote] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { notes, getAllNotes, deleteNote, updateNote, loading, error } =
    useNotes();

  // Fetch notes once
  useEffect(() => {
    getAllNotes().catch((err) => console.error("Error fetching notes:", err));
  }, []);

  /** ============  CRUD HANDLERS ============ **/
  const handleEditNote = (id: string) => {
    const note = notes?.find((n) => n.id === id);
    if (note) setEditingNote({ id, content: note.body });
  };

  const handleSaveEdit = async (content: string) => {
    if (!editingNote || !content.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    try {
      await updateNote(editingNote.id, { body: content });
      await getAllNotes();
      toast.success("Note updated successfully");
      setEditingNote(null);
    } catch (error) {
      toast.error("Failed to update note");
      throw error;
    }
  };

  const handleDeleteNote = (id: string) => setDeleteNoteId(id);

  const handleConfirmDelete = async () => {
    if (!deleteNoteId) return;
    setIsDeleting(true);
    try {
      await deleteNote(deleteNoteId);
      toast.success("Note deleted successfully");
      setDeleteNoteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewLinked = (href: string) => {
    toast.info(`Navigating to: ${href}`);
  };

  /** ============  FILTER LOGIC ============ **/
  const filteredNotes = useMemo(() => {
    if (!notes) return [];

    const now = new Date();
    let cutoffDate = new Date(0); // default = show all

    if (timeFilter !== "all") {
      const days = Number(timeFilter);
      cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    return notes.filter((note) => {
      const noteDate = new Date(note.createdAt);
      const withinRange = timeFilter === "all" || noteDate >= cutoffDate;

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        note.body?.toLowerCase().includes(query) ||
        note.document?.title?.toLowerCase().includes(query);

      return withinRange && matchesSearch;
    });
  }, [notes, timeFilter, searchQuery]);

  /** ============  RENDER ============ **/
  return (
    <div className="space-y-8">
      <div>
        <Button onClick={() => router.back()}>Back</Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif text-white">
          Saved Notes
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {loading && notes.length === 0 && (
        <div className="text-center text-gray-400 py-4">Loading notes...</div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder="Search your notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-gray-700 text-white placeholder:text-gray-400 focus:border-yellow-400 h-12"
        />

        <DateFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      </div>

      {/* Notes */}
      <div className="space-y-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              linkedSection={
                note.document ? { title: note.document.title } : undefined
              }
              content={note.body}
              timestamp={note.createdAt}
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
                : "No notes available for the selected time period"}
            </p>
          </div>
        )}
      </div>

      <EditNoteDialog
        open={!!editingNote}
        currentContent={editingNote?.content || ""}
        onClose={() => setEditingNote(null)}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationDialog
        open={!!deleteNoteId}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        onClose={() => setDeleteNoteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
