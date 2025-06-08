"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function RaiseIssuePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Raise an Issue</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Basic Troubleshooting Tips</CardTitle>
          <CardDescription>
            Before raising an issue, please try the following steps to resolve
            common problems:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Refresh the page or restart your browser.</li>
            <li>Clear your browser cache and cookies.</li>
            <li>Ensure you have a stable internet connection.</li>
            <li>
              Try accessing the application using a different browser or device.
            </li>
            <li>Check if there are any ongoing outages or maintenance.</li>
            <li>Make sure your browser is up to date.</li>
          </ul>
        </CardContent>
      </Card>

      <Separator className="mb-8" />

      <a
        href="mailto:oms.support@hicas.ac.in"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full px-4 py-3 text-center rounded bg-primary text-white hover:bg-primary-dark"
      >
        Contact Support
      </a>
    </div>
  );
}
