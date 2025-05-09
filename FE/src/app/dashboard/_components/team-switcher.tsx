"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex gap-4 items-center">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Habits</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
