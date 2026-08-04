/**
 * AKTU B.Tech CSE Syllabus Data
 * Based on Dr. A.P.J. Abdul Kalam Technical University curriculum
 * Source: https://aktu.ac.in/syllabus.html
 */

export interface SyllabusSubject {
  name: string;
  code: string;
  credits: number;
  color: string;
  topics: string[];
}

export interface SemesterSyllabus {
  semester: number;
  subjects: SyllabusSubject[];
}

export interface BranchSyllabus {
  branch: string;
  semesters: SemesterSyllabus[];
}

export interface UniversitySyllabus {
  university: string;
  course: string;
  branches: BranchSyllabus[];
}

// Color palette for subjects
const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-accentOrange",
  "bg-pink-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-amber-500",
];

function getColor(index: number): string {
  return COLORS[index % COLORS.length];
}

// ============================================
// AKTU B.Tech CSE Syllabus
// ============================================

const aktuCSE: BranchSyllabus = {
  branch: "Computer Science",
  semesters: [
    // 1st Semester
    {
      semester: 1,
      subjects: [
        {
          name: "Engineering Mathematics-I",
          code: "BAS101",
          credits: 4,
          color: getColor(0),
          topics: [
            "Matrices & Determinants",
            "Differential Calculus",
            "Integral Calculus",
            "Multivariable Calculus",
            "Vector Calculus",
          ],
        },
        {
          name: "Engineering Physics",
          code: "BAS103",
          credits: 3,
          color: getColor(1),
          topics: [
            "Wave Motion & Optics",
            "Quantum Mechanics",
            "Electromagnetic Theory",
            "Semiconductor Physics",
            "Superconductivity",
          ],
        },
        {
          name: "Engineering Chemistry",
          code: "BAS105",
          credits: 3,
          color: getColor(2),
          topics: [
            "Water Technology",
            "Polymers",
            "Electrochemistry",
            "Corrosion & Prevention",
            "Fuels & Lubricants",
          ],
        },
        {
          name: "Basic Electrical Engineering",
          code: "BAE101",
          credits: 3,
          color: getColor(3),
          topics: [
            "DC Circuits",
            "AC Circuits",
            "Transformers",
            "DC Machines",
            "AC Machines",
          ],
        },
        {
          name: "Engineering Graphics",
          code: "BME101",
          credits: 3,
          color: getColor(4),
          topics: [
            "Engineering Curves",
            "Projection of Points & Lines",
            "Projection of Planes & Solids",
            "Sections & Development",
            "Isometric & Perspective Projections",
          ],
        },
        {
          name: "Workshop Practice",
          code: "BME151",
          credits: 2,
          color: getColor(5),
          topics: [
            "Fitting Operations",
            "Welding Operations",
            "Carpentry",
            "Foundry Operations",
            "Machine Tools Introduction",
          ],
        },
      ],
    },
    // 2nd Semester
    {
      semester: 2,
      subjects: [
        {
          name: "Engineering Mathematics-II",
          code: "BAS201",
          credits: 4,
          color: getColor(0),
          topics: [
            "Linear Algebra",
            "Differential Equations",
            "Laplace Transforms",
            "Fourier Series",
            "Complex Analysis",
          ],
        },
        {
          name: "Environment Science",
          code: "BAS203",
          credits: 3,
          color: getColor(1),
          topics: [
            "Ecology & Ecosystems",
            "Environmental Pollution",
            "Natural Resources",
            "Biodiversity",
            "Environmental Management",
          ],
        },
        {
          name: "Professional Communication",
          code: "BAS205",
          credits: 3,
          color: getColor(2),
          topics: [
            "Communication Skills",
            "Technical Writing",
            "Presentation Skills",
            "Group Discussion",
            "Report Writing",
          ],
        },
        {
          name: "Basic Electronics",
          code: "BAE201",
          credits: 3,
          color: getColor(3),
          topics: [
            "Semiconductor Diodes",
            "BJT & FET",
            "Amplifiers",
            "Oscillators",
            "Digital Electronics Basics",
          ],
        },
        {
          name: "Engineering Mechanics",
          code: "BCE201",
          credits: 3,
          color: getColor(4),
          topics: [
            "Force Systems",
            "Equilibrium",
            "Friction",
            "Moments of Inertia",
            "Work, Energy & Power",
          ],
        },
        {
          name: "Programming in C",
          code: "BCS201",
          credits: 3,
          color: getColor(5),
          topics: [
            "C Fundamentals",
            "Control Structures",
            "Arrays & Strings",
            "Functions & Pointers",
            "Structures & File I/O",
          ],
        },
      ],
    },
    // 3rd Semester
    {
      semester: 3,
      subjects: [
        {
          name: "Engineering Mathematics-III",
          code: "BAS301",
          credits: 4,
          color: getColor(0),
          topics: [
            "Probability & Statistics",
            "Numerical Methods",
            "Transform Techniques",
            "Linear Programming",
            "Discrete Mathematics",
          ],
        },
        {
          name: "Data Structures & Algorithms",
          code: "BCS301",
          credits: 4,
          color: getColor(1),
          topics: [
            "Arrays & Linked Lists",
            "Stacks & Queues",
            "Trees & Binary Search Trees",
            "Graphs",
            "Sorting & Searching Algorithms",
            "Hash Tables",
            "Algorithm Analysis",
          ],
        },
        {
          name: "Computer Organization & Architecture",
          code: "BCS303",
          credits: 4,
          color: getColor(2),
          topics: [
            "Number Systems & Codes",
            "Computer Arithmetic",
            "Processor Organization",
            "Memory Organization",
            "I/O Organization",
            "Pipeline Processing",
          ],
        },
        {
          name: "Object Oriented Programming",
          code: "BCS305",
          credits: 3,
          color: getColor(3),
          topics: [
            "OOP Concepts",
            "Classes & Objects",
            "Inheritance & Polymorphism",
            "Exception Handling",
            "File Handling",
            "Templates & STL",
          ],
        },
        {
          name: "Digital Electronics",
          code: "BCE301",
          credits: 3,
          color: getColor(4),
          topics: [
            "Boolean Algebra",
            "Logic Gates",
            "Combinational Circuits",
            "Sequential Circuits",
            "Memory & Programmable Logic",
          ],
        },
        {
          name: "Discrete Mathematics",
          code: "BAS303",
          credits: 3,
          color: getColor(5),
          topics: [
            "Sets & Relations",
            "Functions",
            "Graph Theory",
            "Trees",
            "Combinatorics",
            "Propositional Logic",
          ],
        },
      ],
    },
    // 4th Semester (User's current semester)
    {
      semester: 4,
      subjects: [
        {
          name: "Data Structures & Algorithms",
          code: "BCS401",
          credits: 4,
          color: getColor(0),
          topics: [
            "Advanced Sorting Algorithms",
            "Graph Algorithms (BFS, DFS)",
            "Shortest Path Algorithms",
            "Minimum Spanning Trees",
            "Dynamic Programming",
            "Greedy Algorithms",
            "Backtracking",
            "Algorithm Complexity Analysis",
          ],
        },
        {
          name: "Computer Organization & Architecture",
          code: "BCS403",
          credits: 4,
          color: getColor(1),
          topics: [
            "Instruction Set Architecture",
            "CPU Design & Control Unit",
            "Memory Hierarchy & Cache",
            "Pipeline Processing",
            "RISC vs CISC Architecture",
            "Parallel Processing",
            "I/O Techniques & DMA",
          ],
        },
        {
          name: "Python Programming",
          code: "BCC401",
          credits: 3,
          color: getColor(2),
          topics: [
            "Python Basics & Syntax",
            "Data Structures in Python",
            "Functions & Modules",
            "File Handling",
            "Object-Oriented Programming in Python",
            "Exception Handling",
            "Regular Expressions",
            "Introduction to Libraries (NumPy, Pandas)",
          ],
        },
        {
          name: "Technical Communication",
          code: "BAS401",
          credits: 3,
          color: getColor(3),
          topics: [
            "Communication Fundamentals",
            "Technical Writing Skills",
            "Report & Proposal Writing",
            "Presentation Techniques",
            "Group Discussion & Interview Skills",
            "Business Communication",
          ],
        },
        {
          name: "Mathematics-IV",
          code: "BAS403",
          credits: 4,
          color: getColor(4),
          topics: [
            "Partial Differential Equations",
            "Probability & Statistics",
            "Numerical Analysis",
            "Sampling & Hypothesis Testing",
            "Correlation & Regression",
            "Statistical Distributions",
          ],
        },
        {
          name: "Design & Simulation of System Software using Linux",
          code: "BCC403",
          credits: 3,
          color: getColor(5),
          topics: [
            "Linux Operating System Basics",
            "Shell Programming",
            "System Calls & Process Management",
            "Assembly Language Programming",
            "Lex & Yacc (Compiler Tools)",
            "System Software Design",
          ],
        },
      ],
    },
    // 5th Semester
    {
      semester: 5,
      subjects: [
        {
          name: "Operating Systems",
          code: "BCS501",
          credits: 4,
          color: getColor(0),
          topics: [
            "OS Concepts & Functions",
            "Process Management",
            "CPU Scheduling Algorithms",
            "Memory Management & Virtual Memory",
            "Deadlocks",
            "File Systems",
            "I/O Management",
          ],
        },
        {
          name: "Computer Networks",
          code: "BCS503",
          credits: 4,
          color: getColor(1),
          topics: [
            "Network Models (OSI & TCP/IP)",
            "Data Link Layer",
            "Network Layer & Routing",
            "Transport Layer",
            "Application Layer Protocols",
            "Network Security Basics",
          ],
        },
        {
          name: "Theory of Computation",
          code: "BCS505",
          credits: 3,
          color: getColor(2),
          topics: [
            "Finite Automata",
            "Regular Expressions",
            "Context-Free Grammars",
            "Pushdown Automata",
            "Turing Machines",
            "Computability & Complexity",
          ],
        },
        {
          name: "Database Management Systems",
          code: "BCS507",
          credits: 3,
          color: getColor(3),
          topics: [
            "ER Model & Relational Model",
            "SQL Queries",
            "Normalization",
            "Transaction Management",
            "Indexing & Hashing",
            "Query Processing",
          ],
        },
        {
          name: "Software Engineering",
          code: "BCS509",
          credits: 3,
          color: getColor(4),
          topics: [
            "SDLC Models",
            "Requirements Engineering",
            "Software Design",
            "Testing Strategies",
            "Project Management",
            "Software Maintenance",
          ],
        },
        {
          name: "Web Technologies",
          code: "BCC501",
          credits: 3,
          color: getColor(5),
          topics: [
            "HTML & CSS",
            "JavaScript Fundamentals",
            "DOM Manipulation",
            "AJAX & Fetch API",
            "Introduction to React/Angular",
            "Backend Basics (Node.js)",
          ],
        },
      ],
    },
    // 6th Semester
    {
      semester: 6,
      subjects: [
        {
          name: "Compiler Design",
          code: "BCS601",
          credits: 4,
          color: getColor(0),
          topics: [
            "Lexical Analysis",
            "Syntax Analysis (Parsing)",
            "Semantic Analysis",
            "Code Optimization",
            "Code Generation",
            "Error Handling",
          ],
        },
        {
          name: "Artificial Intelligence",
          code: "BCS603",
          credits: 3,
          color: getColor(1),
          topics: [
            "AI Fundamentals",
            "Search Algorithms",
            "Knowledge Representation",
            "Expert Systems",
            "Natural Language Processing",
            "Machine Learning Basics",
          ],
        },
        {
          name: "Machine Learning",
          code: "BCS605",
          credits: 3,
          color: getColor(2),
          topics: [
            "Supervised Learning",
            "Unsupervised Learning",
            "Neural Networks",
            "Decision Trees & Random Forests",
            "Support Vector Machines",
            "Model Evaluation",
          ],
        },
        {
          name: "Elective-I",
          code: "BCS6XX",
          credits: 3,
          color: getColor(3),
          topics: [
            "Cloud Computing",
            "Big Data Analytics",
            "Cyber Security",
            "Internet of Things",
            "Blockchain Technology",
          ],
        },
        {
          name: "Elective-II",
          code: "BCS6XX",
          credits: 3,
          color: getColor(4),
          topics: [
            "Deep Learning",
            "Computer Vision",
            "Natural Language Processing",
            "Robotics",
            "Quantum Computing",
          ],
        },
        {
          name: "Mini Project",
          code: "BCS661",
          credits: 2,
          color: getColor(5),
          topics: [
            "Project Planning",
            "Requirements Analysis",
            "Design & Development",
            "Testing & Deployment",
            "Documentation",
          ],
        },
      ],
    },
    // 7th Semester
    {
      semester: 7,
      subjects: [
        {
          name: "Internet of Things",
          code: "BCS701",
          credits: 3,
          color: getColor(0),
          topics: [
            "IoT Architecture",
            "Sensors & Actuators",
            "Communication Protocols",
            "Cloud Integration",
            "IoT Security",
            "Smart Applications",
          ],
        },
        {
          name: "Elective-III",
          code: "BCS7XX",
          credits: 3,
          color: getColor(1),
          topics: [
            "DevOps",
            "Microservices Architecture",
            "Mobile App Development",
            "Game Development",
            "AR/VR Technologies",
          ],
        },
        {
          name: "Elective-IV",
          code: "BCS7XX",
          credits: 3,
          color: getColor(2),
          topics: [
            "Data Mining",
            "Information Retrieval",
            "Semantic Web",
            "Grid Computing",
            "Autonomous Systems",
          ],
        },
        {
          name: "Major Project Phase-I",
          code: "BCS761",
          credits: 6,
          color: getColor(3),
          topics: [
            "Literature Survey",
            "Problem Definition",
            "System Design",
            "Prototype Development",
            "Progress Report",
          ],
        },
      ],
    },
    // 8th Semester
    {
      semester: 8,
      subjects: [
        {
          name: "Elective-V",
          code: "BCS8XX",
          credits: 3,
          color: getColor(0),
          topics: [
            "Advanced Machine Learning",
            "Quantum Computing",
            "Neuromorphic Computing",
            "Bioinformatics",
            "Computational Linguistics",
          ],
        },
        {
          name: "Professional Ethics",
          code: "BVE801",
          credits: 2,
          color: getColor(1),
          topics: [
            "Engineering Ethics",
            "Professional Responsibility",
            "Intellectual Property Rights",
            "Environmental Ethics",
            "Workplace Ethics",
          ],
        },
        {
          name: "Major Project Phase-II",
          code: "BCS861",
          credits: 10,
          color: getColor(2),
          topics: [
            "Implementation",
            "Testing & Validation",
            "Results Analysis",
            "Paper Writing",
            "Final Presentation",
          ],
        },
      ],
    },
  ],
};

