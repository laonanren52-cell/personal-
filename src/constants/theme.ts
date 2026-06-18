import { TaskCategory, PriorityLevel } from "@/types/task";

export const colors = {
  pageBg: "#F6F8FF",
  pageBg2: "#EEF4FF",
  pageBg3: "#FAF7FF",
  background: "#F6F8FF",
  backgroundDeep: "#EEF4FF",
  panel: "rgba(255,255,255,0.72)",
  panelStrong: "rgba(255,255,255,0.9)",
  panelSoft: "rgba(255,255,255,0.58)",
  cardBg: "rgba(255,255,255,0.72)",
  cardBgStrong: "rgba(255,255,255,0.9)",
  border: "rgba(120,140,180,0.18)",
  borderStrong: "rgba(120,140,180,0.24)",
  text: "#172033",
  textPrimary: "#172033",
  muted: "#64748B",
  textSecondary: "#64748B",
  dim: "#94A3B8",
  textMuted: "#94A3B8",
  primary: "#4F7CFF",
  primarySoft: "#DDE7FF",
  secondary: "#8B7CFF",
  cyan: "#22C7D9",
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#EF4444",
  blue: "#4F7CFF",
  info: "#4F7CFF",
  white: "#FFFFFF"
};

export const gradients = {
  screen: ["#F7FAFF", "#EEF4FF", "#FAF7FF"] as const,
  hero: ["rgba(255,255,255,0.88)", "rgba(221,231,255,0.78)", "rgba(250,247,255,0.86)"] as const,
  card: ["rgba(255,255,255,0.84)", "rgba(255,255,255,0.64)"] as const,
  cardDim: ["rgba(255,255,255,0.62)", "rgba(245,248,255,0.46)"] as const,
  cyanGlass: ["rgba(79,124,255,0.10)", "rgba(34,199,217,0.07)"] as const,
  primaryButton: ["#4F7CFF", "#8B7CFF"] as const,
  softAurora: ["rgba(79,124,255,0.16)", "rgba(139,124,255,0.12)", "rgba(34,199,217,0.08)"] as const,
  danger: ["rgba(239,68,68,0.12)", "rgba(255,255,255,0.68)"] as const
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
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 8
  },
  cyan: {
    shadowColor: colors.cyan,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7
  },
  danger: {
    shadowColor: colors.red,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 7
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
  high: "rgba(239,68,68,0.14)",
  medium: "rgba(245,158,11,0.14)",
  low: "rgba(34,197,94,0.12)"
};
