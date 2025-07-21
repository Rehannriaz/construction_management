"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Camera,
  Clock,
  FileText,
  HardHat,
  Home,
  MapPin,
  Settings,
  TrendingUp,
  Users,
  FolderOpen,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    isActive: true,
  },
  {
    title: "All Sites",
    url: "/sites",
    icon: MapPin,
    badge: "2",
  },
  {
    title: "Site Assignments",
    url: "/assignments",
    icon: Users,
  },
  {
    title: "Daily Reports",
    url: "/daily-reports",
    icon: FileText,
    badge: "New",
  },
  {
    title: "Worker Hours",
    url: "/worker-hours",
    icon: Clock,
  },
  {
    title: "Weekly Reports",
    url: "/weekly-reports",
    icon: TrendingUp,
  },
  {
    title: "Workers",
    url: "/workers",
    icon: HardHat,
    badge: "12",
  },
  {
    title: "All Photos",
    url: "/photos",
    icon: Camera,
  },
  {
    title: "Site Documents",
    url: "/documents",
    icon: FolderOpen,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-[17px] border-b">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Site Tasker
            </h2>
            <p className="text-sm text-muted-foreground">
              Construction Management
            </p>
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      className="h-11 px-3 text-base font-medium hover:bg-accent focus:bg-accent"
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={
                              item.badge === "New" ? "default" : "secondary"
                            }
                            className="text-xs h-5 px-2"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 px-3 text-base font-medium hover:bg-accent focus:bg-accent"
            >
              <motion.a
                href="/settings"
                className="flex items-center gap-3"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </motion.a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator className="my-2" />
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 px-3 text-base font-medium hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <motion.a
                href="/logout"
                className="flex items-center gap-3"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </motion.a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
