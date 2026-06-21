import { TaskCategory, PriorityLevel } from "@/types/task";

export const colors = {
  pageBg: "#F7F9FF",
  pageBg2: "#EEF5FF",
  pageBg3: "#FFF7FB",
  background: "#F7F9FF",
  backgroundDeep: "#EEF5FF",
  panel: "rgba(255,255,255,0.82)",
  panelStrong: "rgba(255,255,255,0.94)",
  panelSoft: "rgba(255,255,255,0.66)",
  cardBg: "rgba(255,255,255,0.82)",
  cardBgStrong: "rgba(255,255,255,0.94)",
  border: "rgba(135,150,190,0.18)",
  borderStrong: "rgba(135,150,190,0.24)",
  text: "#1D2433",
  textPrimary: "#1D2433",
  muted: "#7A869A",
  textSecondary: "#7A869A",
  dim: "#A3ADC2",
  textMuted: "#A3ADC2",
  primary: "#5B7CFF",
  primarySoft: "#E6ECFF",
  secondary: "#9B8CFF",
  purple: "#9B8CFF",
  cyan: "#26C6DA",
  mint: "#26C6DA",
  coral: "#FF5C7A",
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#FF5C7A",
  blue: "#5B7CFF",
  info: "#5B7CFF",
  white: "#FFFFFF"
};

export const gradients = {
  screen: ["#F7F9FF", "#EEF5FF", "#FFF7FB"] as const,
  hero: ["rgba(255,255,255,0.94)", "rgba(230,236,255,0.82)", "rgba(255,247,251,0.92)"] as const,
  card: ["rgba(255,255,255,0.92)", "rgba(255,255,255,0.72)"] as const,
  cardDim: ["rgba(255,255,255,0.66)", "rgba(247,249,255,0.52)"] as const,
  cyanGlass: ["rgba(91,124,255,0.09)", "rgba(38,198,218,0.08)"] as const,
  primaryButton: ["#5B7CFF", "#9B8CFF"] as const,
  softAurora: ["rgba(91,124,255,0.15)", "rgba(155,140,255,0.12)", "rgba(38,198,218,0.09)"] as const,
  danger: ["rgba(255,92,122,0.12)", "rgba(255,255,255,0.72)"] as const
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
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6
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
  high: "rgba(255,92,122,0.13)",
  medium: "rgba(245,158,11,0.14)",
  low: "rgba(34,197,94,0.12)"
};
