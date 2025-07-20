import React from "react";
import Link from "next/link";
import { Building2, Users, FileText, Settings } from "lucide-react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-secondary">
      <nav className="bg-card shadow-sm border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  ConstructionPro
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              <Link
                href="/projects"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Building2 className="h-5 w-5" />
                <span>Projects</span>
              </Link>
              <Link
                href="/teams"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Teams</span>
              </Link>
              <Link
                href="/reports"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default layout;
