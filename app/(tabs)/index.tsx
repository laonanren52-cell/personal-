import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedGlassScreen } from "@/components/AnimatedGlassScreen";
import { BrandMark } from "@/components/BrandMark";
import { FloatingEmptyState } from "@/components/FloatingEmptyState";
import { MobilePageContainer } from "@/components/MobilePageContainer";
import { TaskCard } from "@/components/TaskCard";
import { MutedText, SectionTitle } from "@/components/Typography";
import { colors, gradients, radius, shadow } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";
import { TaskQuadrant } from "@/types/task";
import { formatDeadline, isToday } from "@/utils/date";

const filters: Array<TaskQuadrant | "全部"> = ["全部", "紧急且重要", "重要但不紧急", "紧急但不重要", "普通事项"];

export default function HomeScreen() {
  const { tasks, toggleTask, deleteTask, refreshPriorities } = useTasks();
  const [filter, setFilter] = useState<TaskQuadrant | "全部">("全部");

  const overview = useMemo(() => {
    const active = tasks.filter((task) => !task.completed);
    const todayCount = active.filter((task) => isToday(task.deadline)).length;
    const inThreeDaysHigh = active.filter((task) => {
      const diff = new Date(task.deadline).getTime() - Date.now();
      return task.priorityLevel === "high" && diff <= 72 * 36e5;
    }).length;
    const nearest = active[0];
    const pressure = Math.min(
      100,
      Math.round(todayCount * 16 + inThreeDaysHigh * 22 + active.filter((task) => task.priorityLevel === "medium").length * 7)
    );
    const aiSuggestion =
      active.find((task) => task.priorityLevel === "high")?.aiAdvice ??
      (active.length ? "先处理最近截止任务，再保留一段复盘时间。" : "今天可以轻装上阵，先规划一个小目标。");

    return {
      active,
      todayCount,
      inThreeDaysHigh,
      pressure,
      nearestText: nearest ? `${nearest.title} · ${formatDeadline(nearest.deadline)}` : "暂无截止压力",
      aiSuggestion
    };
  }, [tasks]);

  const visibleTasks = filter === "全部" ? tasks : tasks.filter((task) => task.quadrant === filter);
  const rhythm =
    overview.pressure >= 70
      ? { label: "紧张", color: colors.coral, bg: "rgba(255,92,122,0.10)" }
      : overview.pressure >= 36
        ? { label: "适中", color: colors.yellow, bg: "rgba(245,158,11,0.12)" }
        : { label: "轻", color: colors.mint, bg: "rgba(38,198,218,0.12)" };

  return (
    <AnimatedGlassScreen>
      <MobilePageContainer>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <BrandMark showName subtitle="让事情自己排好队" />
        </View>
        <Pressable style={styles.refresh} onPress={refreshPriorities}>
          <Feather name="refresh-cw" size={17} color={colors.text} />
        </Pressable>
      </View>

      <AnimatedCard delay={80} contentStyle={styles.hero} colorsOverride={gradients.hero}>
        <View style={styles.heroGlow} />
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>今天先做什么？</Text>
            <MutedText>序光已按截止时间和重要程度帮你排好顺序</MutedText>
          </View>
          <View style={[styles.rhythmBadge, { borderColor: rhythm.color, backgroundColor: rhythm.bg }]}>
            <Text style={[styles.rhythmValue, { color: rhythm.color }]}>{rhythm.label}</Text>
            <Text style={styles.rhythmLabel}>今日节奏</Text>
          </View>
        </View>

        <View style={styles.metricGrid}>
          <MetricBlock label="今日待完成" value={overview.todayCount} accent={colors.cyan} />
          <MetricBlock
            label="3天内优先"
            value={overview.inThreeDaysHigh}
            accent={overview.inThreeDaysHigh ? colors.red : colors.green}
          />
          <View style={styles.nearestCard}>
            <Text style={styles.nearestLabel}>最近截止</Text>
            <Text style={styles.nearestText} numberOfLines={2}>
              {overview.nearestText}
            </Text>
          </View>
        </View>

        <LinearGradient colors={gradients.cyanGlass} style={styles.aiTip}>
          <Feather name="zap" size={16} color={colors.mint} />
          <Text style={styles.aiTipText} numberOfLines={2}>
            {overview.aiSuggestion}
          </Text>
        </LinearGradient>
      </AnimatedCard>

      <View style={styles.sectionHeader}>
        <SectionTitle>我的任务</SectionTitle>
        <Text style={styles.countText}>{overview.active.length} 个待办</Text>
      </View>

      <View style={styles.filterRow}>
        {filters.map((item) => (
          <Pressable
            key={item}
            style={[styles.filterChip, filter === item && styles.activeFilter]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View>
        {visibleTasks.length ? (
          visibleTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              index={index}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        ) : (
          <FloatingEmptyState onAction={() => router.push("/add")} />
        )}
      </View>
      </MobilePageContainer>
    </AnimatedGlassScreen>
  );
}

function MetricBlock({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <View style={styles.metricBlock}>
      <View style={[styles.metricDot, { backgroundColor: accent }]} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 18
  },
  titleBlock: {
    flex: 1
  },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: 0
  },
  refresh: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: colors.border
  },
  hero: {
    borderRadius: 32,
    padding: 18,
    marginBottom: 24,
    overflow: "hidden",
    position: "relative"
  },
  heroGlow: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    right: -56,
    top: -48,
    backgroundColor: "rgba(91,124,255,0.12)"
  },
  heroTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  heroCopy: {
    flex: 1
  },
  heroTitle: {
    color: colors.text,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 6
  },
  rhythmBadge: {
    minWidth: 82,
    height: 66,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12
  },
  rhythmValue: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
    letterSpacing: 0
  },
  rhythmLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2
  },
  metricGrid: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap"
  },
  metricBlock: {
    flexGrow: 1,
    minWidth: "30%",
    minHeight: 96,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    backgroundColor: "rgba(255,255,255,0.62)"
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 13
  },
  metricValue: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 29,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4
  },
  nearestCard: {
    flexBasis: "100%",
    minHeight: 72,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.62)"
  },
  nearestLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6
  },
  nearestText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800"
  },
  aiTip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(91,124,255,0.14)",
    padding: 12,
    marginTop: 14
  },
  aiTipText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800"
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  countText: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: "800"
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: colors.border
  },
  activeFilter: {
    backgroundColor: "rgba(230,236,255,0.72)",
    borderColor: colors.primary,
    ...shadow.glow
  },
  filterText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  activeFilterText: {
    color: colors.text
  }
});
