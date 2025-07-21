"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "./animated-counter";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </CardTitle>
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconBgColor}`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-baseline gap-2">
            <AnimatedCounter
              value={value}
              className="text-3xl font-bold text-foreground"
            />
            {trend && (
              <motion.div
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-orange-600"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.3 }}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
