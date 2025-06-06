"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type FacultyOdApplication = {
  id: string;
  student: { name: string; registerNo: string };
  reason: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  status: string;
};

export default function ManageApplications() {
  const [data, setData] = useState<FacultyOdApplication[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/od/faculty/get-pending-applications");
        const json = await res.json();
        setData(json.odList || []);
      } catch (error) {
        console.error("Error loading OD applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (id: string, action: "APPROVE" | "REJECT" | "FORWARD") => {
    const res = await fetch(`/api/od/faculty/faculty-action/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      toast.success("Status Updated Successfully")
      setData(prev => prev.map(app => app.id === id ? { ...app, status: `UPDATED_${action}` } : app));
    } else {
      toast.error("Action failed");
    }
  };

  const columns: ColumnDef<FacultyOdApplication>[] = [
    { accessorKey: "student.name", header: "Student" },
    { accessorKey: "student.registerNo", header: "Reg. No." },
    { accessorKey: "reason", header: "Reason" },
    { accessorKey: "location", header: "Location" },
    {
      accessorKey: "dateFrom",
      header: "From",
      cell: ({ row }) => format(new Date(row.original.dateFrom), "PPP"),
    },
    {
      accessorKey: "dateTo",
      header: "To",
      cell: ({ row }) => format(new Date(row.original.dateTo), "PPP"),
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id, status } = row.original;
        if (status !== "PENDING") return null;

        return (
          <div className="flex gap-2">
            <Button size="sm" className="bg-accent hover:bg-accebt/70" onClick={() => handleAction(id, "APPROVE")}>Approve</Button>
            <Button size="sm" className="bg-destructive hover:bg-destructive/70" onClick={() => handleAction(id, "REJECT")}>Reject</Button>
            <Button size="sm" className="bg-primary hover:bg-primary/70" onClick={() => handleAction(id, "FORWARD")}>Forward to HOD</Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
        disabled={loading}
      />

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-2">
              {[...Array(7)].map((_, j) => (
                <Skeleton key={j} className="h-6 w-full rounded bg-secondary" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border">
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead className="text-white" key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  No Pending Application.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      )}
    </div>
  );
}
