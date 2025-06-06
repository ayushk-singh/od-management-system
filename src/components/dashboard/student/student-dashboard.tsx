"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChartBar,
  IconInnerShadowTop,
  IconSearch,
  IconCirclePlus,
  IconDashboardFilled,
  IconReport,
  IconHelpCircle
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/student",
      icon: IconDashboardFilled
    },
    {
      title: "Apply OD",
      url: "/dashboard/student/apply-od",
      icon: IconCirclePlus,
    },
    {
      title: "My Applications",
      url: "/dashboard/student/my-applications",
      icon: IconChartBar,
    },
    {
      title: "Search Application",
      url: "/dashboard/student/search",
      icon: IconSearch
    }
  ],
  navSecondary: [
    {
      title: "Raise an issue",
      url: "/dashboard/raise-an-issue",
      icon: IconReport
    },
    {
      title: "Need Help",
      url: "/help",
      icon: IconHelpCircle
    }
  ]
}

export function StudentAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">HICAS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary className="mt-auto" items={data.navSecondary}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
