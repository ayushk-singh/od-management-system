"use client"

import {
  IconCheck,
  IconClock,
  IconX,
  IconClipboardList,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function StudentODStats() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/od/student-stats");
        const json = await res.json();
        if (res.ok) {
          setStats(json);
        }
      } catch (err) {
        console.error("Failed to fetch student stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-4 lg:px-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total OD Applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.total}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClipboardList className="mr-1" />
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          All ODs you've applied so far.
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Approved Applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.approved}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCheck className="mr-1" />
              Approved
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Final approval by faculty/HOD.
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rejected Applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.rejected}
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <IconX className="mr-1" />
              Rejected
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Declined by faculty or HOD.
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.pending}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">
              <IconClock className="mr-1" />
              Pending
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Awaiting action from faculty or HOD.
        </CardFooter>
      </Card>

    </div>
  );
}
