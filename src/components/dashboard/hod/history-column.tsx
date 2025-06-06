import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { IconCheck, IconX, IconClock } from "@tabler/icons-react";
import { cn } from "@/lib/utils"; 
import { ReactElement } from "react";

export type HODHistoryRow = {
  id: string;
  dateFrom: string;
  dateTo: string;
  reason: string;
  location: string;
  student: { name: string; registerNo: string };
  faculty: { name: string };
  hodReviewedAt: string;
  status: string;
};

export const columns: ColumnDef<HODHistoryRow>[] = [
  {
    header: "Student",
    accessorKey: "student",
    cell: ({ row }) =>
      `${row.original.student.name} (${row.original.student.registerNo})`,
  },
  {
    header: "Faculty",
    accessorKey: "faculty",
    cell: ({ row }) => row.original.faculty.name,
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "Reason",
    accessorKey: "reason",
  },
  {
    header: "From",
    accessorKey: "dateFrom",
    cell: ({ row }) => format(new Date(row.original.dateFrom), "PPP"),
  },
  {
    header: "To",
    accessorKey: "dateTo",
    cell: ({ row }) => format(new Date(row.original.dateTo), "PPP"),
  },
  {
    header: "Action Date",
    accessorKey: "hodReviewedAt",
    cell: ({ row }) =>
      row.original.hodReviewedAt
        ? format(new Date(row.original.hodReviewedAt), "PPPpp")
        : "-",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusMap: Record<
        string,
        { label: string; color: string; icon: ReactElement }
      > = {
        APPROVED_BY_HOD: {
          label: "Approved",
          color: "bg-accent text-white",
          icon: <IconCheck className="w-4 h-4 mr-1" />,
        },
        REJECTED_BY_HOD: {
          label: "Rejected",
          color: "bg-destructive text-white",
          icon: <IconX className="w-4 h-4 mr-1" />,
        },
      };

      const badge = statusMap[status] || {
        label: status.replaceAll("_", " "),
        color: "bg-gray-100 text-gray-800",
        icon: <IconClock className="w-4 h-4 mr-1" />,
      };

      return (
        <div
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-sm font-medium",
            badge.color
          )}
        >
          {badge.icon}
          {badge.label}
        </div>
      );
    },
  },
];
