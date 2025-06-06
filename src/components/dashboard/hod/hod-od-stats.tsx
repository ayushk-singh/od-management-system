"use client"

import {
  IconClock,
  IconCheck,
  IconX,
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
import { ReactElement, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function HODODStats() {
  const [stats, setStats] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/od/hod/hod-stats");
        const json = await res.json();
        if (res.ok) {
          setStats(json);
        }
      } catch (err) {
        console.error("Failed to fetch HOD stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderCard = (
    description: string,
    value: number,
    icon: ReactElement,
    badgeText: string,
    badgeColor: string,
    badgeVariant: "outline" | "destructive" | "secondary",
    footerText: string
  ) => (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {loading ? <Skeleton className="h-8 w-12" /> : value}
        </CardTitle>
        <CardAction>
          <Badge className={badgeColor} variant={badgeVariant}>{icon}{badgeText}</Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
        {footerText}
      </CardFooter>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-3 lg:px-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">

      {renderCard(
        "Pending Applications",
        stats.pending,
        <IconClock className="mr-1" />,
        "Pending",
        "bg-primary",
        "secondary",
        "These need your attention."
      )}

      {renderCard(
        "Approved by You",
        stats.approved,
        <IconCheck className="mr-1" />,
        "Approved",
        "bg-accent text-white",
        "outline",
        "You have approved these."
      )}

      {renderCard(
        "Rejected by You",
        stats.rejected,
        <IconX className="mr-1" />,
        "Rejected",
        "bg-destructive",
        "destructive",
        "Declined due to invalid reasons."
      )}
    </div>
  )
}
