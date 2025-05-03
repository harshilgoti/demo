"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/app/(auth)/_components/auth-provider";
import { useQueryClient } from "@tanstack/react-query";

export function NavUser() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, logout } = useAuth();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-sidebar-primary text-sidebar-primary-foreground rounded-lg"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">
              <User className="text-bg-sidebar-primary" color="black" />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.fullName}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
          <LogOut
            className="cursor-pointer"
            onClick={async () => {
              await logout();
              queryClient.clear();
              router.push("/login");
            }}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
