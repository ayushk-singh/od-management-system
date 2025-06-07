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
import { Button } from "@/components/ui/button";  // <-- import Button
import { toast } from "sonner";

export default function ManageApplicationsHOD() {
  const [data, setData] = useState<HODApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  // For handling remark input
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | null>(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/od/hod/get-forwarded-applications");
      const json = await res.json();
      setData(json.odList || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle submit of approve/reject with remark
  const handleConfirmAction = async () => {
    if (!selectedId || !actionType) return;

    const res = await fetch(`/api/od/hod/hod-action/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: actionType, remark }),
    });

    if (res.ok) {
      toast.success(`OD ${actionType === "APPROVE" ? "Approved" : "Rejected"}`);
      setData((prev) => prev.filter((d) => d.id !== selectedId));
    } else {
      toast.error(`Unable to ${actionType === "APPROVE" ? "Approve" : "Reject"}, Try again later`);
    }

    // Reset remark modal state
    setSelectedId(null);
    setActionType(null);
    setRemark("");
  };

  // Instead of direct handlers, now only set id + action to trigger remark input
  const startAction = (id: string, action: "APPROVE" | "REJECT") => {
    setSelectedId(id);
    setActionType(action);
  };

  const columns = getColumns(
    (id) => startAction(id, "APPROVE"),
    (id) => startAction(id, "REJECT")
  );

  const table = useReactTable({
    data,
    columns,
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

      <div className="rounded-lg overflow-hidden border">
        <Table>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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

      {/* Remark input modal/section */}
      {selectedId && actionType && (
        <div className="p-4 border rounded-md space-y-2 max-w-md">
          <p className="font-medium">
            Add remark for {actionType === "APPROVE" ? "approval" : "rejection"} (optional):
          </p>
          <Input
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter remark..."
          />
          <div className="flex gap-2">
            <Button onClick={handleConfirmAction}>Submit</Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedId(null);
                setActionType(null);
                setRemark("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
