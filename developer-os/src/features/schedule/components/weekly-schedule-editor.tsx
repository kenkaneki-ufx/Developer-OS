"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, GripVertical, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  WeeklySchedule,
  ScheduleSlot,
  DayOfWeek,
  SlotType,
} from "../types";
import {
  DEFAULT_DAYS,
  SLOT_TYPE_CONFIG,
  TIME_HOURS,
} from "../types";
import { generateSlotId } from "../data/mock-schedule";

interface WeeklyScheduleEditorProps {
  schedule: WeeklySchedule;
  onSave: (schedule: WeeklySchedule) => void;
  onCancel?: () => void;
}

export function WeeklyScheduleEditor({
  schedule,
  onSave,
  onCancel,
}: WeeklyScheduleEditorProps) {
  const [editedSchedule, setEditedSchedule] = useState<WeeklySchedule>({
    ...schedule,
  });
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("monday");
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const daySlots = editedSchedule.timeSlots
    .filter((slot) => slot.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAddSlot = () => {
    const newSlot: ScheduleSlot = {
      id: generateSlotId(),
      day: selectedDay,
      startTime: "09:00",
      endTime: "10:00",
      type: "work",
      title: "",
      color: "bg-blue-500",
    };
    setEditingSlot(newSlot);
    setIsAddingNew(true);
  };

  const handleEditSlot = (slot: ScheduleSlot) => {
    setEditingSlot({ ...slot });
    setIsAddingNew(false);
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;

    if (isAddingNew) {
      setEditedSchedule((prev) => ({
        ...prev,
        timeSlots: [...prev.timeSlots, editingSlot],
        updatedAt: new Date().toISOString(),
      }));
    } else {
      setEditedSchedule((prev) => ({
        ...prev,
        timeSlots: prev.timeSlots.map((s) =>
          s.id === editingSlot.id ? editingSlot : s
        ),
        updatedAt: new Date().toISOString(),
      }));
    }

    setEditingSlot(null);
    setIsAddingNew(false);
  };

  const handleDeleteSlot = (slotId: string) => {
    setEditedSchedule((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((s) => s.id !== slotId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSaveSchedule = () => {
    onSave(editedSchedule);
  };

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {DEFAULT_DAYS.map((day) => {
          const slotCount = editedSchedule.timeSlots.filter(
            (s) => s.day === day.value
          ).length;
          return (
            <button
              key={day.value}
              onClick={() => {
                setSelectedDay(day.value);
                setEditingSlot(null);
                setIsAddingNew(false);
              }}
              className={cn(
                "flex flex-col items-center rounded-lg px-4 py-3 transition-all min-w-[80px]",
                selectedDay === day.value
                  ? "bg-primary text-primary-foreground"
                  : day.isWeekend
                    ? "bg-muted/50 text-muted-foreground hover:bg-muted"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span className="text-xs font-medium">{day.shortLabel}</span>
              <span className="text-[10px] mt-1">
                {slotCount} {slotCount === 1 ? "slot" : "slots"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule slots for selected day */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">
            {DEFAULT_DAYS.find((d) => d.value === selectedDay)?.label}&apos;s Schedule
          </h3>
          <button
            onClick={handleAddSlot}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3 w-3" />
            Add Slot
          </button>
        </div>

        {/* Slot list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {daySlots.map((slot) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <div className={cn("h-8 w-1 rounded-full", slot.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {slot.title || "Untitled"}
                    </p>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        SLOT_TYPE_CONFIG[slot.type].bgColor
                      )}
                    >
                      {SLOT_TYPE_CONFIG[slot.type].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {slot.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        • {slot.description}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditSlot(slot)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <span className="text-xs">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {daySlots.length === 0 && !editingSlot && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8">
              <Clock className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No slots scheduled for {DEFAULT_DAYS.find((d) => d.value === selectedDay)?.label}
              </p>
              <button
                onClick={handleAddSlot}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Add your first slot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slot editor modal */}
      <AnimatePresence>
        {editingSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              setEditingSlot(null);
              setIsAddingNew(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {isAddingNew ? "Add Time Slot" : "Edit Time Slot"}
                </h3>
                <button
                  onClick={() => {
                    setEditingSlot(null);
                    setIsAddingNew(false);
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingSlot.title}
                    onChange={(e) =>
                      setEditingSlot({ ...editingSlot, title: e.target.value })
                    }
                    placeholder="e.g., Deep Work Session"
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(SLOT_TYPE_CONFIG) as SlotType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setEditingSlot({
                            ...editingSlot,
                            type,
                            color: SLOT_TYPE_CONFIG[type].color,
                          })
                        }
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          editingSlot.type === type
                            ? SLOT_TYPE_CONFIG[type].bgColor + " border-current"
                            : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {SLOT_TYPE_CONFIG[type].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Start Time
                    </label>
                    <select
                      value={editingSlot.startTime}
                      onChange={(e) =>
                        setEditingSlot({
                          ...editingSlot,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {TIME_HOURS.map((hour) => (
                        <option key={hour.value} value={hour.value}>
                          {hour.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      End Time
                    </label>
                    <select
                      value={editingSlot.endTime}
                      onChange={(e) =>
                        setEditingSlot({
                          ...editingSlot,
                          endTime: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {TIME_HOURS.map((hour) => (
                        <option key={hour.value} value={hour.value}>
                          {hour.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlot.description || ""}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        description: e.target.value,
                      })
                    }
                    placeholder="Add a note..."
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditingSlot(null);
                    setIsAddingNew(false);
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSlot}
                  disabled={!editingSlot.title.trim()}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isAddingNew ? "Add Slot" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSaveSchedule}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save Schedule
        </button>
      </div>
    </div>
  );
}
