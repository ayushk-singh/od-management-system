"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  PaginationState,
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MyApplications() {
  const [data, setData] = useState<OdApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<OdApplication | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/od/student/get-od");
      const json = await res.json();
      setData(json.odList || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/od/student/delete-od/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to delete");
      }

      setData((prev) => prev.filter((od) => od.id !== id));
      toast.success("OD Deleted Successfully", {
        duration: Infinity,
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    } catch (error) {
      toast.error(`Delete failed:, ${error}`, {
        duration: Infinity,
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
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
  try {
    const res = await fetch(`/api/od/student/update-od/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!res.ok) {
      throw new Error("Failed to update OD application");
    }

    const data = await res.json();

    setData((prev) =>
      prev.map((d) => (d.id === updated.id ? data.updated : d))
    );
    setEditDialogOpen(false);
    toast.success("OD application updated successfully!");
  } catch (error) {
    toast.error(`Failed to update OD application. Please try again. Erro: ${error}`);
  }
};

  const filteredData = data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(globalFilter.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const columns = getColumns(handleDelete, handleEdit);

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  if (loading) return <SkeletonTable />;

  return (
    <>
      <div className="space-y-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
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

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            disabled={pagination.pageIndex === 0}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex - 1,
              }))
            }
          >
            Previous
          </Button>
          <span>
            Page {pagination.pageIndex + 1} of{" "}
            {Math.max(1, Math.ceil(filteredData.length / pagination.pageSize))}
          </span>
          <Button
            variant="outline"
            disabled={
              (pagination.pageIndex + 1) * pagination.pageSize >=
              filteredData.length
            }
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
          >
            Next
          </Button>
        </div>
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
