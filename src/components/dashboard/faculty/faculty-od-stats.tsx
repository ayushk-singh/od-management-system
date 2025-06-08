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
        const res = await fetch("/api/od/faculty/faculty-stats");
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

  const cards = [
    {
      label: "Approved Applications",
      count: stats.approved,
      badge: (
        <Badge className="bg-accent text-white" variant="outline">
          <IconCheck className="mr-1" /> Approved
        </Badge>
      ),
      description: "These were accepted by you.",
    },
    {
      label: "Rejected Applications",
      count: stats.rejected,
      badge: (
        <Badge variant="destructive">
          <IconX className="mr-1" /> Rejected
        </Badge>
      ),
      description: "Declined by you due to invalid reasons.",
    },
    {
      label: "Forwarded to HOD",
      count: stats.forwarded,
      badge: (
        <Badge className="bg-primary text-white" variant="outline">
          <IconArrowForwardUp className="mr-1" /> Forwarded
        </Badge>
      ),
      description: "Sent for HOD's final approval.",
    },
    {
      label: "Pending Applications",
      count: stats.pending,
      badge: (
        <Badge variant="secondary">
          <IconClock className="mr-1" /> Pending
        </Badge>
      ),
      description: "Yet to take action on these.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      {cards.map((card, idx) => (
        <Card className="@container/card" key={idx}>
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.count}
            </CardTitle>
            <CardAction>
              {card.badge}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
            {card.description}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
