import type {
  AIServiceInterface,
  AIMessage,
  AICompletionOptions,
  AICompletionResponse,
  AIStreamChunk,
  AIConfig,
  AIProvider,
} from "../types";

/**
 * Dev-AI Provider - Built-in AI that works without API keys
 * Only answers questions related to Developer OS project
 * Uses compact documentation-style responses that fit chat boxes
 */
export class DevAIProvider implements AIServiceInterface {
  readonly provider: AIProvider = "devai";

  private defaultModel: string;

  constructor(config: AIConfig) {
    this.defaultModel = "dev-ai";
  }

  /**
   * Detect if the user message is related to Developer OS
   */
  private isProjectRelated(userMessage: string): boolean {
    return this.detectFeature(userMessage) !== null || this.isGeneralProjectQuery(userMessage);
  }

  private isGeneralProjectQuery(userMessage: string): boolean {
    const lowerMessage = userMessage.toLowerCase();
    
    const generalPatterns = [
      "developer os", "developer-os", "this project", "this app",
      "dashboard", "sidebar", "header", "navigation",
      "install", "setup", "run", "start", "deploy", "build",
      "feature", "functionality", "capability",
      "bug", "error", "issue", "problem", "fix", "debug",
      "nextjs", "next.js", "react", "typescript", "tailwind", "prisma",
      "database", "api", "component", "page", "route",
      "auth", "login", "signup", "authentication",
      "mobile", "desktop", "ui", "interface"
    ];

    return generalPatterns.some(pattern => lowerMessage.includes(pattern));
  }

