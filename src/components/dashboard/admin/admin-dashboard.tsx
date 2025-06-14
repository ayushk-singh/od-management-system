"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconInnerShadowTop,
  IconUserPlus,
  IconDashboardFilled,
  IconReport,
  IconHelpCircle,
  IconUser,
  IconBuildingPlus,
  IconBuilding,
  IconNotes
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
      url: "/admin",
      icon: IconDashboardFilled
    },
    {
      title: "Create User",
      url: "/admin/create-user",
      icon: IconUserPlus,
    },
    {
      title: "Create Department",
      url: "/admin/create-department",
      icon: IconBuildingPlus,
    },
    {
      title: "Manage Users",
      url: "/admin/manage-users",
      icon: IconUser,
    },
    {
      title: "Manage Departments",
      url: "/admin/manage-department",
      icon: IconBuilding,
    },
    {
      title: "Manage OD",
      url: "/admin/manage-od",
      icon: IconNotes
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

export function AdminAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
