"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import { ExpandableCell } from "@/components/ui/expandable-cell";

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
  facultyRemark: string;
  hodRemark: string;
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
    cell: ({ row }) => (
      <ExpandableCell text={row.original.reason} limit={50} />
    ),
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
    accessorKey: "facultyRemark",
    header: "Faculty Remark",
    cell: ({ row }) => (
      <ExpandableCell text={row.original.facultyRemark} limit={30} />
    ),
  },
  {
    accessorKey: "hodRemark",
    header: "HOD Remark",
    cell: ({ row }) => (
      <ExpandableCell text={row.original.hodRemark} limit={30} />
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      let variant: "outline" | "destructive" | "secondary" | "default" =
        "default";
      let bgColorClass = "";
      let IconComponent = null;

      if (status === "PENDING") {
        variant = "outline";
        bgColorClass = "bg-yellow-600 text-white";
        IconComponent = IconClock;
      } else if (status.includes("APPROVED")) {
        variant = "outline";
        bgColorClass = "bg-accent text-white";
        IconComponent = IconCheck;
      } else if (status.includes("REJECTED")) {
        variant = "destructive";
        bgColorClass = "";
        IconComponent = IconX;
      }

      return (
        <Badge
          variant={variant}
          className={`${bgColorClass} font-semibold flex items-center gap-1`}
        >
          {IconComponent && <IconComponent className="w-4 h-4" />}
          {status}
        </Badge>
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

      const handleDownload = () => {
        const url = `/api/od/utils/generate-od-pdf/${id}`;
        window.open(url, "_blank", "noopener,noreferrer");
      };

      return (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(id)} disabled={!isPending}>
            Edit
          </Button>

          <Button size="sm" onClick={handleDownload} variant="default">
            Download
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
