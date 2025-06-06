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
import { Skeleton } from "@/components/ui/skeleton"

export function StudentODStats() {
  const [stats, setStats] = useState<{
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/od/student/student-stats");
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

  const cards = [
    {
      title: "Total OD Applications",
      value: stats?.total,
      icon: <IconClipboardList className="mr-1" />,
      badge: "Total",
      badgeVariant: "outline",
      footer: "All ODs you've applied so far.",
    },
    {
      title: "Approved Applications",
      value: stats?.approved,
      icon: <IconCheck className="mr-1" />,
      badge: "Approved",
      badgeVariant: "outline",
      footer: "Final approval by faculty/HOD.",
    },
    {
      title: "Rejected Applications",
      value: stats?.rejected,
      icon: <IconX className="mr-1" />,
      badge: "Rejected",
      badgeVariant: "destructive",
      footer: "Declined by faculty or HOD.",
    },
    {
      title: "Pending Applications",
      value: stats?.pending,
      icon: <IconClock className="mr-1" />,
      badge: "Pending",
      badgeVariant: "secondary",
      footer: "Awaiting action from faculty or HOD.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-4 lg:px-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      {cards.map((card, i) => (
        <Card className="@container/card" key={i}>
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            {stats ? (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
            ) : (
              <Skeleton className="h-8 w-16 rounded bg-secondary dark:bg-secondary" />
            )}
            <CardAction>
              <Badge
                className={`
                  ${card.badge === "Total" ? "bg-primary text-white" : ""}
                  ${card.badge === "Approved" ? "bg-accent text-white" : ""}
                  ${card.badge === "Pending" ? "bg-destructive text-white" : ""}
                `}
              >
                {card.icon}
                {card.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {card.footer}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
