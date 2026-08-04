/**
 * Shared Roadmap Data
 *
 * Extracted from roadmap pages for cross-feature access (e.g., task generation).
 */

export interface RoadmapTopic {
  id: string;
  name: string;
  phase: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
  resources: number;
}

export interface RoadmapPhase {
  name: string;
  color: string;
  gradient: string;
}

// ============================================
// Programming Roadmap
// ============================================

export const programmingRoadmapItems: RoadmapTopic[] = [
  { id: "p1", name: "HTML & CSS Fundamentals", phase: "Foundation", status: "completed", progress: 100, resources: 12 },
  { id: "p2", name: "JavaScript Basics", phase: "Foundation", status: "completed", progress: 100, resources: 15 },
  { id: "p3", name: "TypeScript", phase: "Foundation", status: "in-progress", progress: 45, resources: 8 },
  { id: "p4", name: "React & Next.js", phase: "Frontend", status: "pending", progress: 0, resources: 20 },
  { id: "p5", name: "Node.js & Express", phase: "Backend", status: "pending", progress: 0, resources: 18 },
  { id: "p6", name: "PostgreSQL & Prisma", phase: "Database", status: "pending", progress: 0, resources: 10 },
  { id: "p7", name: "REST APIs & GraphQL", phase: "Backend", status: "pending", progress: 0, resources: 14 },
  { id: "p8", name: "Docker & Deployment", phase: "DevOps", status: "pending", progress: 0, resources: 12 },
  { id: "p9", name: "Testing (Jest, Cypress)", phase: "Quality", status: "pending", progress: 0, resources: 10 },
  { id: "p10", name: "System Design", phase: "Architecture", status: "pending", progress: 0, resources: 15 },
];

export const programmingPhases: RoadmapPhase[] = [
  { name: "Foundation", color: "text-blue-500", gradient: "from-blue-500 to-cyan-500" },
  { name: "Frontend", color: "text-purple-500", gradient: "from-purple-500 to-pink-500" },
  { name: "Backend", color: "text-green-500", gradient: "from-green-500 to-emerald-500" },
  { name: "Database", color: "text-orange-500", gradient: "from-orange-500 to-red-500" },
  { name: "DevOps", color: "text-cyan-500", gradient: "from-cyan-500 to-blue-500" },
  { name: "Quality", color: "text-yellow-500", gradient: "from-yellow-500 to-orange-500" },
  { name: "Architecture", color: "text-pink-500", gradient: "from-pink-500 to-rose-500" },
];

// ============================================
// ML Roadmap
// ============================================

export const mlRoadmapItems: RoadmapTopic[] = [
  { id: "m1", name: "Python Basics", phase: "Foundation", status: "completed", progress: 100, resources: 8 },
  { id: "m2", name: "Mathematics for ML", phase: "Foundation", status: "completed", progress: 100, resources: 10 },
  { id: "m3", name: "NumPy & Pandas", phase: "Tools", status: "in-progress", progress: 60, resources: 6 },
  { id: "m4", name: "Data Visualization", phase: "Tools", status: "pending", progress: 0, resources: 5 },
  { id: "m5", name: "Machine Learning Basics", phase: "Core ML", status: "pending", progress: 0, resources: 15 },
  { id: "m6", name: "Supervised Learning", phase: "Core ML", status: "pending", progress: 0, resources: 12 },
  { id: "m7", name: "Unsupervised Learning", phase: "Core ML", status: "pending", progress: 0, resources: 10 },
  { id: "m8", name: "Neural Networks", phase: "Deep Learning", status: "pending", progress: 0, resources: 12 },
  { id: "m9", name: "CNNs & Computer Vision", phase: "Deep Learning", status: "pending", progress: 0, resources: 15 },
  { id: "m10", name: "NLP & Transformers", phase: "Deep Learning", status: "pending", progress: 0, resources: 14 },
  { id: "m11", name: "LLMs & Fine-tuning", phase: "Advanced", status: "pending", progress: 0, resources: 10 },
  { id: "m12", name: "MLOps & Deployment", phase: "Advanced", status: "pending", progress: 0, resources: 8 },
];

export const mlPhases: RoadmapPhase[] = [
  { name: "Foundation", color: "text-blue-500", gradient: "from-blue-500 to-cyan-500" },
  { name: "Tools", color: "text-purple-500", gradient: "from-purple-500 to-pink-500" },
  { name: "Core ML", color: "text-green-500", gradient: "from-green-500 to-emerald-500" },
  { name: "Deep Learning", color: "text-orange-500", gradient: "from-orange-500 to-red-500" },
  { name: "Advanced", color: "text-cyan-500", gradient: "from-cyan-500 to-blue-500" },
];
