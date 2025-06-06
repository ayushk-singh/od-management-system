"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getColumns, HODApplication } from "./column";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageApplicationsHOD() {
  const [data, setData] = useState<HODApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/od/hod-applications");
      const json = await res.json();
      setData(json.odList || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/od/hod-action/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "APPROVE" }),
    });

    if (res.ok) {
      setData((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleReject = async (id: string) => {
    const res = await fetch(`/api/od/hod-action/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REJECT" }),
    });

    if (res.ok) {
      setData((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const table = useReactTable({
    data,
    columns: getColumns(handleApprove, handleReject),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const hasRows = table.getRowModel().rows.length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage OD Applications</h2>

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
                <TableHead className="text-white" key={header.id}>
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
          {loading ? (
            // Render 3 skeleton rows with 6 cells each (adjust as needed)
            Array.from({ length: 3 }).map((_, idx) => (
              <TableRow key={idx}>
                {Array.from({ length: table.getAllColumns().length }).map(
                  (_, cIdx) => (
                    <TableCell key={cIdx}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  )
                )}
              </TableRow>
            ))
          ) : hasRows ? (
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
              <TableCell
                colSpan={table.getAllColumns().length}
                className="text-center py-6 text-muted-foreground"
              >
                No Pending Application.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
