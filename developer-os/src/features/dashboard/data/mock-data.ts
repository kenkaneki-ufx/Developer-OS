import type {
  DashboardStats,
  DailyTasks,
  ProjectsOverview,
  UpcomingDeadlines,
  GitHubOverview,
  DSAProgress,
  MLProgress,
  MotivationQuote,
} from "../types";


export const mockStats: DashboardStats = {
  codingHours: 0,
  studyHours: 0,
  tasksCompleted: 0,
  currentStreak: 0,
  personalBestStreak: 0,
  dsaSolved: 0,
  dsaToday: 0,
  githubCommits: 0,
  githubToday: 0,
  consistencyScore: 0,
};


export const mockTasks: DailyTasks = {
  date: "2026-07-28T00:00:00.000Z", 
  tasks: [],
  totalTasks: 0,
  completedTasks: 0,
  totalEstimatedTime: 0,
};


export const mockProjects: ProjectsOverview = {
  activeProjects: [],
  totalProjects: 0,
  activeCount: 0,
  completedCount: 0,
};


export const mockDeadlines: UpcomingDeadlines = {
  deadlines: [],
  totalUpcoming: 0,
  overdue: 0,
  dueThisWeek: 0,
};


export const mockGitHub: GitHubOverview = {
  totalCommits: 0,
  todayCommits: 0,
  weekCommits: 0,
  monthCommits: 0,
  contributionGraph: Array.from({ length: 90 }, (_, i) => {
    const date = new Date(2026, 6, 28); 
    date.setDate(date.getDate() - (89 - i));
    return { date: date.toISOString(), count: 0, level: 0 as 0 | 1 | 2 | 3 | 4 };
  }),
  streak: 0,
  repositories: 0,
  pullRequests: 0,
  issues: 0,
};


export const mockDSA: DSAProgress = {
  currentTopic: {
    id: "1",
    name: "Getting Started",
    category: "Fundamentals",
    totalQuestions: 0,
    solvedQuestions: 0,
    bookmarked: 0,
    mastery: 0,
  },
  recentTopics: [],
  totalSolved: 0,
  totalQuestions: 0,
  todaySolved: 0,
  weeklyGoal: 0,
  weeklyProgress: 0,
  streak: 0,
  platforms: {
    leetcode: 0,
    codeforces: 0,
    geeksforgeeks: 0,
    atcoder: 0,
  },
};


export const mockML: MLProgress = {
  currentTopic: {
    id: "1",
    name: "Getting Started",
    category: "Foundation",
    progress: 0,
    isCompleted: false,
    resources: 0,
    projects: 0,
  },
  roadmap: [],
  overallProgress: 0,
  completedTopics: 0,
  totalTopics: 0,
  currentPhase: "Not Started",
  projectsCompleted: 0,
};


export const mockMotivation: MotivationQuote = {
  id: "1",
  text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
  author: "Steve Jobs",
  category: "motivation",
};

export const motivationQuotes: MotivationQuote[] = [
  mockMotivation,
  {
    id: "2",
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "coding",
  },
  {
    id: "3",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "coding",
  },
  {
    id: "4",
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "life",
  },
  {
    id: "5",
    text: "Productivity is never an accident. It is always the result of a commitment to excellence.",
    author: "Paul J. Meyer",
    category: "productivity",
  },
  {
    id: "6",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "coding",
  },
  {
    id: "7",
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    category: "coding",
  },
  {
    id: "8",
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "motivation",
  },
  {
    id: "9",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation",
  },
  {
    id: "10",
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "life",
  },
  {
    id: "11",
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    category: "coding",
  },
  {
    id: "12",
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "coding",
  },
  {
    id: "13",
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
    category: "coding",
  },
  {
    id: "14",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "productivity",
  },
  {
    id: "15",
    text: "The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie",
    category: "coding",
  },
  {
    id: "16",
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "motivation",
  },
  {
    id: "17",
    text: "The only real mistake is the one from which we learn nothing.",
    author: "Henry Ford",
    category: "motivation",
  },
  {
    id: "18",
    text: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde",
    category: "life",
  },
  {
    id: "19",
    text: "The function of good software is to make the complex appear to be simple.",
    author: "Grady Booch",
    category: "coding",
  },
  {
    id: "20",
    text: "A ship in harbor is safe, but that is not what ships are built for.",
    author: "John A. Shedd",
    category: "motivation",
  },
  {
    id: "21",
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "life",
  },
  {
    id: "22",
    text: "The best time to restart is now.",
    author: "Unknown",
    category: "motivation",
  },
  {
    id: "23",
    text: "Solving problems is what makes us human.",
    author: "Unknown",
    category: "coding",
  },
  {
    id: "24",
    text: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
    category: "motivation",
  },
  {
    id: "25",
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    category: "learning",
  },
  {
    id: "26",
    text: "Code never lies, comments sometimes do.",
    author: "Ron Guidry",
    category: "coding",
  },
  {
    id: "27",
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
    category: "learning",
  },
  {
    id: "28",
    text: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle",
    category: "learning",
  },
  {
    id: "29",
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "motivation",
  },
  {
    id: "30",
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
    category: "life",
  },
  {
    id: "31",
    text: "You learn more from failure than from success. Don't let it stop you.",
    author: "Unknown",
    category: "motivation",
  },
  {
    id: "32",
    text: "There are only two hard things in Computer Science: cache invalidation and naming things.",
    author: "Phil Karlton",
    category: "coding",
  },
  {
    id: "33",
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "motivation",
  },
  {
    id: "34",
    text: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein",
    category: "learning",
  },
  {
    id: "35",
    text: "Beware of bugs in the above code; I have only proved it correct, not tried it.",
    author: "Donald Knuth",
    category: "coding",
  },
  {
    id: "36",
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "productivity",
  },
  {
    id: "37",
    text: "If you look at what you have in life, you'll always have more.",
    author: "Oprah Winfrey",
    category: "life",
  },
  {
    id: "38",
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation",
  },
  {
    id: "39",
    text: "The more that you read, the more things you will know.",
    author: "Dr. Seuss",
    category: "learning",
  },
  {
    id: "40",
    text: "Work smart, not hard.",
    author: "Unknown",
    category: "productivity",
  },
];