// ============================================
// University Syllabus Registry
// ============================================

const universitySyllabi: UniversitySyllabus[] = [
  {
    university: "Abdul Kalam Technical University (AKTU, Lucknow)",
    course: "Bachelor of Technology (B.Tech)",
    branches: [aktuCSE],
  },
  {
    university: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
    course: "Bachelor of Technology (B.Tech)",
    branches: [aktuCSE],
  },
  {
    university: "Harcourt Butler Technical University (HBTU, Kanpur)",
    course: "Bachelor of Technology (B.Tech)",
    branches: [aktuCSE],
  },
];

/**
 * Get syllabus subjects based on university, course, branch, and semester
 */
export function getSyllabusSubjects(
  university: string,
  course: string,
  branch: string,
  semester: number
): SyllabusSubject[] | null {
  // Try to find matching university
  const uniSyllabus = universitySyllabi.find(
    (u) =>
      u.university === university &&
      u.course === course
  );

  if (!uniSyllabus) return null;

  // Try to find matching branch
  const branchSyllabus = uniSyllabus.branches.find(
    (b) =>
      b.branch === branch ||
      branch.toLowerCase().includes("computer")
  );

  if (!branchSyllabus) return null;

  // Find matching semester
  const semesterSyllabus = branchSyllabus.semesters.find(
    (s) => s.semester === semester
  );

  if (!semesterSyllabus) return null;

  return semesterSyllabus.subjects;
}

/**
 * Get all available semesters for a university/course/branch combination
 */
export function getAvailableSemesters(
  university: string,
  course: string,
  branch: string
): number[] {
  const uniSyllabus = universitySyllabi.find(
    (u) =>
      u.university === university &&
      u.course === course
  );

  if (!uniSyllabus) return [];

  const branchSyllabus = uniSyllabus.branches.find(
    (b) =>
      b.branch === branch ||
      branch.toLowerCase().includes("computer")
  );

  if (!branchSyllabus) return [];

  return branchSyllabus.semesters.map((s) => s.semester);
}
