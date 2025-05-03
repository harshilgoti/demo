"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const pathname = usePathname();
  const { open } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              className={cn(
                "cursor-pointer",
                pathname === item.url &&
                  "bg-sidebar-primary text-sidebar-primary-foreground rounded-lg hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:rounded-lg"
              )}
              variant={"outline"}
            >
              <Link href={item.url} className="flex gap-2 items-center w-full">
                {item.icon && <item.icon size={16} />}
                <span className={cn(!open && "hidden")}>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
