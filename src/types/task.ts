export type TaskCategory =
  | "competition"
  | "homework"
  | "interview"
  | "project"
  | "life"
  | "other";

export type PriorityLevel = "high" | "medium" | "low";

export type TaskQuadrant = "紧急且重要" | "重要但不紧急" | "紧急但不重要" | "普通事项";

export type Task = {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  category: TaskCategory;
  importance: number;
  estimatedHours?: number;
  priorityLevel: PriorityLevel;
  quadrant: TaskQuadrant;
  aiAdvice: string;
  score: number;
  completed: boolean;
  reminderEnabled: boolean;
  reminderOffsets: number[];
  createdAt: string;
  updatedAt: string;
};

export type TaskDraft = {
  title: string;
  description?: string;
  deadline: string;
  category: TaskCategory;
  importance: number;
  estimatedHours?: number;
  reminderEnabled: boolean;
  reminderOffsets: number[];
  notes?: string;
};

export type ImportTaskDraft = TaskDraft & {
  selected: boolean;
};

export type PriorityAnalysis = {
  priorityLevel: PriorityLevel;
  quadrant: TaskQuadrant;
  aiAdvice: string;
  score: number;
};

export type AppSettings = {
  apiKey: string;
  aiEnabled: boolean;
  defaultReminderOffsets: number[];
};