  /**
   * Detect which feature the user is asking about
   */
  private detectFeature(userMessage: string): string | null {
    const lowerMessage = userMessage.toLowerCase();

    // Check DSA sub-topics first (more specific)
    const dsaTopicMatch = this.detectDSATopic(lowerMessage);
    if (dsaTopicMatch) return dsaTopicMatch;

    const featureDetection: Array<{ feature: string; patterns: string[] }> = [
      {
        feature: "college",
        patterns: [
          "college", "course", "semester", "subject", "assignment", "exam",
          "attendance", "grade", "gpa", "academic", "university", "school",
          "class", "lecture", "syllabus", "curriculum"
        ]
      },
      {
        feature: "dsa",
        patterns: [
          "dsa", "data structure", "algorithm", "leetcode", "coding problem"
        ]
      },
      {
        feature: "tasks",
        patterns: [
          "task", "todo", "to-do", "checklist", "action item", "work item",
          "deadline", "priority", "progress"
        ]
      },
      {
        feature: "notes",
        patterns: [
          "note", "notes", "markdown", "documentation", "journal", "memo"
        ]
      },
      {
        feature: "projects",
        patterns: [
          "project", "repository", "repo", "codebase", "portfolio"
        ]
      },
      {
        feature: "schedule",
        patterns: [
          "schedule", "calendar", "event", "meeting", "appointment",
          "planner", "timeline", "agenda", "reminder"
        ]
      },
      {
        feature: "github",
        patterns: [
          "github", "git", "commit", "branch", "merge", "pull request",
          "contribution"
        ]
      },
      {
        feature: "analytics",
        patterns: [
          "analytics", "stats", "statistics", "metrics", "dashboard",
          "chart", "report", "insight"
        ]
      },
      {
        feature: "settings",
        patterns: [
          "setting", "settings", "config", "configuration", "preference",
          "customize", "theme"
        ]
      },
      {
        feature: "ai",
        patterns: [
          "ai chat", "ai", "assistant", "chatbot", "artificial intelligence"
        ]
      },
      {
        feature: "roadmap",
        patterns: [
          "roadmap", "learning path", "ml", "machine learning"
        ]
      },
      {
        feature: "reviews",
        patterns: [
          "review", "reviews", "weekly review", "monthly review"
        ]
      }
    ];

    for (const { feature, patterns } of featureDetection) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        return feature;
      }
    }

    return null;
  }

  /**
   * Detect specific DSA topic
   */
  private detectDSATopic(lowerMessage: string): string | null {
    const dsaTopics: Array<{ topic: string; patterns: string[] }> = [
      {
        topic: "dsa_binary_tree",
        patterns: ["binary tree", "btree", "tree traversal", "inorder", "preorder", "postorder", "bst", "binary search tree"]
      },
      {
        topic: "dsa_linked_list",
        patterns: ["linked list", "singly linked", "doubly linked", "fast slow pointer"]
      },
      {
        topic: "dsa_dynamic_programming",
        patterns: ["dynamic programming", "dp", "memoization", "tabulation", "knapsack", "subsequence", "subarray sum"]
      },
      {
        topic: "dsa_graphs",
        patterns: ["graph", "bfs", "dfs", "dijkstra", "shortest path", "topological", "adjacency"]
      },
      {
        topic: "dsa_arrays",
        patterns: ["array", "two pointer", "sliding window", "prefix sum"]
      },
      {
        topic: "dsa_strings",
        patterns: ["string", "substring", "palindrome", "anagram"]
      },
      {
        topic: "dsa_hashing",
        patterns: ["hash", "hashmap", "hashset", "frequency map"]
      },
      {
        topic: "dsa_stack_queue",
        patterns: ["stack", "queue", "monotonic", "next greater", "valid parentheses"]
      },
      {
        topic: "dsa_sorting",
        patterns: ["sorting", "quick sort", "merge sort", "heap sort", "counting sort"]
      },
      {
        topic: "dsa_searching",
        patterns: ["searching", "binary search", "linear search"]
      },
      {
        topic: "dsa_recursion",
        patterns: ["recursion", "backtracking", "permutation", "combination"]
      },
      {
        topic: "dsa_bit_manipulation",
        patterns: ["bit manipulation", "bitwise", "xor", "mask"]
      }
    ];

    for (const { topic, patterns } of dsaTopics) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        return topic;
      }
    }

    return null;
  }

  /**
   * Get compact project overview that fits chat box
   */
  private getProjectOverview(): string {
    return `📚 DEVELOPER OS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your second brain for everything you study, learn, build, complete, review and track.

✨ CORE FEATURES

1. 🤖 AI-Powered Tasks - Smart task generation
2. 💻 DSA Tracking - Track DSA progress
3. 🧠 ML Roadmaps - Learning paths for ML
4. 🚀 Project Management - Track projects
5. 📝 Smart Notes - Markdown notes
6. 📊 Analytics - Productivity metrics
7. 🎓 College Planner - Course management
8. 🔗 GitHub Integration - Sync repositories
9. 📅 Schedule - Plan your days
10. 🎤 Reviews - Weekly/monthly reviews

🛠️ TECH STACK

• Frontend: Next.js 15, React 19, TypeScript, Tailwind
• Backend: Next.js API Routes, Prisma ORM
• Database: PostgreSQL
• Auth: NextAuth.js (GitHub, Google, Demo)
• AI: Built-in Dev-AI (no API keys needed!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask me about any feature!`;
  }

  /**
   * Get compact feature help that fits chat box
   */
  private getFeatureHelp(feature: string): string {
    const features: Record<string, string> = {
      "college": `🎓 COLLEGE PLANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Manage courses, track assignments, monitor grades, and stay on top of your academic life.

🚀 GETTING STARTED

1. Go to Dashboard → College
2. Add your courses and subjects
3. Set up semester timeline
4. Track assignments and exams

✨ KEY FEATURES

• Course Management
  - Add courses by semester
  - Track credit hours
  - Set schedules

• Assignment Tracking
  - Create with deadlines
  - Set priorities (High/Med/Low)
  - Get reminders

• Grade Management
  - Log grades
  - Calculate GPA
  - Track trends

• Attendance
  - Mark daily attendance
  - Track percentage
  - Get low attendance alerts

💡 PRO TIPS

• Add courses at semester start
• Update status daily for accuracy
• Maintain 85%+ attendance
• Review analytics weekly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How do I add a course?"`,

      "dsa": `💻 DSA TRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Master Data Structures & Algorithms. Track progress, monitor streaks, and prepare for interviews.

🚀 GETTING STARTED

1. Click DSA in sidebar
2. Choose a topic
3. Log solved problems
4. Rate confidence

✨ KEY FEATURES

• Topic Progress - Track 15+ DSA topics
• Difficulty Split - Easy/Medium/Hard
• Streak Tracking - Daily practice
• Goal Setting - Weekly/monthly targets
• Resources - Curated materials
• LeetCode Sync - Import problems

📚 TOPICS

Fundamentals: Arrays, Strings, Linked Lists
Trees: Binary Trees, BST, Trie
Graphs: BFS, DFS, Dijkstra
DP: Memoization, Tabulation, Knapsack
Searching: Binary Search
Sorting: Quick Sort, Merge Sort

💡 PRO TIPS

• Start with Easy problems
• Review weak topics with analytics
• Maintain your streak
• Focus on patterns, not memorization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Try asking about specific topics:
• "Tell me about binary trees"
• "How to solve dynamic programming?"
• "Explain graph algorithms"`,

      "dsa_binary_tree": `🌳 BINARY TREES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Binary trees are hierarchical data structures where each node has at most two children (left and right).

🚀 KEY CONCEPTS

• Tree Traversal
  - Inorder: Left → Root → Right
  - Preorder: Root → Left → Right
  - Postorder: Left → Right → Root
  - Level-order: BFS with queue

• Types
  - Binary Search Tree (BST): Left < Root < Right
  - Balanced: AVL, Red-Black Tree
  - Complete, Full, Perfect trees

✨ COMMON PATTERNS

• Recursion is natural for trees
• Use DFS for path problems
• Use BFS for level-by-level
• Height = max(left, right) + 1

📚 LEETCODE PROBLEMS

Easy: Invert Tree, Max Depth, Same Tree
Medium: Level Order, Validate BST
Hard: Binary Tree Cameras

💡 PRO TIPS

• Draw the tree to visualize
• Think recursively first
• Handle null/base cases

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to traverse a binary tree?"`,

      "dsa_linked_list": `🔗 LINKED LISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Linear data structure where elements are stored in nodes, each pointing to the next node.

🚀 KEY CONCEPTS

• Types
  - Singly: One pointer (next)
  - Doubly: Two pointers (prev, next)
  - Circular: Last points to first

• Core Operations
  - Insert: O(1) at head, O(n) at tail
  - Delete: Update pointers
  - Search: Traverse O(n)

✨ COMMON PATTERNS

• Fast & Slow Pointer (Floyd's)
  - Detect cycle
  - Find middle
  - Find kth from end

• Dummy Head Technique
  - Simplifies edge cases
  - Use for merge problems

📚 LEETCODE PROBLEMS

Easy: Reverse List, Merge Two Lists
Medium: Remove Nth From End, Reorder List
Hard: Merge K Sorted Lists

💡 PRO TIPS

• Always handle null pointers
• Draw nodes and pointers
• Use dummy node for edge cases

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to detect a cycle in linked list?"`,

      "dsa_dynamic_programming": `🧠 DYNAMIC PROGRAMMING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Optimization technique that solves complex problems by breaking them into simpler subproblems.

🚀 KEY CONCEPTS

• Two Approaches
  - Memoization: Top-down (recursion + cache)
  - Tabulation: Bottom-up (iterative + table)

• When to Use
  - Overlapping subproblems
  - Optimal substructure

✨ COMMON PATTERNS

• 1D DP: Climbing stairs, House robber
• 2D DP: LCS, Edit distance
• Knapsack: 0/1, Unbounded, Subset sum
• String DP: Palindrome, Subsequence

📚 TEMPLATE

1. Define state (what to track)
2. Write recurrence relation
3. Set base cases
4. Determine traversal order
5. Extract final answer

💡 PRO TIPS

• Start with brute force recursion
• Add memoization
• Convert to tabulation
• Optimize space if possible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to approach knapsack problems?"`,

      "dsa_graphs": `🕸️ GRAPHS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Network of nodes (vertices) connected by edges. Used for relationships, paths, and networks.

🚀 KEY CONCEPTS

• Representations
  - Adjacency List: Space efficient
  - Adjacency Matrix: Quick lookup

• Traversals
  - BFS: Level-by-level (queue)
  - DFS: Deep-first (stack/recursion)

✨ COMMON PATTERNS

• BFS: Shortest path, Level order
• DFS: Cycle detection, Topological sort
• Dijkstra: Weighted shortest path
• Union-Find: Connected components

📚 ALGORITHMS

• Dijkstra: Single source shortest path
• Bellman-Ford: Negative weights
• Kruskal/Prim: Minimum spanning tree
• Topological Sort: Task scheduling

💡 PRO TIPS

• BFS for shortest path (unweighted)
• DFS for exhaustive search
• Draw the graph first
• Mark visited to avoid cycles

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How does BFS differ from DFS?"`,

      "dsa_arrays": `📊 ARRAYS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Contiguous memory storage. Foundation for many data structures and algorithms.

🚀 KEY CONCEPTS

• Time Complexity
  - Access: O(1) by index
  - Search: O(n) unsorted, O(log n) sorted
  - Insert/Delete: O(n) worst case

✨ COMMON PATTERNS

• Two Pointers
  - Opposite ends (palindrome)
  - Same direction (remove duplicates)

• Sliding Window
  - Fixed size: Maximum/minimum sum
  - Variable size: Longest substring

• Prefix Sum
  - Range sum queries
  - Subarray sum equals k

📚 LEETCODE PROBLEMS

Easy: Two Sum, Best Time to Buy
Medium: Container With Most Water
Hard: Median of Two Sorted Arrays

💡 PRO TIPS

• Sort first if order doesn't matter
• Use hashmap for O(1) lookups
• Consider edge cases (empty, single)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to use sliding window technique?"`,

      "dsa_strings": `📝 STRINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Sequence of characters. Common in text processing, pattern matching, and parsing.

🚀 KEY CONCEPTS

• Character Operations
  - ASCII/Unicode values
  - Case conversion
  - Frequency counting

✨ COMMON PATTERNS

• Two Pointers
  - Palindrome check
  - Valid palindrome II

• Sliding Window
  - Longest substring without repeat
  - Minimum window substring

• String Building
  - StringBuilder for efficiency
  - Join with delimiter

📚 LEETCODE PROBLEMS

Easy: Valid Anagram, Reverse String
Medium: Longest Substring, Group Anagrams
Hard: Minimum Window Substring

💡 PRO TIPS

• Use character arrays for mutability
- Count characters for comparison
• Check empty strings first

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to check if strings are anagrams?"`,

      "dsa_hashing": `#️⃣ HASHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Key-value mapping for O(1) average lookup. Essential for optimizing search operations.

🚀 KEY CONCEPTS

• Hash Map
  - key → value mapping
  - Handle collisions

• Hash Set
  - Unique elements
  - Fast membership test

✨ COMMON PATTERNS

• Frequency Counting
  - Character frequency
  - Element frequency

• Two Sum Pattern
  - Store complements
  - Check if exists

• Grouping
  - Anagram grouping
  - Islands counting

📚 LEETCODE PROBLEMS

Easy: Two Sum, Contains Duplicate
Medium: Group Anagrams, Top K Frequent
Hard: Alien Dictionary

💡 PRO TIPS

• Use hashmap for O(1) lookups
• Store index with value when needed
• Consider collision handling

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to solve Two Sum problem?"`,

      "dsa_stack_queue": `📚 STACKS & QUEUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Stack: LIFO (Last In First Out)
Queue: FIFO (First In First Out)

🚀 STACK CONCEPTS

• Push/Pop: O(1) operations
• Use Cases: Undo, Parentheses, DFS

✨ STACK PATTERNS

• Monotonic Stack
  - Next greater element
  - Largest rectangle in histogram

• Valid Parentheses
  - Match opening/closing
  - Use stack to track

🚀 QUEUE CONCEPTS

• Enqueue/Dequeue: O(1) operations
• Use Cases: BFS, Scheduling

✨ QUEUE PATTERNS

• BFS with Queue
  - Level order traversal
  - Shortest path

📚 LEETCODE PROBLEMS

Easy: Valid Parentheses, Min Stack
Medium: Daily Temperatures, Decode String
Hard: Largest Rectangle

💡 PRO TIPS

• Stack for DFS, Queue for BFS
• Monotonic stack for next greater
• Deque for sliding window max

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How does monotonic stack work?"`,

      "dsa_sorting": `🔄 SORTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Arranging elements in order. Essential for many algorithms and data processing.

🚀 KEY ALGORITHMS

• Quick Sort: O(n log n) average
  - Divide and conquer
  - In-place sorting

• Merge Sort: O(n log n) guaranteed
  - Stable sort
  - Uses extra space

• Heap Sort: O(n log n)
  - In-place
  - Not stable

✨ COMPARISON

Algorithm    | Best    | Average | Worst   | Space
-------------|---------|---------|---------|-------
Quick Sort   | n log n | n log n | n²      | log n
Merge Sort   | n log n | n log n | n log n | n
Heap Sort    | n log n | n log n | n log n | 1

💡 PRO TIPS

• Quick sort for general purpose
• Merge sort for stability needed
• Counting sort for limited range
• Use built-in sort when possible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "When to use merge sort vs quick sort?"`,

      "dsa_searching": `🔍 SEARCHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Finding elements in data structures. Fundamental for many algorithms.

🚀 KEY ALGORITHMS

• Linear Search: O(n)
  - Check each element
  - Works on unsorted data

• Binary Search: O(log n)
  - Divide and conquer
  - Requires sorted data

✨ BINARY SEARCH PATTERNS

• Classic: Find target in sorted array
• Left Bound: Find first occurrence
• Right Bound: Find last occurrence
• Search Space: Find minimum/maximum

📚 TEMPLATE

while left <= right:
  mid = (left + right) // 2
  if arr[mid] == target:
    return mid
  elif arr[mid] < target:
    left = mid + 1
  else:
    right = mid - 1

💡 PRO TIPS

• Check for overflow in mid calculation
• Handle edge cases (empty, single)
• Consider what to return if not found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to implement binary search?"`,

      "dsa_recursion": `🔁 RECURSION & BACKTRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Recursion: Function calls itself
Backtracking: Explore all solutions, backtrack on failure

🚀 KEY CONCEPTS

• Base Case: Stop condition
• Recursive Case: Continue calling
• Stack Space: O(depth)

✨ BACKTRACKING PATTERNS

• Permutations: All arrangements
• Combinations: All subsets
• N-Queens: Constraint satisfaction
• Sudoku: Puzzle solving

📚 TEMPLATE

def backtrack(path, choices):
  if no more choices:
    result.add(path)
    return
  for choice in choices:
    if valid(choice):
      path.add(choice)
      backtrack(path, remaining)
      path.remove(choice)  # backtrack

💡 PRO TIPS

• Draw recursion tree
• Identify base case first
• Use backtracking for "all solutions"
• Prune impossible paths early

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to generate all permutations?"`,

      "dsa_bit_manipulation": `🔢 BIT MANIPULATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Operations on binary representations. Powerful for optimization and specific problems.

🚀 KEY OPERATIONS

• AND (&): Both bits must be 1
• OR (|): At least one bit is 1
• XOR (^): Bits must differ
• NOT (~): Flip all bits
• Shift: << (left), >> (right)

✨ COMMON PATTERNS

• Check if power of 2: n & (n-1) == 0
• Get ith bit: (n >> i) & 1
• Set ith bit: n | (1 << i)
• Clear ith bit: n & ~(1 << i)

📚 LEETCODE PROBLEMS

Easy: Single Number, Number of 1 Bits
Medium: Counting Bits, Bitwise AND
Hard: Minimum XOR Sum

💡 PRO TIPS

• XOR cancels same numbers
• Shift for multiplication/division by 2
• Use masks for bit operations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask: "How to check if a number is power of 2?"`,

      "tasks": `📋 TASK MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

AI-powered task management. Create tasks from natural language and let AI prioritize for you.

🚀 GETTING STARTED

1. Go to Dashboard → Tasks
2. Click + to create task
3. Describe in natural language
4. Let AI suggest priority

✨ KEY FEATURES

• AI Task Generation - Natural language
• Priority Levels - Low/Medium/High/Urgent
• Status Tracking - Todo/In Progress/Done
• Subtasks - Break down complex work
• Time Estimation - Track time

💡 PRO TIPS

• Use natural language for AI
• Break large tasks into subtasks
• Update status regularly
• Review weekly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to create tasks with AI?"`,

      "notes": `📝 SMART NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Markdown-powered notes with organization and full-text search. Perfect for documentation and knowledge management.

🚀 GETTING STARTED

1. Go to Dashboard → Notes
2. Click + to create note
3. Write with Markdown
4. Add tags

✨ KEY FEATURES

• Markdown Editor - Live preview
• Tags - Organize by topic
• Full-Text Search - Find anything
• Folders - Nested hierarchy
• Pin Notes - Quick access

💡 PRO TIPS

• Use consistent tags
• Create folder templates
• Pin important references
• Use headings for structure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to format with Markdown?"`,

      "projects": `🚀 PROJECT MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Track all projects with GitHub integration, tech tagging, and progress visualization.

🚀 GETTING STARTED

1. Go to Dashboard → Projects
2. Click + to add project
3. Link GitHub repo
4. Track progress

✨ KEY FEATURES

• Status Tracking - Planning/Active/Done
• GitHub Integration - Link repos
• Tech Tagging - Filter by technology
• Deadlines - Set milestones
• Progress Bars - Visual progress

💡 PRO TIPS

• Link GitHub for auto-sync
• Use tech tags for filtering
• Set milestones for phases
• Review analytics weekly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to link a GitHub repo?"`,

      "schedule": `📅 SCHEDULE PLANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Plan days, weeks, and months. Supports recurring events, time blocking, and smart reminders.

🚀 GETTING STARTED

1. Go to Dashboard → Schedule
2. Click + to add event
3. Set date/time/recurrence
4. Enable reminders

✨ KEY FEATURES

• Calendar Views - Day/Week/Month
• Time Blocking - Focus sessions
• Recurring Events - Daily/Weekly
• Reminders - Multiple per event
• Drag & Drop - Reschedule easily

💡 PRO TIPS

• Use time blocking for focus
• Set recurring for regulars
• Review schedule daily
• Leave buffer between meetings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to create recurring events?"`,

      "github": `🔗 GITHUB INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Connect GitHub to track repos, contributions, and coding activity. Monitor streaks.

🚀 GETTING STARTED

1. Go to Dashboard → GitHub
2. Click "Connect GitHub"
3. Authorize app
4. View repos and activity

✨ KEY FEATURES

• Repo Linking - Connect all repos
• Contributions - Daily tracking, heatmap
• Streaks - Monitor consistency
• Languages - Usage breakdown
• Timeline - Recent activity

💡 PRO TIPS

• Keep activity consistent
• Link all active repos
• Review language stats
• Use for resume building

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to track contributions?"`,

      "analytics": `📊 ANALYTICS DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Gain insights into productivity. Track coding hours, study time, and identify patterns.

🚀 GETTING STARTED

1. Go to Dashboard → Analytics
2. Select time period
3. View metrics
4. Analyze trends

✨ KEY FEATURES

• Visual Charts - Bar, line, pie
• Productivity Scores - Daily/weekly
• Time Tracking - Coding/study hours
• Goal Progress - Completion rates
• Trends - Identify patterns

💡 PRO TIPS

• Review weekly for patterns
• Set measurable goals
• Use time data to optimize
• Compare monthly trends

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to interpret charts?"`,

      "settings": `⚙️ SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Customize Developer OS. Configure themes, manage profile, set up integrations.

🚀 GETTING STARTED

1. Go to Dashboard → Settings
2. Explore categories
3. Make changes
4. Save preferences

✨ KEY FEATURES

• Theme - Dark/Light mode
• Profile - Name, avatar, email
• Integrations - GitHub, LeetCode
• Notifications - Customize alerts
• Data - Export/Import/Backup

💡 PRO TIPS

• Complete your profile early
• Configure integrations first
• Customize notifications
• Export data regularly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to switch to dark mode?"`,

      "ai": `🤖 AI CHAT (DEV-AI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Built-in AI assistant for Developer OS. Works without API keys.

🚀 GETTING STARTED

1. Go to Dashboard → AI Chat
2. Ask about Developer OS
3. Get instant help
4. Ask follow-ups

✨ CAPABILITIES

• Project Info - Features and tech stack
• How-To Guides - Step-by-step help
• Troubleshooting - Issue resolution
• Tips - Best practices

💡 PRO TIPS

• Ask specific questions
• Use natural language
• Ask about any feature
• Request guides

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Example: "How do I use DSA tracking?"`,

      "roadmap": `🧠 ML ROADMAPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Structured learning paths for Machine Learning. Track progress from beginner to advanced.

🚀 GETTING STARTED

1. Go to Dashboard → Roadmaps
2. Choose learning path
3. Start with fundamentals
4. Track progress

✨ KEY FEATURES

• Learning Paths - Beginner to Advanced
• Progress Tracking - Visual indicators
• Resources - Courses and tutorials
• Milestones - Set goals

💡 PRO TIPS

• Start with fundamentals
• Practice with real data
• Build projects at each stage
• Review regularly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "What should I learn first?"`,

      "reviews": `🎤 REVIEWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OVERVIEW

Weekly and monthly progress reviews. Reflect on achievements and set goals.

🚀 GETTING STARTED

1. Go to Dashboard → Reviews
2. Choose weekly/monthly
3. Fill achievements
4. Set next period goals

✨ KEY FEATURES

• Weekly Reviews - Reflect on week
• Monthly Reviews - Comprehensive summary
• Progress Tracking - Achievement rates
• Insights - Lessons learned

💡 PRO TIPS

• Schedule consistently
• Be honest in reflections
• Focus on actionable items
• Track patterns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to conduct weekly reviews?"`
    };

    return features[feature] || this.getProjectOverview();
  }

  /**
   * Generate compact response that fits chat box
   */
  private generateResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (!this.isProjectRelated(userMessage)) {
      return `👋 HELLO!

I am here to guide you with Developer OS.

🎯 WHAT I CAN HELP WITH

• Understanding project features
• How to use specific features
• Troubleshooting issues
• Learning paths and guides

💬 TRY ASKING

• "What is Developer OS?"
• "Tell me about the college planner"
• "How do I use DSA tracking?"
• "How to set up the project?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm ready to help! What would you like to know?`;
    }

    const feature = this.detectFeature(userMessage);

    if (feature) {
      return this.getFeatureHelp(feature);
    }

    if (
      lowerMessage.includes("what is") ||
      lowerMessage.includes("overview") ||
      lowerMessage.includes("about") ||
      lowerMessage.includes("tell me about") ||
      lowerMessage.includes("explain")
    ) {
      return this.getProjectOverview();
    }

    if (
      lowerMessage.includes("install") ||
      lowerMessage.includes("setup") ||
      lowerMessage.includes("run") ||
      lowerMessage.includes("start") ||
      lowerMessage.includes("how to use")
    ) {
      return `🚀 SETUP GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PREREQUISITES

✓ Node.js (v18+)
✓ npm
✓ PostgreSQL
✓ Python 3.x

🚀 QUICK SETUP

1. Clone repository
   $ git clone <url>
   $ cd Developer-OS

2. Run first-time setup
   $ python first_setup.py

3. Start server
   $ python run.py

🌐 Server: http://localhost:3000

💡 Use first_setup.py for easy install
💡 Double-click run.py to start

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How to configure the database?"`;
    }

    if (
      lowerMessage.includes("tech") ||
      lowerMessage.includes("stack") ||
      lowerMessage.includes("technology") ||
      lowerMessage.includes("framework") ||
      lowerMessage.includes("built with")
    ) {
      return `🛠️ TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 FRONTEND

• Next.js 15 - React framework
• React 19 - UI library
• TypeScript - Type safety
• Tailwind CSS - Styling
• Framer Motion - Animations

⚙️ BACKEND

• Next.js API Routes - Server logic
• Prisma ORM - Database
• PostgreSQL - Database

🔐 AUTH

• NextAuth.js - Secure auth
• GitHub/Google OAuth
• Demo Mode

🤖 AI

• Dev-AI - Built-in (no API keys!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Ask: "How does authentication work?"`;
    }

    if (
      lowerMessage.includes("feature") ||
      lowerMessage.includes("what can") ||
      lowerMessage.includes("capabilities") ||
      lowerMessage.includes("what does") ||
      lowerMessage.includes("functions")
    ) {
      return this.getProjectOverview();
    }

    return `🤖 DEV-AI ASSISTANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I can help with Developer OS!

📖 PROJECT INFO

• "What is Developer OS?"
• "What features are available?"
• "What tech stack is used?"

🛠️ HOW TO USE

• "How do I use DSA tracking?"
• "How to create tasks?"
• "How to take notes?"
• "Tell me about the college planner"

🚀 SETUP & CONFIG

• "How to install the project?"
• "How to start the server?"
• "How to configure settings?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Ask me anything about Developer OS!`;
  }

  async complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || "";
    const response = this.generateResponse(userMessage);

    return {
      content: response,
      model: "dev-ai",
      provider: this.provider,
      tokens: {
        prompt: 0,
        completion: 0,
        total: 0,
      },
    };
  }

  async *stream(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || "";
    const response = this.generateResponse(userMessage);

    const words = response.split(" ");
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? "" : " ") + words[i];
      yield { content: chunk, done: false };
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    yield { content: "", done: true };
  }
}
