"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconCheck, IconX } from "@tabler/icons-react";
import DataFetchLoader from "./data-fetch-loader";

interface OdDetails {
  studentName: string;
  registerNo: string;
  facultyName: string;
  hodName: string | null;
  dateFrom: string;
  dateTo: string;
  reason: string;
  location: string;
  createdAt?: string;
}

interface VerifyResponse {
  valid: boolean;
  message: string;
  status?: string;
  odDetails?: OdDetails | null;
}

export default function VerifyPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [data, setData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/od/verify/${id}`)
      .then((res) => res.json())
      .then((json: VerifyResponse) => setData(json))
      .catch(() => setData({ valid: false, message: "Error fetching data" }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div><DataFetchLoader/></div>;

  if (!data) return <div>No data</div>;

  return (
    <div
      className={`min-h-screen p-15 ${
        data.valid ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      <div className="max-w-md mx-auto">
        <h1 className="mb-4 text-2xl font-semibold">OD Verification</h1>

        {/* Status with icon badge */}
        <div
          className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 font-medium
            ${
              data.valid
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
        >
          {data.valid ? <IconCheck size={20} /> : <IconX size={20} />}
          <span>{data.valid ? "Valid" : "Invalid"}</span>
        </div>

        <p className="mt-2 mb-6">{data.message}</p>

        {data.valid && data.odDetails && (
          <Card>
            <CardHeader>
              <CardTitle>OD Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Student:</strong> {data.odDetails.studentName}
              </p>
              <p>
                <strong>Register No:</strong> {data.odDetails.registerNo}
              </p>

              {data.status === "APPROVED_BY_HOD" ? (
                <p>
                  <strong>Approved by HOD:</strong> {data.odDetails.hodName || "N/A"}
                </p>
              ) : data.status === "APPROVED_BY_FACULTY" ? (
                <p>
                  <strong>Approved by Faculty:</strong> {data.odDetails.facultyName}
                </p>
              ) : (
                <p>
                  <strong>Approval Status:</strong> {data.status}
                </p>
              )}

              <p>
                <strong>Date From:</strong>{" "}
                {new Date(data.odDetails.dateFrom).toDateString()}
              </p>
              <p>
                <strong>Date To:</strong>{" "}
                {new Date(data.odDetails.dateTo).toDateString()}
              </p>
              <p>
                <strong>Location:</strong> {data.odDetails.location}
              </p>
              <p>
                <strong>Reason:</strong> {data.odDetails.reason}
              </p>
              {data.odDetails.createdAt && (
                <p>
                  <strong>Applied On:</strong>{" "}
                  {new Date(data.odDetails.createdAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
