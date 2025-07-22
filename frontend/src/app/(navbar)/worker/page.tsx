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
  User,
  Bell,
  Search,
  Plus,
  MapPin,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/dashboards/admin/stat-card";

export default function WorkerDashboard() {
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

  const assignedSites = [
    {
      id: 1,
      name: "Luxury Home Construction",
      address: "123 Oak Street, Springfield",
      status: "active",
      todayHours: "0 hours logged",
      lastReport: "Yesterday",
      reportStatus: "pending",
    },
    {
      id: 2,
      name: "Office Building Renovation",
      address: "456 Business Ave, Downtown",
      status: "active",
      todayHours: "4.5 hours logged",
      lastReport: "Today",
      reportStatus: "submitted",
    },
  ];

  const todayTasks = [
    { id: 1, task: "Submit daily report for Luxury Home", urgent: true },
    { id: 2, task: "Upload photos from morning work", urgent: false },
    { id: 3, task: "Check in at Office Building site", urgent: false },
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
                placeholder="Search sites, reports, or tasks..."
                className="pl-10 w-64 lg:w-80 h-10 bg-background border-input"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative h-10 w-10">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center">
              2
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-card">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">Worker User</div>
              <div className="text-muted-foreground text-xs">Construction Worker</div>
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
              {greeting}, Worker User!
            </motion.h1>
            <motion.p
              className="text-primary-foreground/90 text-base lg:text-lg mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Ready to get to work? Check your sites and submit your reports.
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
              title="My Sites"
              value={2}
              icon={Building2}
              iconBgColor="bg-blue-600"
              trend={{ value: 0, isPositive: true }}
              delay={0}
            />
            <StatCard
              title="Hours Today"
              value={4.5}
              icon={Clock}
              iconBgColor="bg-green-600"
              trend={{ value: 15, isPositive: true }}
              delay={0.1}
            />
            <StatCard
              title="Pending Reports"
              value={1}
              icon={FileText}
              iconBgColor="bg-orange-600"
              trend={{ value: 0, isPositive: true }}
              delay={0.2}
            />
            <StatCard
              title="Photos Uploaded"
              value={12}
              icon={Camera}
              iconBgColor="bg-purple-600"
              trend={{ value: 8, isPositive: true }}
              delay={0.3}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Assigned Sites */}
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
                        <Building2 className="h-4 w-4 text-primary-foreground" />
                      </div>
                      My Sites
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignedSites.map((site, index) => (
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
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge
                            variant="secondary"
                            className={
                              site.reportStatus === "submitted"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                            }
                          >
                            {site.reportStatus}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">
                            Today&apos;s Hours
                          </span>
                          <span className="font-semibold text-foreground">
                            {site.todayHours}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">
                            Last Report
                          </span>
                          <span className="font-semibold text-foreground">
                            {site.lastReport}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <FileText className="h-3 w-3 mr-1" />
                            Daily Report
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Camera className="h-3 w-3 mr-1" />
                            Upload Photos
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Card className="border border-border shadow-sm bg-card h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                      <CheckSquare className="h-4 w-4 text-white" />
                    </div>
                    Today&apos;s Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                    >
                      <div className="mt-0.5">
                        {task.urgent ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {task.task}
                        </p>
                        {task.urgent && (
                          <Badge
                            variant="secondary"
                            className="mt-1 bg-orange-50 text-orange-700 border-orange-200 text-xs"
                          >
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  <Button className="w-full mt-4" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
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