"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  BookOpen,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  AlertCircle,
  X,
  Save,
  Search,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollege } from "@/features/college/hooks/use-college";
import { DAYS, CLASS_TYPE_CONFIG, EXAM_TYPE_CONFIG } from "@/features/college/types";
import type { DayOfWeek, Subject, TimetableSlot, Exam, ClassType } from "@/features/college/types";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SyllabusEditor } from "@/features/college/components";
import { CollegeDetailsForm } from "@/features/college/components";
import { getSyllabusSubjects } from "@/features/college/data/aktu-syllabus";
import { useToast } from "@/components/ui/toast";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

type TabType = "timetable" | "subjects" | "exams";

export default function CollegePage() {
  const { data, isLoaded, addSubject, updateSubject, deleteSubject, updateSyllabusTopics, addTimetableSlot, updateTimetableSlot, deleteTimetableSlot, addExam, deleteExam, getSubject, updateCollegeDetails, addSubjectsFromSyllabus } = useCollege();
  
  const [activeTab, setActiveTab] = useState<TabType>("timetable");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("monday");
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<"subject" | "slot" | "exam">("subject");
  const [isFetchingSyllabus, setIsFetchingSyllabus] = useState(false);
  const [examSearchQuery, setExamSearchQuery] = useState("");
  
  // Edit state
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingSlot, setEditingSlot] = useState<Partial<TimetableSlot> | null>(null);
  const [editingExam, setEditingExam] = useState<Partial<Exam> | null>(null);

  const tabs = [
    { id: "timetable" as const, label: "Timetable", icon: Calendar },
    { id: "subjects" as const, label: "Subjects", icon: BookOpen },
    { id: "exams" as const, label: "Exams", icon: AlertCircle },
  ];

  const daySlots = (data.timetable || [])
    .filter(slot => slot.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const upcomingExams = (data.exams || [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredExams = upcomingExams.filter(exam => 
    exam.title.toLowerCase().includes(examSearchQuery.toLowerCase()) ||
    getSubject(exam.subjectId)?.name.toLowerCase().includes(examSearchQuery.toLowerCase())
  );

  // Check if semester exam is coming soon (within 30 days)
  const semesterExamSoon = upcomingExams.some(exam => {
    const daysUntil = Math.ceil((new Date(exam.date).getTime() - Date.now()) / 86400000);
    return daysUntil > 0 && daysUntil <= 30;
  });

  // Handlers
  const handleAddSubject = () => {
    setEditingSubject({
      id: `sub-${Date.now()}`,
      name: "",
      code: "",
      instructor: "",
      color: "bg-blue-500",
      credits: 3,
      syllabusTopics: [],
      totalClasses: 0,
      attendedClasses: 0,
    });
    setModalType("subject");
    setShowAddModal(true);
  };

  const handleAddSlot = () => {
    setEditingSlot({
      id: `slot-${Date.now()}`,
      day: selectedDay,
      startTime: "09:00",
      endTime: "10:00",
      subjectId: data.subjects[0]?.id || "",
      type: "lecture",
      location: "",
      color: "bg-blue-500",
    });
    setModalType("slot");
    setShowAddModal(true);
  };

  const handleAddExam = () => {
    setEditingExam({
      id: `exam-${Date.now()}`,
      title: "",
      subjectId: data.subjects[0]?.id || "",
      date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      time: "10:00 AM",
      location: "",
      type: "internal",
      syllabus: [],
      notes: "",
    });
    setModalType("exam");
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (modalType === "subject" && editingSubject) {
      const exists = data.subjects.find(s => s.id === editingSubject.id);
      if (exists) {
        updateSubject(editingSubject.id, editingSubject);
      } else {
        addSubject(editingSubject);
      }
    } else if (modalType === "slot" && editingSlot) {
      const exists = data.timetable?.find(s => s.id === editingSlot.id);
      if (exists) {
        updateTimetableSlot(editingSlot.id!, editingSlot as TimetableSlot);
      } else {
        addTimetableSlot(editingSlot as TimetableSlot);
      }
    } else if (modalType === "exam" && editingExam) {
      addExam(editingExam as Exam);
    }
    
    setShowAddModal(false);
    setEditingSubject(null);
    setEditingSlot(null);
    setEditingExam(null);
  };

  const handleEditSlot = (slot: TimetableSlot) => {
    setEditingSlot({ ...slot });
    setModalType("slot");
    setShowAddModal(true);
  };

  const { addToast } = useToast();

  const handleFetchSyllabus = async () => {
    if (!data.collegeDetails) return;
    
    setIsFetchingSyllabus(true);
    
    // Simulate fetching syllabus from university
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get dynamic syllabus based on college details
    const syllabusSubjects = getSyllabusSubjects(
      data.collegeDetails.university,
      data.collegeDetails.course,
      data.collegeDetails.branch,
      data.collegeDetails.semester
    );
    
    if (syllabusSubjects && syllabusSubjects.length > 0) {
      const subjects: Subject[] = syllabusSubjects.map((s, index) => ({
        id: `sub-${Date.now()}-${index + 1}`,
        name: s.name,
        code: s.code,
        instructor: "",
        color: s.color,
        credits: s.credits,
        syllabusTopics: s.topics.map((topic, tIndex) => ({
          id: `t${tIndex + 1}`,
          name: topic,
          completed: false,
        })),
        totalClasses: 0,
        attendedClasses: 0,
      }));
      
      addSubjectsFromSyllabus(subjects);
      addToast(`Syllabus loaded: ${subjects.length} subjects for ${data.collegeDetails.branch} Semester ${data.collegeDetails.semester}`, "success");
    } else {
      addToast(`No syllabus data available for ${data.collegeDetails.branch} Semester ${data.collegeDetails.semester}. You can add subjects manually.`, "warning");
    }
    
    setIsFetchingSyllabus(false);
  };



  if (!isLoaded) {
    return (
      <PageWrapper title="College Planner" subtitle="Manage your academic schedule">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="College Planner"
      subtitle={`${data.semester} • ${data.subjects.length} subjects`}
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* College Details Form */}
        <CollegeDetailsForm
          details={data.collegeDetails}
          onSave={updateCollegeDetails}
          onFetchSyllabus={handleFetchSyllabus}
          isFetching={isFetchingSyllabus}
        />

        {/* Stats Overview */}
        <motion.div variants={item} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Subjects", value: data.subjects.length, icon: BookOpen, gradient: "from-blue-500 to-cyan-400" },
            { label: "Today's Classes", value: (data.timetable || []).filter(s => s.day === new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()).length, icon: Calendar, gradient: "from-green-500 to-emerald-400" },
            { label: "Upcoming Exams", value: upcomingExams.filter(e => new Date(e.date) > new Date()).length, icon: AlertCircle, gradient: "from-accentOrange to-amber-400" },
          ].map((stat, i) => (
            <AnimatedCard key={stat.label} delay={i * 0.1} hoverEffect="lift" className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground/70">{stat.label}</p>
                  <div className="mt-2">
                    <AnimatedCounter value={stat.value} className="text-3xl font-bold text-foreground" />
                  </div>
                </div>
                <div className={cn("rounded-xl bg-gradient-to-br p-3 shadow-lg", stat.gradient)}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </AnimatedCard>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-1 shadow-sm">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timetable Tab */}
        {activeTab === "timetable" && (
          <motion.div
            key="timetable"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Day Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {DAYS.map((day) => {
                const slotCount = (data.timetable || []).filter(s => s.day === day.value).length;
                return (
                  <motion.button
                    key={day.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDay(day.value)}
                    className={cn(
                      "flex flex-col items-center rounded-xl px-4 py-3 transition-all duration-200 min-w-[90px]",
                      selectedDay === day.value
                        ? "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="text-xs font-semibold">{day.shortLabel}</span>
                    <span className="text-[10px] mt-1 font-medium">{slotCount} classes</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Day's Schedule */}
            <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">
                  {DAYS.find(d => d.value === selectedDay)?.label}&apos;s Classes
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddSlot}
                  disabled={data.subjects.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" /> Add Class
                </motion.button>
              </div>

              <div className="space-y-3">
                {daySlots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-12">
                    <Clock className="h-8 w-8 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground/60 font-medium">No classes scheduled for this day</p>
                    {data.subjects.length > 0 && (
                      <button
                        onClick={handleAddSlot}
                        className="mt-4 flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" /> Add Your First Class
                      </button>
                    )}
                  </div>
                ) : (
                  daySlots.map((slot, index) => {
                    const subject = getSubject(slot.subjectId);
                    const typeConfig = CLASS_TYPE_CONFIG[slot.type];
                    return (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/15 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-muted/30 border border-border/50">
                          <span className="text-xs font-semibold text-foreground">{slot.startTime}</span>
                          <span className="text-[10px] text-muted-foreground/40">to</span>
                          <span className="text-xs font-semibold text-foreground">{slot.endTime}</span>
                        </div>
                        <div className={cn("h-10 w-1 rounded-full flex-shrink-0", slot.color)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{subject?.name || "Unknown Subject"}</h4>
                            <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize border border-border/50", typeConfig.bgColor)}>
                              {typeConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/60">
                            <span>{subject?.code}</span>
                            {slot.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {slot.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditSlot(slot)}
                            className="rounded-lg p-2 text-muted-foreground/40 hover:bg-primary/10 hover:text-primary transition-colors"
                            title="Edit class"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteTimetableSlot(slot.id)}
                            className="rounded-lg p-2 text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Delete class"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Subjects Tab */}
        {activeTab === "subjects" && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddSubject}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
              >
                <Plus className="h-4 w-4" /> Add Subject
              </motion.button>
            </div>

            {data.subjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No subjects added yet</h3>
                <p className="text-sm text-muted-foreground/60 mb-4">Add your subjects or fetch syllabus from your university</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleFetchSyllabus}
                    disabled={isFetchingSyllabus || !data.collegeDetails}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all duration-200"
                  >
                    {isFetchingSyllabus ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Fetch Syllabus
                  </button>
                  <button
                    onClick={handleAddSubject}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" /> Add Manually
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.subjects.map((subject, index) => {
                  const completedTopics = subject.syllabusTopics.filter(t => t.completed).length;
                  const totalTopics = subject.syllabusTopics.length;
                  
                  return (
                    <AnimatedCard key={subject.id} delay={index * 0.1} hoverEffect="lift" className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-3 w-3 rounded-full", subject.color)} />
                          <div>
                            <h3 className="font-semibold text-foreground">{subject.name}</h3>
                            <p className="text-xs text-muted-foreground/60">{subject.code} • {subject.credits} credits</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteSubject(subject.id)}
                          className="rounded-lg p-1.5 text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground/60">Instructor</span>
                            <span className="font-medium text-foreground">{subject.instructor}</span>
                          </div>
                        </div>

                        {totalTopics > 0 && (
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground/60">Syllabus</span>
                              <span className="font-medium text-foreground">{completedTopics}/{totalTopics}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${(completedTopics / totalTopics) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Syllabus Editor */}
                      <SyllabusEditor
                        subject={subject}
                        onUpdateTopics={updateSyllabusTopics}
                      />
                    </AnimatedCard>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Exams Tab */}
        {activeTab === "exams" && (
          <motion.div
            key="exams"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Semester Exam Status Banner */}
            {semesterExamSoon && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-accentOrange/20 bg-gradient-to-r from-accentOrange/10 to-amber-500/10 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accentOrange/20 p-2">
                    <AlertCircle className="h-5 w-5 text-accentOrange" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Semester exams coming soon!</p>
                    <p className="text-xs text-muted-foreground/70">You have exams scheduled within the next 30 days</p>
                  </div>
                  <button onClick={() => setActiveTab("exams")} className="flex items-center gap-1.5 rounded-lg bg-accentOrange/20 px-3 py-1.5 text-xs font-medium text-accentOrange hover:bg-accentOrange/30 transition-colors">
                    <ExternalLink className="h-3 w-3" />
                    View Exams
                  </button>
                </div>
              </motion.div>
            )}

            {/* Exam Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
              <input
                type="text"
                placeholder="Search exams..."
                value={examSearchQuery}
                onChange={(e) => setExamSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
              />
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddExam}
                disabled={data.subjects.length === 0}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all duration-200"
              >
                <Plus className="h-4 w-4" /> Add Exam
              </motion.button>
            </div>

            {filteredExams.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20">
                <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {examSearchQuery ? "No exams found" : "No exams scheduled"}
                </h3>
                <p className="text-sm text-muted-foreground/60 mb-4">
                  {examSearchQuery 
                    ? "Try a different search term" 
                    : data.collegeDetails 
                      ? "Add your exams or check your university's exam schedule"
                      : "Set up your college details first to fetch exam schedules"
                  }
                </p>
                {!examSearchQuery && data.collegeDetails && (
                  <button onClick={handleAddExam} className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    Add Your First Exam
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExams.map((exam, index) => {
                  const subject = getSubject(exam.subjectId);
                  const examConfig = EXAM_TYPE_CONFIG[exam.type];
                  const daysUntil = Math.ceil((new Date(exam.date).getTime() - Date.now()) / 86400000);
                  
                  return (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="rounded-xl border border-border bg-card p-4 hover:border-primary/15 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white text-xs font-bold", examConfig.color)}>
                          {new Date(exam.date).getDate()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{exam.title}</h4>
                            <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize bg-white/10")}>
                              {examConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/60">
                            <span>{subject?.name}</span>
                            <span>{exam.time}</span>
                            <span>{exam.location}</span>
                          </div>
                          {daysUntil > 0 && (
                            <p className={cn("mt-2 text-xs font-medium", daysUntil <= 7 ? "text-accentOrange" : "text-muted-foreground/60")}>
                              {daysUntil} days remaining
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteExam(exam.id)}
                          className="rounded-lg p-2 text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-foreground">
                  {modalType === "subject" && (editingSubject?.id.startsWith("sub-") && data.subjects.find(s => s.id === editingSubject?.id) ? "Edit Subject" : "Add Subject")}
                  {modalType === "slot" && (editingSlot?.id && data.timetable?.find(s => s.id === editingSlot.id) ? "Edit Class" : "Add Class to Timetable")}
                  {modalType === "exam" && "Add Exam"}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted/60 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Subject Form */}
                {modalType === "subject" && editingSubject && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Subject Name</label>
                      <input
                        type="text"
                        value={editingSubject.name}
                        onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                        placeholder="e.g., Data Structures"
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Course Code</label>
                        <input
                          type="text"
                          value={editingSubject.code}
                          onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                          placeholder="CS201"
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Credits</label>
                        <input
                          type="number"
                          value={editingSubject.credits}
                          onChange={(e) => setEditingSubject({ ...editingSubject, credits: parseInt(e.target.value) || 0 })}
                          min="1"
                          max="6"
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Instructor</label>
                      <input
                        type="text"
                        value={editingSubject.instructor}
                        onChange={(e) => setEditingSubject({ ...editingSubject, instructor: e.target.value })}
                        placeholder="Dr. Smith"
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Color</label>
                      <div className="flex gap-2">
                        {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-accentOrange", "bg-pink-500", "bg-teal-500"].map((color) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingSubject({ ...editingSubject, color })}
                            className={cn("h-8 w-8 rounded-full transition-all", color, editingSubject.color === color && "ring-2 ring-offset-2 ring-primary")}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Timetable Slot Form */}
                {modalType === "slot" && editingSlot && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                      <select
                        value={editingSlot.subjectId}
                        onChange={(e) => {
                          const subject = getSubject(e.target.value);
                          setEditingSlot({ ...editingSlot, subjectId: e.target.value, color: subject?.color || "bg-gray-500" });
                        }}
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                      >
                        {data.subjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Start Time</label>
                        <input
                          type="time"
                          value={editingSlot.startTime}
                          onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">End Time</label>
                        <input
                          type="time"
                          value={editingSlot.endTime}
                          onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Day</label>
                        <select
                          value={editingSlot.day}
                          onChange={(e) => setEditingSlot({ ...editingSlot, day: e.target.value as DayOfWeek })}
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        >
                          {DAYS.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Type</label>
                        <select
                          value={editingSlot.type}
                          onChange={(e) => setEditingSlot({ ...editingSlot, type: e.target.value as ClassType })}
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        >
                          {Object.entries(CLASS_TYPE_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Location</label>
                      <input
                        type="text"
                        value={editingSlot.location}
                        onChange={(e) => setEditingSlot({ ...editingSlot, location: e.target.value })}
                        placeholder="Room 301"
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                      />
                    </div>
                  </>
                )}

                {/* Exam Form */}
                {modalType === "exam" && editingExam && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Exam Title</label>
                      <input
                        type="text"
                        value={editingExam.title}
                        onChange={(e) => setEditingExam({ ...editingExam, title: e.target.value })}
                        placeholder="e.g., Mid Semester Exam"
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                      <select
                        value={editingExam.subjectId}
                        onChange={(e) => setEditingExam({ ...editingExam, subjectId: e.target.value })}
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                      >
                        {data.subjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Date</label>
                        <input
                          type="date"
                          value={editingExam.date}
                          onChange={(e) => setEditingExam({ ...editingExam, date: e.target.value })}
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Time</label>
                        <input
                          type="text"
                          value={editingExam.time}
                          onChange={(e) => setEditingExam({ ...editingExam, time: e.target.value })}
                          placeholder="10:00 AM"
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Location</label>
                        <input
                          type="text"
                          value={editingExam.location}
                          onChange={(e) => setEditingExam({ ...editingExam, location: e.target.value })}
                          placeholder="Exam Hall A"
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Type</label>
                        <select
                          value={editingExam.type}
                          onChange={(e) => setEditingExam({ ...editingExam, type: e.target.value as any })}
                          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                        >
                          {Object.entries(EXAM_TYPE_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={
                    (modalType === "subject" && !editingSubject?.name) ||
                    (modalType === "slot" && !editingSlot?.subjectId) ||
                    (modalType === "exam" && !editingExam?.title)
                  }
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all duration-200"
                >
                  <Save className="h-4 w-4" /> Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}