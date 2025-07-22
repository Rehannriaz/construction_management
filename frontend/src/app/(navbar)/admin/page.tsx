"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  Clock,
  Camera,
  TrendingUp,
  Calendar,
  User,
  Bell,
  Search,
  Plus,
  MoreVertical,
  MapPin,
  Users,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/dashboards/admin/stat-card";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    // Initialize time on client only to prevent hydration mismatch
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentTime) return;
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [currentTime]);

  const projects = [
    {
      id: 1,
      name: "Luxury Home Construction",
      address: "123 Oak Street, Springfield",
      client: "Mike Wilson",
      status: "active",
      progress: 65,
      workers: 8,
      lastUpdate: "2 hours ago",
    },
    {
      id: 2,
      name: "Office Building Renovation",
      address: "456 Business Ave, Downtown",
      client: "Wilson Properties",
      status: "active",
      progress: 42,
      workers: 12,
      lastUpdate: "4 hours ago",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 flex items-center justify-between p-4 lg:p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-10 w-10" />
          <Separator orientation="vertical" className="h-6" />
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, workers, or reports..."
                className="pl-10 w-64 lg:w-80 h-10 bg-background border-input"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative h-10 w-10">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-card">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">Admin User</div>
              <div className="text-muted-foreground text-xs">Administrator</div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <motion.div
            className="rounded-lg bg-primary text-primary-foreground p-6 lg:p-8 border border-border shadow-sm"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h1
              className="text-2xl lg:text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              suppressHydrationWarning
            >
              {greeting}, Admin User!
            </motion.h1>
            <motion.p
              className="text-primary-foreground/90 text-base lg:text-lg mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {"Here's your construction overview for today"}
            </motion.p>
            <motion.div
              className="text-sm text-primary-foreground/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              suppressHydrationWarning
            >
              {currentTime ? currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : "Loading..."}
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              title="Active Sites"
              value={2}
              icon={Building2}
              iconBgColor="bg-blue-600"
              trend={{ value: 12, isPositive: true }}
              delay={0}
            />
            <StatCard
              title="Total Reports"
              value={24}
              icon={FileText}
              iconBgColor="bg-green-600"
              trend={{ value: 8, isPositive: true }}
              delay={0.1}
            />
            <StatCard
              title="Total Hours"
              value={156}
              icon={Clock}
              iconBgColor="bg-orange-600"
              trend={{ value: 5, isPositive: false }}
              delay={0.2}
            />
            <StatCard
              title="Photos"
              value={89}
              icon={Camera}
              iconBgColor="bg-purple-600"
              trend={{ value: 15, isPositive: true }}
              delay={0.3}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Active Projects */}
            <motion.div
              className="xl:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Card className="border border-border shadow-sm bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary-foreground" />
                      </div>
                      Active Projects
                    </CardTitle>
                    <Button size="sm" className="h-9">
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="border border-border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors duration-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1 text-foreground">
                            {project.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{project.address}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Client:{" "}
                            <span className="font-medium text-foreground">
                              {project.client}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge
                            variant="secondary"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {project.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">
                            Progress
                          </span>
                          <span className="font-semibold text-foreground">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{
                              delay: 0.8 + index * 0.1,
                              duration: 0.8,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{project.workers} workers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              <span>Updated {project.lastUpdate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Card className="border border-border shadow-sm bg-card h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <Activity className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium mb-1">
                      No recent activity
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Activity will appear here as it happens
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Today's Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    {"Today's Reports"}
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    View All Reports
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center mb-6">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    No reports submitted today
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Reports from workers will appear here once they submit their
                    daily updates
                  </p>
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
