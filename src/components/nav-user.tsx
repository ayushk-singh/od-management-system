"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useUser, UserButton } from "@clerk/nextjs";

export function NavUser() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  return (
    <SidebarMenu className="hidden md:block">
      <SidebarMenuItem className="flex items-center gap-3 p-2">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 rounded-full",
            },
          }}
        />
        <span className="text-sm font-medium truncate">
          {user.primaryEmailAddress?.emailAddress}
        </span>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
