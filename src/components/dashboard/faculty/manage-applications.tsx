"use client";

import { useEffect, useState, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

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
  const [remark, setRemark] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "APPROVE" | "REJECT" | "FORWARD" | null
  >(null);
  const [submitting, setSubmitting] = useState(false);
  const remarkInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (selectedId && remarkInputRef.current) {
      remarkInputRef.current.focus();
    }
  }, [selectedId]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key === "Escape") cancelAction();
      else if (e.key === "Enter" && !isSubmitDisabled()) handleConfirmAction();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId, remark, actionType]);

  const isSubmitDisabled = () =>
    (actionType === "REJECT" || actionType === "FORWARD")
      ? remark.trim().length === 0 || submitting
      : submitting;

  const cancelAction = () => {
    setSelectedId(null);
    setActionType(null);
    setRemark("");
    setSubmitting(false);
  };

  const handleConfirmAction = async () => {
    if (!selectedId || !actionType) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/od/faculty/faculty-action/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType, remark }),
      });

      if (res.ok) {
        toast.success("Status Updated Successfully");
        setData((prev) => prev.filter((app) => app.id !== selectedId));
        cancelAction();
      } else {
        toast.error("Action failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
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

        const isActioning = submitting && selectedId === id;

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={submitting}
              className="bg-accent hover:bg-accent/80"
              onClick={() => {
                setSelectedId(id);
                setActionType("APPROVE");
              }}
            >
              {isActioning && actionType === "APPROVE" ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Approve"
              )}
            </Button>
            <Button
              size="sm"
              disabled={submitting}
              className="bg-destructive hover:bg-destructive/80"
              onClick={() => {
                setSelectedId(id);
                setActionType("REJECT");
              }}
            >
              {isActioning && actionType === "REJECT" ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Reject"
              )}
            </Button>
            <Button
              size="sm"
              disabled={submitting}
              onClick={() => {
                setSelectedId(id);
                setActionType("FORWARD");
              }}
            >
              {isActioning && actionType === "FORWARD" ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Forward to HOD"
              )}
            </Button>
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
    <div className="space-y-4 relative">
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
                <div key={j} className="h-6 w-full rounded bg-secondary" />
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

      {/* Modal backdrop with blur */}
      {selectedId && actionType && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={cancelAction}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title" className="text-lg font-semibold mb-4">
              {actionType === "APPROVE" && "Approve Application"}
              {actionType === "REJECT" && "Reject Application"}
              {actionType === "FORWARD" && "Forward to HOD"}
            </h2>

            <label htmlFor="remark" className="block font-medium mb-1">
              Remark {actionType !== "APPROVE" ? "(required)" : "(optional)"}
            </label>
            <Input
              id="remark"
              ref={remarkInputRef}
              value={remark}
              maxLength={50}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter remark..."
              disabled={submitting}
            />
            <p className="text-sm text-muted-foreground mb-4">
              {remark.length}/50 characters
            </p>

            <div className="flex justify-end gap-3">
              <Button
                onClick={handleConfirmAction}
                disabled={isSubmitDisabled()}
              >
                {submitting ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={cancelAction}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
