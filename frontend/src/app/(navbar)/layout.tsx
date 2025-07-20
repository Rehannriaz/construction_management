import React from "react";
import Link from "next/link";
import { Building2, Users, FileText, Settings } from "lucide-react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  ConstructionPro
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              <Link
                href="/projects"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Building2 className="h-5 w-5" />
                <span>Projects</span>
              </Link>
              <Link
                href="/teams"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Teams</span>
              </Link>
              <Link
                href="/reports"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
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
