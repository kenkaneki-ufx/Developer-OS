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
            "Unit I: Mathematical Methods - Matrix Algebra, Eigen Values & Vectors",
            "Unit II: Complex Analysis - Analytic Functions, Complex Integration",
            "Unit III: Laplace & Fourier Transforms",
            "Unit IV: Probability & Statistics - Random Variables, Distributions",
            "Unit V: Numerical Methods - Interpolation, Numerical Integration",
          ],
        },
        {
          name: "Data Structures",
          code: "BCS301",
          credits: 4,
          color: getColor(1),
          topics: [
            "Unit I: Basic Concepts - ADTs, Arrays, Linked Lists (Singly, Doubly, Circular)",
            "Unit II: Stacks, Queues, Priority Queues, Deques",
            "Unit III: Trees - Binary Trees, BST, AVL Trees, B-Trees, B+ Trees",
            "Unit IV: Graphs - BFS, DFS, Shortest Path, MST, Topological Sort",
            "Unit V: Hashing, File Structures, Sorting & Searching Algorithms",
          ],
        },
        {
          name: "Computer Organization & Architecture",
          code: "BCS303",
          credits: 4,
          color: getColor(2),
          topics: [
            "Unit I: Basic Structure of Computers, Computer Arithmetic (Integer & Floating Point)",
            "Unit II: Processor Organization - Register Transfer, Micro-operations, CPU Design",
            "Unit III: Control Unit - Hardwired & Microprogrammed, Pipeline Processing",
            "Unit IV: Memory Organization - Cache, Main Memory, Virtual Memory, Cache Mapping",
            "Unit V: Input-Output Organization - Interrupts, DMA, Bus Structures, RISC Architecture",
          ],
        },
        {
          name: "Object Oriented Programming using C++",
          code: "BCS304",
          credits: 3,
          color: getColor(3),
          topics: [
            "Unit I: OOP Concepts, C++ Basics, Classes & Objects, Constructors & Destructors",
            "Unit II: Inheritance - Single, Multiple, Multilevel, Hierarchical, Polymorphism",
            "Unit III: Virtual Functions, Abstract Classes, Templates (Function & Class)",
            "Unit IV: Exception Handling, Streams & File I/O",
            "Unit V: Standard Template Library (STL) - Containers, Iterators, Algorithms",
          ],
        },
        {
          name: "Digital Electronics",
          code: "BCS305",
          credits: 3,
          color: getColor(4),
          topics: [
            "Unit I: Number Systems & Codes, Boolean Algebra & Logic Gates",
            "Unit II: Combinational Circuits - Multiplexers, Decoders, Adders, Comparators",
            "Unit III: Sequential Circuits - Flip-Flops, Counters, Registers",
            "Unit IV: Memory & Programmable Logic, PLA, PAL, FPGA",
            "Unit V: A/D & D/A Converters, ASM Charts, Design of Digital Systems",
          ],
        },
        {
          name: "Environmental Science",
          code: "BES301",
          credits: 2,
          color: getColor(5),
          topics: [
            "Unit I: Ecology & Ecosystems, Biodiversity",
            "Unit II: Environmental Pollution - Air, Water, Soil",
            "Unit III: Natural Resources - Forest, Water, Mineral, Energy",
            "Unit IV: Environmental Management & Sustainability",
            "Unit V: Climate Change, Environmental Laws & Policies",
          ],
        },
        {
          name: "Data Structures Lab",
          code: "BCS351",
          credits: 1,
          color: getColor(6),
          topics: [
            "Implementation of Arrays, Linked Lists",
            "Stack & Queue Applications",
            "BST & AVL Tree Operations",
            "Graph Traversal (BFS/DFS)",
            "Sorting Algorithm Implementations",
          ],
        },
        {
          name: "OOP Lab (C++)",
          code: "BCS352",
          credits: 1,
          color: getColor(7),
          topics: [
            "Classes, Objects, Constructors",
            "Inheritance & Polymorphism Programs",
            "File Handling Programs",
            "Template & STL Usage",
            "Exception Handling Programs",
          ],
        },
      ],
    },
    // 4th Semester (User's current semester)
    {
      semester: 4,
      subjects: [
        {
          name: "Analysis & Design of Algorithms",
          code: "BCS401",
          credits: 4,
          color: getColor(0),
          topics: [
            "Unit I: Algorithm Analysis - Asymptotic Notations, Recurrences, Amortized Analysis",
            "Unit II: Divide & Conquer - Merge Sort, Quick Sort, Strassen's Matrix",
            "Unit III: Greedy Algorithms - Knapsack, Huffman Coding, Activity Selection, MST",
            "Unit IV: Dynamic Programming - Matrix Chain, Longest Common Subsequence, Knapsack",
            "Unit V: Backtracking, Branch & Bound, NP-Completeness, Approximation Algorithms",
          ],
        },
        {
          name: "Operating Systems",
          code: "BCS402",
          credits: 4,
          color: getColor(1),
          topics: [
            "Unit I: OS Introduction, OS Structures, System Calls, OS Services",
            "Unit II: Process Management - Processes, Threads, CPU Scheduling Algorithms",
            "Unit III: Concurrency - Process Synchronization, Deadlocks, Semaphores, Monitors",
            "Unit IV: Memory Management - Partitioning, Paging, Segmentation, Virtual Memory",
            "Unit V: Storage & File Systems - Disk Scheduling, File System Implementation, I/O Systems",
          ],
        },
        {
          name: "Database Management Systems",
          code: "BCS403",
          credits: 4,
          color: getColor(2),
          topics: [
            "Unit I: Database System Concepts, ER Model, Relational Model, Relational Algebra",
            "Unit II: SQL - DDL, DML, DCL, Joins, Subqueries, Views, Indexes",
            "Unit III: Normalization - 1NF to BCNF, Decomposition, Functional Dependencies",
            "Unit IV: Transaction Management - ACID Properties, Concurrency Control, Serializability",
            "Unit V: Query Processing & Optimization, File Structures, Indexing, Hashing",
          ],
        },
        {
          name: "Theory of Computation & Automata Theory",
          code: "BCS404",
          credits: 3,
          color: getColor(3),
          topics: [
            "Unit I: Finite Automata - DFA, NFA, Equivalence, Minimization",
            "Unit II: Regular Expressions & Languages, Pumping Lemma, Closure Properties",
            "Unit III: Context-Free Grammars, CFLs, Pushdown Automata, Pumping Lemma for CFL",
            "Unit IV: Turing Machines - Variants, Recursively Enumerable Languages, Decidability",
            "Unit V: Complexity Theory - P, NP, NP-Complete, Cook's Theorem, Space Complexity",
          ],
        },
        {
          name: "Probability & Statistics",
          code: "BAS401",
          credits: 3,
          color: getColor(4),
          topics: [
            "Unit I: Probability Axioms, Conditional Probability, Bayes Theorem",
            "Unit II: Random Variables - Discrete & Continuous, PDF, CDF, Expected Value",
            "Unit III: Statistical Distributions - Binomial, Poisson, Normal, Exponential",
            "Unit IV: Sampling Theory, Central Limit Theorem, Estimation & Hypothesis Testing",
            "Unit V: Correlation, Regression, ANOVA, Non-parametric Tests",
          ],
        },
        {
          name: "Python Programming",
          code: "BCC401",
          credits: 3,
          color: getColor(5),
          topics: [
            "Unit I: Python Basics - Variables, Data Types, Operators, Control Flow",
            "Unit II: Functions, Modules, Packages, Lambda, Map, Filter, Reduce",
            "Unit III: Data Structures - Lists, Tuples, Dictionaries, Sets, Comprehensions",
            "Unit IV: OOP in Python - Classes, Inheritance, Polymorphism, Encapsulation",
            "Unit V: File Handling, Exception Handling, Regular Expressions, Libraries (NumPy, Pandas)",
          ],
        },
        {
          name: "Algorithms Lab",
          code: "BCS451",
          credits: 1,
          color: getColor(6),
          topics: [
            "Implement Divide & Conquer algorithms",
            "Implement Greedy algorithms",
            "Implement Dynamic Programming solutions",
            "Graph algorithm implementations",
            "Backtracking & Branch & Bound problems",
          ],
        },
        {
          name: "OS Lab",
          code: "BCS452",
          credits: 1,
          color: getColor(7),
          topics: [
            "Process scheduling algorithm simulation",
            "Producer-Consumer, Reader-Writer problems",
            "Deadlock detection & avoidance",
            "Memory management simulation",
            "Disk scheduling algorithm implementations",
          ],
        },
        {
          name: "DBMS Lab",
          code: "BCS453",
          credits: 1,
          color: getColor(8),
          topics: [
            "SQL DDL, DML queries",
            "Complex joins and subqueries",
            "PL/SQL stored procedures & triggers",
            "Normalization exercises",
            "Database design projects",
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
