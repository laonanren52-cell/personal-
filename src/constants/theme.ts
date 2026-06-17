import { TaskCategory, PriorityLevel } from "@/types/task";

export const colors = {
  background: "#070914",
  panel: "rgba(20, 25, 43, 0.76)",
  panelStrong: "#111827",
  border: "rgba(255,255,255,0.12)",
  text: "#F7F8FF",
  muted: "#9AA5C1",
  dim: "#65708D",
  primary: "#8B7CFF",
  cyan: "#46D8FF",
  green: "#60E6A8",
  yellow: "#FFD166",
  red: "#FF5C7A",
  blue: "#4B8CFF"
};

export const categoryLabels: Record<TaskCategory, string> = {
  competition: "比赛",
  homework: "作业",
  interview: "面试",
  project: "项目",
  life: "生活",
  other: "其他"
};

export const priorityLabels: Record<PriorityLevel, string> = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级"
};

export const priorityColors: Record<PriorityLevel, string> = {
  high: colors.red,
  medium: colors.yellow,
  low: colors.green
};
