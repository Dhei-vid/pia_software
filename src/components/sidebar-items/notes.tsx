import { FC, useEffect } from "react";
import { formatTimeAgo } from "@/common/helpers";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/api/notes/notes-type";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";

const SavedNotes = () => {
  const { notes, loading, error, getAllNotes, deleteNote } = useNotes();

  useEffect(() => {
    getAllNotes();
  }, [getAllNotes]);

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <div className="text-gray-400 text-sm">Loading notes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400 text-sm">Error loading notes: {error}</div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400 text-sm">No notes found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-[100%]">
      {notes.map((note) => (
        <NotesSideBarItems
          key={note.id}
          note={note}
          onDelete={handleDeleteNote}
        />
      ))}
    </div>
  );
};

export default SavedNotes;

interface INotesSideBarItems {
  note: Note;
  onDelete: (noteId: string) => void;
}

const NotesSideBarItems: FC<INotesSideBarItems> = ({ note, onDelete }) => {
  const handleNoteClick = () => {
    // You can navigate to a specific note view or do something else
    console.log("Note clicked:", note.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <div className="text-left flex flex-row gap-5 justify-between hover:bg-lightgrey cursor-pointer transition-all duration-200 ease-in-out rounded-md group">
      <div className="flex-1" onClick={handleNoteClick}>
        <p className="text-sm text-white truncate text-wrap line-clamp-2">
          {note.body}
        </p>
        <p className="text-xs text-nowrap text-gray-400 mt-1">
          {formatTimeAgo(new Date(note.createdAt))}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  );
};
