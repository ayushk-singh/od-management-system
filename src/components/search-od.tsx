"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OdApplication = {
  id: string;
  dateFrom: string;
  dateTo: string;
  totalDays: number;
  reason: string;
  location: string;
  status: string;
  faculty?: { name: string };
  student?: { registerNo: string };
};

const PAGE_SIZE = 10;

export default function SearchOd() {
  const [searchTerm, setSearchTerm] = useState("");
  const [odList, setOdList] = useState<OdApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setOdList([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();

    fetch(`/api/od/utils/search?q=${encodeURIComponent(searchTerm)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        setOdList(data.odList);
        setPageIndex(0); // Reset to page 1 on new search
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setOdList([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [searchTerm]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-primary text-white";
      case "APPROVED_BY_FACULTY":
      case "APPROVED_BY_HOD":
        return "bg-accent text-white";
      case "REJECTED_BY_FACULTY":
      case "REJECTED_BY_HOD":
        return "bg-destructive text-white";
      case "FORWARDED_TO_HOD":
        return "bg-primary text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const paginatedData = odList.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  );

  return (
    <div className="p-10">
      <input
        type="search"
        placeholder="Search by OD ID or Register Number"
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading &&
        !error &&
        odList.length === 0 &&
        searchTerm.trim() !== "" && <p>No OD applications found.</p>}

      {paginatedData.length > 0 && (
        <>
          <div className="rounded-lg overflow-hidden border">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Date From</TableHead>
                  <TableHead className="text-white">Date To</TableHead>
                  <TableHead className="text-white">Reason</TableHead>
                  <TableHead className="text-white">Location</TableHead>
                  <TableHead className="text-white">Faculty</TableHead>
                  <TableHead className="text-white">Register No.</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((od) => (
                  <TableRow key={od.id}>
                    <TableCell>{od.id}</TableCell>
                    <TableCell>
                      {format(new Date(od.dateFrom), "PPP")}
                    </TableCell>
                    <TableCell>{format(new Date(od.dateTo), "PPP")}</TableCell>
                    <TableCell>{od.reason}</TableCell>
                    <TableCell>{od.location}</TableCell>
                    <TableCell>{od.faculty?.name || "N/A"}</TableCell>
                    <TableCell>{od.student?.registerNo || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          getStatusBadgeClass(od.status) +
                          " flex items-center gap-1"
                        }
                      >
                        {od.status === "APPROVED_BY_FACULTY" ||
                        od.status === "APPROVED_BY_HOD" ? (
                          <IconCheck size={16} />
                        ) : od.status === "REJECTED_BY_FACULTY" ||
                          od.status === "REJECTED_BY_HOD" ? (
                          <IconX size={16} />
                        ) : od.status === "PENDING" ||
                          od.status === "FORWARDED_TO_HOD" ? (
                          <IconClock size={16} />
                        ) : null}
                        {od.status.replaceAll("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((p) => p - 1)}
            >
              Previous
            </Button>
            <span>
              Page {pageIndex + 1} of{" "}
              {Math.max(1, Math.ceil(odList.length / PAGE_SIZE))}
            </span>
            <Button
              variant="outline"
              disabled={(pageIndex + 1) * PAGE_SIZE >= odList.length}
              onClick={() => setPageIndex((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
