"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChartBar,
  IconInnerShadowTop,
  IconSearch,
  IconListDetails,
  IconDashboardFilled
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
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
      url: "#",
      icon: IconSearch
    }
  ],
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
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}
