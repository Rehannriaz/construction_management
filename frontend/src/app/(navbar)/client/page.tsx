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
  Calendar,
  Camera,
  TrendingUp,
  User,
  Bell,
  Search,
  MapPin,
  Activity,
  Eye,
  Download,
  MessageSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/dashboards/admin/stat-card";

export default function ClientDashboard() {
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

  const myProjects = [
    {
      id: 1,
      name: "Luxury Home Construction",
      address: "123 Oak Street, Springfield",
      contractor: "BuildRight Construction",
      status: "active",
      progress: 65,
      startDate: "2024-01-15",
      estimatedCompletion: "2024-08-15",
      lastUpdate: "2 hours ago",
      milestone: "Foundation Complete",
    },
    {
      id: 2,
      name: "Office Building Renovation",
      address: "456 Business Ave, Downtown", 
      contractor: "BuildRight Construction",
      status: "active",
      progress: 42,
      startDate: "2024-02-01",
      estimatedCompletion: "2024-09-30",
      lastUpdate: "1 day ago",
      milestone: "Electrical Phase",
    },
  ];

  const recentUpdates = [
    { 
      id: 1, 
      type: "progress",
      title: "Foundation work completed",
      project: "Luxury Home Construction",
      time: "2 hours ago",
      description: "Concrete foundation has been poured and is curing properly."
    },
    { 
      id: 2, 
      type: "photo",
      title: "Progress photos uploaded",
      project: "Office Building Renovation", 
      time: "4 hours ago",
      description: "New photos showing electrical installation progress."
    },
    { 
      id: 3, 
      type: "report",
      title: "Weekly progress report",
      project: "Luxury Home Construction",
      time: "1 day ago", 
      description: "Weekly summary of completed work and upcoming tasks."
    },
  ];

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "progress": return <TrendingUp className="h-4 w-4" />;
      case "photo": return <Camera className="h-4 w-4" />;
      case "report": return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case "progress": return "bg-green-50 text-green-700 border-green-200";
      case "photo": return "bg-blue-50 text-blue-700 border-blue-200";  
      case "report": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
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
                placeholder="Search projects, reports, or photos..."
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
              <div className="font-semibold text-foreground">Client User</div>
              <div className="text-muted-foreground text-xs">Project Owner</div>
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
              {greeting}, Client!
            </motion.h1>
            <motion.p
              className="text-primary-foreground/90 text-base lg:text-lg mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Track your construction project progress and stay updated.
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
              title="Active Projects"
              value={2}
              icon={Building2}
              iconBgColor="bg-blue-600"
              trend={{ value: 0, isPositive: true }}
              delay={0}
            />
            <StatCard
              title="Average Progress"
              value={54}
              icon={TrendingUp}
              iconBgColor="bg-green-600"
              trend={{ value: 8, isPositive: true }}
              delay={0.1}
            />
            <StatCard
              title="Recent Reports"
              value={3}
              icon={FileText}
              iconBgColor="bg-purple-600"
              trend={{ value: 1, isPositive: true }}
              delay={0.2}
            />
            <StatCard
              title="New Photos"
              value={24}
              icon={Camera}
              iconBgColor="bg-orange-600"
              trend={{ value: 12, isPositive: true }}
              delay={0.3}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* My Projects */}
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
                      My Projects
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myProjects.map((project, index) => (
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
                            Contractor:{" "}
                            <span className="font-medium text-foreground">
                              {project.contractor}
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

                        <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Est. Complete: {new Date(project.estimatedCompletion).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Current: {project.milestone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              <span>Updated: {project.lastUpdate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Camera className="h-3 w-3 mr-1" />
                            View Photos
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-3 w-3 mr-1" />
                            Reports
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Card className="border border-border shadow-sm bg-card h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    Recent Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <motion.div
                      key={update.id}
                      className="border border-border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getUpdateColor(update.type)}`}>
                          {getUpdateIcon(update.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground mb-1">
                            {update.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            {update.project} • {update.time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {update.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Contractor
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