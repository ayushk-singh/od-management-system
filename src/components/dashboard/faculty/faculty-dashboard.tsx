"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChartBar,
  IconInnerShadowTop,
  IconSearch,
  IconListDetails,
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
      url: "/dashboard/faculty",
      icon: IconDashboardFilled
    },
    {
      title: "Manage Applications",
      url: "/dashboard/faculty/manage",
      icon: IconListDetails,
    },
    {
      title: "History",
      url: "/dashboard/faculty/history",
      icon: IconChartBar,
    },
    {
      title: "Search Application",
      url: "/dashboard/faculty/search",
      icon: IconSearch
    }
  ],
  navSecondary: [
    {
      title: "Raise an issue",
      url: "mailto:omssupport@hicas.ac.in",
      icon: IconReport
    },
    {
      title: "Need Help",
      url: "/help",
      icon: IconHelpCircle
    }
  ]
}

export function FacultyAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
