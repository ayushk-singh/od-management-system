"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type OdApplication = {
  id: string;
  dateFrom: string;
  dateTo: string;
  totalDays: number;
  reason: string;
  location: string;
  status: string;
  faculty?: { name: string };
};

export const getColumns = (
  onDelete: (id: string) => void,
  onEdit: (id: string) => void
): ColumnDef<OdApplication>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "dateFrom",
    header: "Date From",
    cell: ({ row }) => format(new Date(row.original.dateFrom), "PPP"),
  },
  {
    accessorKey: "dateTo",
    header: "Date To",
    cell: ({ row }) => format(new Date(row.original.dateTo), "PPP"),
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "faculty",
    header: "Applied To",
    cell: ({ row }) => row.original.faculty?.name || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`${
            status === "PENDING"
              ? "text-yellow-600 font-semibold"
              : status.includes("APPROVED")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const status = row.original.status;
      const isPending = status === "PENDING";

      return (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(id)} disabled={!isPending}>
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={!isPending} variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Application</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Are you sure you want to delete
                  OD - {id}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(id)}>
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
