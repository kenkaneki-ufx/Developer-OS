"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getDaySchedule } from "@/features/schedule/data/mock-schedule";
import { useSchedule } from "@/features/schedule/hooks/use-schedule";
import { DEFAULT_DAYS, SLOT_TYPE_CONFIG } from "@/features/schedule/types";
import type { DayOfWeek } from "@/features/schedule/types";
import { PageWrapper } from "@/components/ui/page-wrapper";

const dayOrder: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function SchedulePage() {
  const { schedule, isLoaded } = useSchedule();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("monday");
  const [todayDay, setTodayDay] = useState<DayOfWeek | null>(null);

  const daySchedule = getDaySchedule(schedule, selectedDay);
  const [currentTime, setCurrentTime] = useState("08:00");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }));
      setTodayDay(now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as DayOfWeek);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageWrapper
      title="Weekly Schedule"
      subtitle="Your repeating weekly routine"
      headerAction={
        <Link href="/dashboard/settings"
          className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:shadow-sm">
          <Settings className="h-4 w-4" />
          Edit Schedule
        </Link>
      }
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Day Selector */}
        <motion.div variants={item} className="flex items-center gap-2 overflow-x-auto pb-2">
          {dayOrder.map((day) => {
            const isToday = day === todayDay;
            const dayData = getDaySchedule(schedule, day);
            return (
              <button key={day} onClick={() => setSelectedDay(day)}
                className={cn("flex flex-col items-center rounded-xl px-4 py-3 transition-all duration-200 min-w-[90px]",
                  selectedDay === day
                    ? "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    : isToday
                      ? "bg-primary/10 text-primary border border-primary/15"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}>
                <span className="text-xs font-semibold uppercase">{DEFAULT_DAYS.find((d) => d.value === day)?.shortLabel}</span>
                <span className="text-lg font-bold mt-0.5">{28 + (dayOrder.indexOf(day) - 1)}</span>
                <span className="text-[10px] font-medium mt-0.5">{dayData.totalSlots} {dayData.totalSlots === 1 ? "slot" : "slots"}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Day Schedule */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              {daySchedule.label}&apos;s Schedule
            </h2>
            <span className="text-sm text-muted-foreground/70 font-medium">
              {daySchedule.totalHours}h planned
            </span>
          </div>

          <div className="space-y-3">
            {!isLoaded ? (
              <div className="flex items-center justify-center py-12">
                <Clock className="h-6 w-6 animate-spin text-muted-foreground/40" />
              </div>
            ) : daySchedule.slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30 mb-3">
                  <Clock className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground/60 font-medium">No slots scheduled for {daySchedule.label}</p>
                <Link href="/dashboard/settings"
                  className="mt-4 flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
                  <Plus className="h-4 w-4" /> Set Up Schedule
                </Link>
              </div>
            ) : daySchedule.slots.map((slot, index) => {
              const isPast = currentTime > slot.endTime;
              const isCurrent = currentTime >= slot.startTime && currentTime <= slot.endTime;
              const typeConfig = SLOT_TYPE_CONFIG[slot.type];

              return (
                <motion.div key={slot.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("flex items-center gap-4 rounded-xl border p-4 transition-all duration-200",
                    isCurrent
                      ? "border-primary/25 bg-primary/5 shadow-md"
                      : isPast
                        ? "opacity-50 border-border/50 bg-card"
                        : "border-border bg-card hover:border-primary/15 hover:shadow-sm"
                  )}>
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-muted/30 border border-border/50">
                    <span className="text-xs font-semibold text-foreground">{slot.startTime}</span>
                    <span className="text-[10px] text-muted-foreground/40">to</span>
                    <span className="text-xs font-semibold text-foreground">{slot.endTime}</span>
                  </div>

                  <div className={cn("h-10 w-1 rounded-full flex-shrink-0", slot.color)} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{slot.title}</h3>
                      {isCurrent && (
                        <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary animate-pulse border border-primary/10">
                          NOW
                        </span>
                      )}
                      <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize border border-border/50", typeConfig.bgColor)}>
                        {typeConfig.label}
                      </span>
                    </div>
                    {slot.description && (
                      <p className="mt-1 text-xs text-muted-foreground/60">{slot.description}</p>
                    )}
                    {slot.location && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground/50">
                        <MapPin className="h-3 w-3" /> {slot.location}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
