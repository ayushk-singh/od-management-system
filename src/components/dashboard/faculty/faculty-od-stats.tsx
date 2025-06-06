"use client"

import {
  IconCheck,
  IconX,
  IconArrowForwardUp,
  IconClock,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"

export function FacultyODStats() {
  const [stats, setStats] = useState({
    approved: 0,
    rejected: 0,
    forwarded: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/od/faculty-stats");
        const json = await res.json();
        if (res.ok) {
          setStats(json);
        }
      } catch (err) {
        console.error("Failed to fetch faculty stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Approved Applications</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.approved}
          </CardTitle>
          <CardAction>
            <Badge className="bg-accent" variant="outline">
              <IconCheck className="mr-1" />
              Approved
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
          These were accepted by you.
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
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
          Declined by you due to invalid reasons.
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Forwarded to HOD</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.forwarded}
          </CardTitle>
          <CardAction>
            <Badge className="bg-primary" variant="outline">
              <IconArrowForwardUp className="mr-1" />
              Forwarded
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
          Sent for HOD's final approval.
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
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
          Yet to take action on these.
        </CardFooter>
      </Card>
    </div>
  );
}
