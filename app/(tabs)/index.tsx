import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlassScreen } from "@/components/GlassScreen";
import { MetricCard } from "@/components/MetricCard";
import { TaskCard } from "@/components/TaskCard";
import { MutedText, PageTitle, SectionTitle } from "@/components/Typography";
import { colors } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";
import { TaskQuadrant } from "@/types/task";
import { formatDeadline, isToday } from "@/utils/date";

const filters: Array<TaskQuadrant | "全部"> = ["全部", "紧急且重要", "重要但不紧急", "紧急但不重要", "普通事项"];

export default function HomeScreen() {
  const { tasks, loading, toggleTask, deleteTask, refreshPriorities } = useTasks();
  const [filter, setFilter] = useState<TaskQuadrant | "全部">("全部");

  const overview = useMemo(() => {
    const active = tasks.filter((task) => !task.completed);
    const todayCount = active.filter((task) => isToday(task.deadline)).length;
    const inThreeDaysHigh = active.filter((task) => {
      const diff = new Date(task.deadline).getTime() - Date.now();
      return task.priorityLevel === "high" && diff <= 72 * 36e5;
    }).length;
    const nearest = active[0];
    const aiSuggestion =
      active.find((task) => task.priorityLevel === "high")?.aiAdvice ??
      "今天节奏不错，先处理最接近截止的任务。";
    return {
      todayCount,
      inThreeDaysHigh,
      nearestText: nearest ? `${nearest.title} · ${formatDeadline(nearest.deadline)}` : "暂无截止压力",
      aiSuggestion
    };
  }, [tasks]);

  const visibleTasks = filter === "全部" ? tasks : tasks.filter((task) => task.quadrant === filter);

  return (
    <GlassScreen>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <MutedText>AI 轻重缓急日程助手</MutedText>
          <PageTitle>今天先做真正要紧的事</PageTitle>
        </View>
        <TouchableOpacity style={styles.refresh} onPress={refreshPriorities}>
          <Ionicons name="refresh" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={["rgba(139,124,255,0.34)", "rgba(70,216,255,0.13)"]} style={styles.hero}>
        <Text style={styles.heroLabel}>AI 今日建议</Text>
        <Text style={styles.heroAdvice} numberOfLines={3}>
          {overview.aiSuggestion}
        </Text>
        <View style={styles.metricGrid}>
          <View style={styles.metricRow}>
            <MetricCard label="今日待完成" value={overview.todayCount} accent={colors.cyan} />
            <MetricCard label="3天内高优先级" value={overview.inThreeDaysHigh} accent={colors.red} />
          </View>
          <View style={styles.nearestCard}>
            <Text style={styles.nearestLabel}>最近截止</Text>
            <Text style={styles.nearestText} numberOfLines={2}>
              {overview.nearestText}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <SectionTitle>任务看板</SectionTitle>
        <Text style={styles.countText}>{tasks.filter((task) => !task.completed).length} 个待办</Text>
      </View>

      <View style={styles.filterRow}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterChip, filter === item && styles.activeFilter]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        {visibleTasks.length ? (
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() =>
                Alert.alert("删除任务", `确定删除“${task.title}”吗？`, [
                  { text: "取消", style: "cancel" },
                  { text: "删除", style: "destructive", onPress: () => deleteTask(task.id) }
                ])
              }
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Ionicons name="planet-outline" size={42} color={colors.dim} />
            <Text style={styles.emptyTitle}>暂无任务</Text>
            <MutedText>从添加页创建任务，或用图片导入识别截图里的待办。</MutedText>
          </View>
        )}
      </View>
    </GlassScreen>
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
  refresh: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: colors.border
  },
  hero: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    padding: 18,
    overflow: "hidden",
    marginBottom: 24
  },
  heroLabel: {
    color: colors.cyan,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 0
  },
  heroAdvice: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: 0
  },
  metricGrid: {
    marginTop: 18,
    gap: 10
  },
  metricRow: {
    flexDirection: "row",
    gap: 10
  },
  nearestCard: {
    minHeight: 78,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(7,9,20,0.34)"
  },
  nearestLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8
  },
  nearestText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
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
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.border
  },
  activeFilter: {
    backgroundColor: "rgba(139,124,255,0.24)",
    borderColor: colors.primary
  },
  filterText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  activeFilterText: {
    color: colors.text
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 22,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.045)"
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 6
  }
});
