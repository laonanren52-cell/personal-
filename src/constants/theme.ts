import { TaskCategory, PriorityLevel } from "@/types/task";

export const colors = {
  background: "#070914",
  backgroundDeep: "#040611",
  panel: "rgba(20, 25, 43, 0.76)",
  panelStrong: "#111827",
  panelSoft: "rgba(255,255,255,0.065)",
  border: "rgba(255,255,255,0.12)",
  borderStrong: "rgba(255,255,255,0.20)",
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

export const gradients = {
  screen: ["#050713", "#10152A", "#070914"] as const,
  hero: ["rgba(139,124,255,0.44)", "rgba(70,216,255,0.18)", "rgba(7,9,20,0.45)"] as const,
  card: ["rgba(255,255,255,0.13)", "rgba(255,255,255,0.045)"] as const,
  cardDim: ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.025)"] as const,
  cyanGlass: ["rgba(70,216,255,0.18)", "rgba(70,216,255,0.055)"] as const,
  primaryButton: ["#8B7CFF", "#46D8FF"] as const,
  danger: ["rgba(255,92,122,0.28)", "rgba(255,92,122,0.08)"] as const
};

export const radius = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32
};

export const shadow = {
  glow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 14
  },
  cyan: {
    shadowColor: colors.cyan,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10
  },
  danger: {
    shadowColor: colors.red,
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 10
  }
};

export const typography = {
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "900" as const,
    letterSpacing: 0
  },
  section: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800" as const,
    letterSpacing: 0
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600" as const,
    letterSpacing: 0
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800" as const,
    letterSpacing: 0
  }
};

export const animation = {
  pageDuration: 520,
  cardDuration: 460,
  pressDuration: 120,
  stagger: 70
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

export const priorityGlowColors: Record<PriorityLevel, string> = {
  high: "rgba(255,92,122,0.34)",
  medium: "rgba(255,209,102,0.28)",
  low: "rgba(96,230,168,0.24)"
};
