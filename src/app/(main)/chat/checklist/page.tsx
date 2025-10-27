"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DateFilter from "@/components/general/date-filter";
import { Input } from "@/components/ui/input";
import ChecklistCard from "@/components/ui/checklist-card";
import { DeleteConfirmationDialog } from "@/components/modals/delete-confirmation-dialog";
import { EditChecklistDialog } from "@/components/modals/edit-checklist-dialog";
import { useChecklists } from "@/hooks/useChecklists";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { extractErrorMessage } from "@/common/helpers";

export default function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("7");
  const [editingChecklist, setEditingChecklist] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleteChecklistId, setDeleteChecklistId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useUser();
  const {
    checklists,
    fetchChecklists,
    loading,
    error,
    updateChecklist,
    deleteChecklist,
  } = useChecklists();

  useEffect(() => {
    (async () => {
      if (!user) return;

      await fetchChecklists(user?.documentId);
    })();
  }, [user, fetchChecklists]);

  // Filter checklists based on time filter and search query
  const filteredChecklists = useMemo(() => {
    if (!checklists) return [];

    const now = new Date();
    let cutoffDate = new Date(0); // default = show all

    if (timeFilter !== "all") {
      const days = Number(timeFilter);
      cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    return checklists.filter((checklist) => {
      const checklistDate = new Date(checklist.createdAt);
      const withinRange = timeFilter === "all" || checklistDate >= cutoffDate;

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query || checklist.item?.toLowerCase().includes(query);

      return withinRange && matchesSearch;
    });
  }, [checklists, timeFilter, searchQuery]);

  const handleToggle = async (id: string) => {
    const checklist = checklists?.find((c) => c.id === id);
    if (checklist) {
      try {
        await updateChecklist(id, { completed: !checklist.completed });
        toast.success("Checklist updated");
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        toast.error(`Failed to update checklist: ${errorMessage}`);
      }
    }
  };

  const handleEdit = (id: string) => {
    const checklist = checklists?.find((c) => c.id === id);
    if (checklist) {
      setEditingChecklist({ id, title: checklist.item });
    }
  };

  const handleSaveEdit = async (title: string) => {
    if (!editingChecklist || !title.trim()) {
      toast.error("Checklist title cannot be empty");
      return;
    }

    try {
      await updateChecklist(editingChecklist.id, { name: title });
      toast.success("Checklist updated successfully");
      setEditingChecklist(null);
    } catch (error) {
      toast.error("Failed to update checklist");
      throw error;
    }
  };

  const handleAddNote = (id: string) => {
    // TODO: Implement add note functionality
    toast.info("Add note functionality coming soon");
  };

  const handleDelete = (id: string) => {
    setDeleteChecklistId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteChecklistId) return;

    setIsDeleting(true);
    try {
      await deleteChecklist(deleteChecklistId);
      toast.success("Checklist deleted successfully");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to delete checklist: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setDeleteChecklistId(null);
    }
  };

  const handleViewLinked = (documentId: string) => {
    router.push(`/chat/doc/${documentId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif text-white">
          Checklist
        </h1>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Loading indicator */}
      {loading && checklists.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          Loading checklists...
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder="Search your checklists"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-gray-700 text-white placeholder:text-gray-400 focus:border-yellow-400 h-12"
        />

        <DateFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      </div>

      {/* Checklists */}
      <div className="space-y-6">
        {filteredChecklists.length > 0 ? (
          filteredChecklists.map((checklist) => (
            <ChecklistCard
              key={checklist.id}
              id={checklist.id}
              title={checklist.item}
              completed={checklist.completed}
              document={checklist.document}
              content={checklist.item ?? "No checklist content available."}
              timestamp={checklist.createdAt}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onAddNote={handleAddNote}
              onDelete={handleDelete}
              onViewLinked={handleViewLinked}
            />
          ))
        ) : (
          <div className="bg-dark border border-gray-700 rounded-xl p-6 text-center">
            <p className="text-gray-400">
              {searchQuery
                ? "No checklists found matching your search"
                : "No checklists available"}
            </p>
          </div>
        )}
      </div>

      {/* Edit Checklist Dialog */}
      <EditChecklistDialog
        open={!!editingChecklist}
        currentTitle={editingChecklist?.title || ""}
        onClose={() => setEditingChecklist(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deleteChecklistId}
        title="Delete Checklist"
        description="Are you sure you want to delete this checklist? This action cannot be undone."
        onClose={() => setDeleteChecklistId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
