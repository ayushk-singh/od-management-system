import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export type HODApplication = {
  id: string;
  dateFrom: string;
  dateTo: string;
  totalDays: number;
  reason: string;
  location: string;
  status: string;
  student: { name: string; registerNo: string };
  faculty: { name: string };
};

export const getColumns = (
  onApprove: (id: string) => void,
  onReject: (id: string) => void
): ColumnDef<HODApplication>[] => [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) =>
      `${row.original.student.name} (${row.original.student.registerNo})`,
  },
  {
    accessorKey: "faculty",
    header: "Recommended By",
    cell: ({ row }) => row.original.faculty.name,
  },
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
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onApprove(id)}>
            Approve
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onReject(id)}>
            Reject
          </Button>
        </div>
      );
    },
  },
];
