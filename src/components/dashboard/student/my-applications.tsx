"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";

type OdApplication = {
  id: string;
  dateFrom: string;
  dateTo: string;
  totalDays: number;
  reason: string;
  location: string;
  status: string;
};

export default function MyApplications() {
  const [odList, setOdList] = useState<OdApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch("/api/od/my-applications");
      const data = await res.json();
      setOdList(data.odList || []);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this OD?");
    if (!confirmed) return;

    const res = await fetch(`/api/od/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setOdList((prev) => prev.filter((od) => od.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading...</p>
      ) : odList.length === 0 ? (
        <p>No OD applications found.</p>
      ) : (
        odList.map((od) => (
          <Card key={od.id}>
            <CardContent className="p-4 space-y-2">
              <div className="text-sm text-muted-foreground">
                {format(new Date(od.dateFrom), "PPP")} →{" "}
                {format(new Date(od.dateTo), "PPP")} ({od.totalDays} days)
              </div>
              <div>
                <b>Location:</b> {od.location}
              </div>
              <div>
                <b>Reason:</b> {od.reason}
              </div>
              <div>
                <b>Status:</b>{" "}
                <span
                  className={`${
                    od.status === "PENDING"
                      ? "text-yellow-600"
                      : od.status === "APPROVED"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {od.status}
                </span>
              </div>

              {od.status === "PENDING" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(od.id)}
                  >
                    Delete
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Edit (TBD)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
