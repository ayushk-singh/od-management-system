// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import { ReactElement } from "react";

export type FacultyHistoryOD = {
  id: string;
  dateFrom: string;
  dateTo: string;
  totalDays: number;
  reason: string;
  location: string;
  status: string;
  facultyReviewedAt: string;
  facultyRemark?: string | null;
  student: {
    name: string;
    registerNo: string;
  };
};

export const facultyHistoryColumns: ColumnDef<FacultyHistoryOD>[] = [
  {
    accessorKey: "student.name",
    header: "Student Name",
    cell: ({ row }) => row.original.student.name,
  },
  {
    accessorKey: "student.registerNo",
    header: "Register No",
    cell: ({ row }) => row.original.student.registerNo,
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
    accessorKey: "facultyRemark",
    header: "Remark",
    cell: ({ row }) => row.original.facultyRemark || "-", // show "-" if empty/null
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusMap: Record<
        string,
        { label: string; color: string; icon: ReactElement }
      > = {
        FORWARDED_TO_HOD: {
          label: "Forwarded to HOD",
          color: "bg-primary",
          icon: <IconClock />,
        },
        APPROVED_BY_FACULTY: {
          label: "Approved by Faculty",
          color: "bg-accent",
          icon: <IconCheck />,
        },
        REJECTED_BY_FACULTY: {
          label: "Rejected by Faculty",
          color: "bg-destructive",
          icon: <IconX />,
        },
        APPROVED_BY_HOD: {
          label: "Approved by HOD",
          color: "bg-accent",
          icon: <IconCheck />,
        },
        REJECTED_BY_HOD: {
          label: "Rejected by HOD",
          color: "bg-destructive",
          icon: <IconX />,
        },
      };

      const badge = statusMap[status] || {
        label: status.replaceAll("_", " "),
        color: "bg-muted",
        icon: <IconClock className="w-4 h-4 mr-1" />,
      };

      return (
        <Badge
          className={`text-white ${badge.color} flex items-center px-2 py-1`}
        >
          {badge.icon}
          {badge.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "facultyReviewedAt",
    header: "Actioned On",
    cell: ({ row }) =>
      format(new Date(row.original.facultyReviewedAt), "PPP p"),
  },
];
