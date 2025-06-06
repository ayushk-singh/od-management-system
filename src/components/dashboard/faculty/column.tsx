// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";


export type FacultyHistoryOD = {
  id: string;
  dateFrom: string;
  dateTo: string;
  totalDays: number;
  reason: string;
  location: string;
  status: string;
  facultyReviewedAt: string;
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`${
            status === "FORWARDED_TO_HOD"
              ? "text-blue-600"
              : status === "APPROVED_BY_FACULTY"
              ? "text-green-600"
              : "text-red-600"
          } font-semibold`}
        >
          {status.replaceAll("_", " ")}
        </span>
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
