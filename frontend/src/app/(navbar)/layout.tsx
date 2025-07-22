import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboards/admin/app-sidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RouteGuard>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
};

export default layout;
