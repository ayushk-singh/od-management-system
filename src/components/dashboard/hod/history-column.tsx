import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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
    cell: ({ row }) => (
      <span
        className={`font-medium ${
          row.original.status === "APPROVED_BY_HOD"
            ? "text-green-600"
            : "text-red-500"
        }`}
      >
        {row.original.status.replace("_", " ")}
      </span>
    ),
  },
];
