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
  Shield,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/dashboards/admin/stat-card";

export default function SiteManagerDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [currentTime]);

  const managedSites = [
    {
      id: 1,
      name: "Luxury Home Construction",
      address: "123 Oak Street, Springfield",
      client: "Mike Wilson",
      status: "active",
      progress: 65,
      workers: 8,
      todayReports: 6,
      pendingReports: 2,
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
      todayReports: 10,
      pendingReports: 2,
      lastUpdate: "1 hour ago",
    },
  ];

  const todayPriorities = [
    { id: 1, task: "Review daily reports from all workers", type: "reports", urgent: true },
    { id: 2, task: "Weekly WHS report due today", type: "safety", urgent: true },
    { id: 3, task: "Tool delivery scheduled at Luxury Home", type: "logistics", urgent: false },
    { id: 4, task: "Client meeting - Office Building progress", type: "client", urgent: false },
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "reports": return <FileText className="h-4 w-4" />;
      case "safety": return <Shield className="h-4 w-4" />;
      case "logistics": return <Truck className="h-4 w-4" />;
      case "client": return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

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
                placeholder="Search sites, workers, or reports..."
                className="pl-10 w-64 lg:w-80 h-10 bg-background border-input"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative h-10 w-10">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center">
              5
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-card">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">Site Manager</div>
              <div className="text-muted-foreground text-xs">Site Supervisor</div>
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
            >
              {greeting}, Site Manager!
            </motion.h1>
            <motion.p
              className="text-primary-foreground/90 text-base lg:text-lg mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {"Here's your site management overview for today"}
            </motion.p>
            <motion.div
              className="text-sm text-primary-foreground/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              title="Managed Sites"
              value={2}
              icon={Building2}
              iconBgColor="bg-blue-600"
              trend={{ value: 0, isPositive: true }}
              delay={0}
            />
            <StatCard
              title="Active Workers"
              value={20}
              icon={Users}
              iconBgColor="bg-green-600"
              trend={{ value: 5, isPositive: true }}
              delay={0.1}
            />
            <StatCard
              title="Pending Reports"
              value={4}
              icon={FileText}
              iconBgColor="bg-orange-600"
              trend={{ value: 2, isPositive: false }}
              delay={0.2}
            />
            <StatCard
              title="Safety Issues"
              value={1}
              icon={Shield}
              iconBgColor="bg-red-600"
              trend={{ value: 50, isPositive: false }}
              delay={0.3}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Managed Sites */}
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
                      Managed Sites
                    </CardTitle>
                    <Button size="sm" className="h-9">
                      <Plus className="h-4 w-4 mr-2" />
                      Weekly Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {managedSites.map((site, index) => (
                    <motion.div
                      key={site.id}
                      className="border border-border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors duration-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1 text-foreground">
                            {site.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{site.address}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Client:{" "}
                            <span className="font-medium text-foreground">
                              {site.client}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge
                            variant="secondary"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {site.status}
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
                            {site.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${site.progress}%` }}
                            transition={{
                              delay: 0.8 + index * 0.1,
                              duration: 0.8,
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{site.workers} workers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{site.todayReports} reports today</span>
                          </div>
                        </div>
                        
                        {site.pendingReports > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-orange-700">
                              {site.pendingReports} pending reports
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Priorities */}
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
                    Today&apos;s Priorities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayPriorities.map((priority, index) => (
                    <motion.div
                      key={priority.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                    >
                      <div className="mt-0.5 p-1.5 rounded bg-primary/10">
                        {getTaskIcon(priority.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {priority.task}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              priority.type === "reports" 
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : priority.type === "safety"
                                ? "bg-red-50 text-red-700 border-red-200" 
                                : priority.type === "logistics"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            }`}
                          >
                            {priority.type}
                          </Badge>
                          {priority.urgent && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                            >
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <Button className="w-full mt-4" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Priority
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}