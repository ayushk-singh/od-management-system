"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getColumns, OdApplication } from "./column";
import SkeletonTable from "@/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EditOdDialog } from "@/components/dashboard/student/edit-od-dialog";

export default function MyApplications() {
  const [data, setData] = useState<OdApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<OdApplication | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/od/my-applications");
      const json = await res.json();
      setData(json.odList || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/od/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to delete");
      }

      // Remove from local state only after successful deletion
      setData((prev) => prev.filter((od) => od.id !== id));
      console.log("Deleted:", id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert(
        "Failed to delete OD application. Make sure it's in PENDING status."
      );
    }
  };

  const handleEdit = (id: string) => {
    const target = data.find((d) => d.id === id);
    if (target) {
      setEditData(target);
      setEditDialogOpen(true);
    }
  };

  const handleEditSubmit = async (updated: OdApplication) => {
    // call your API
    await fetch(`/api/od/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    // update local state
    setData((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setEditDialogOpen(false);
  };

  const columns = getColumns(handleDelete, handleEdit);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) return <SkeletonTable />;

  return (
    <>
      <div className="space-y-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Table className="border rounded-md">
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditOdDialog
        open={editDialogOpen}
        initialData={editData}
        onCancel={() => setEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </>
  );
}
