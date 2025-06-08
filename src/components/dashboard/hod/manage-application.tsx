"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ManageApplicationsHOD() {
  const [data, setData] = useState<HODApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | null>(null);
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/od/hod/get-forwarded-applications");
      const json = await res.json();
      setData(json.odList || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleConfirmAction = async () => {
    if (!selectedId || !actionType) return;

    setSubmitting(true);

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

    setSubmitting(false);
    setSelectedId(null);
    setActionType(null);
    setRemark("");
  };

  const startAction = (id: string, action: "APPROVE" | "REJECT") => {
    setSelectedId(id);
    setActionType(action);
  };

  const columns = getColumns(
    (id) => startAction(id, "APPROVE"),
    (id) => startAction(id, "REJECT"),
    selectedId 
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

      {/* Modal for remarks */}
      <Dialog open={!!selectedId && !!actionType} onOpenChange={(open) => {
        if (!open) {
          setSelectedId(null);
          setActionType(null);
          setRemark("");
        }
      }}>
        <DialogContent className="backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>{actionType === "APPROVE" ? "Approve" : "Reject"} Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              maxLength={50}
              placeholder="Enter remark (optional)"
            />
            <p className="text-sm text-muted-foreground">{remark.length}/50 characters</p>
            <div className="flex justify-end gap-2">
              <Button onClick={handleConfirmAction} disabled={submitting}>
                {submitting ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedId(null);
                  setActionType(null);
                  setRemark("");
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
