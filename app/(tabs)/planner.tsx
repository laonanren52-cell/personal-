import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedGlassScreen } from "@/components/AnimatedGlassScreen";
import { MobilePageContainer } from "@/components/MobilePageContainer";
import { MutedText } from "@/components/Typography";
import { colors, gradients, radius } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";
import { generateTodayPlan } from "@/services/planner";

export default function PlannerScreen() {
  const { tasks } = useTasks();
  const activeTasks = tasks.filter((task) => !task.completed);
  const plan = useMemo(() => generateTodayPlan(tasks), [tasks]);
  const highCount = activeTasks.filter((task) => task.priorityLevel === "high").length;
  const summary =
    highCount > 0
      ? `今日建议先处理 ${highCount} 个高优先级事项，再安排 1 小时复盘。`
      : "今日节奏较稳，先推进重要任务，再保留晚间复盘。";

  return (
    <AnimatedGlassScreen>
      <MobilePageContainer>
      <MutedText>序光规划</MutedText>
      <Text style={styles.title}>今日作战计划</Text>

      <AnimatedCard delay={80} colorsOverride={gradients.hero} contentStyle={styles.summary}>
        <View style={styles.summaryIcon}>
          <Ionicons name="sparkles-outline" size={24} color={colors.cyan} />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>{summary}</Text>
          <MutedText>基于 {activeTasks.length} 个未完成任务，优先安排高分、临近截止和耗时较长的事项。</MutedText>
        </View>
      </AnimatedCard>

      <View style={styles.timeline}>
        <View style={styles.timelineLine} />
        {plan.map((section, sectionIndex) => (
          <View key={section.slot} style={styles.timelineSection}>
            <View style={styles.timeNode}>
              <LinearGradient colors={gradients.primaryButton} style={styles.nodeDot} />
              <Text style={styles.slot}>{section.slot}</Text>
            </View>
            <View style={styles.items}>
              {section.items.map((item, index) => {
                const isWarning = highCount > 0 && sectionIndex === 0 && index === 0;
                return (
                  <AnimatedCard key={`${section.slot}-${index}`} delay={140 + sectionIndex * 110 + index * 60} contentStyle={styles.planItem}>
                    <View style={[styles.alertDot, isWarning && styles.alertDotHot]} />
                    <Text style={styles.planText}>{item}</Text>
                    {isWarning ? <Ionicons name="alert-circle-outline" size={18} color={colors.red} /> : null}
                  </AnimatedCard>
                );
              })}
            </View>
          </View>
        ))}
      </View>
      </MobilePageContainer>
    </AnimatedGlassScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 18
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
    padding: 16,
    borderRadius: radius.xl
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34,199,217,0.10)"
  },
  summaryText: {
    flex: 1
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900",
    marginBottom: 6
  },
  timeline: {
    position: "relative",
    paddingLeft: 4
  },
  timelineLine: {
    position: "absolute",
    left: 17,
    top: 14,
    bottom: 26,
    width: 2,
    backgroundColor: "rgba(215,226,255,0.9)"
  },
  timelineSection: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18
  },
  timeNode: {
    width: 76,
    alignItems: "flex-start"
  },
  nodeDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 0,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(120,140,180,0.22)"
  },
  slot: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  items: {
    flex: 1,
    gap: 10
  },
  planItem: {
    flexDirection: "row",
    gap: 11,
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 22
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cyan,
    marginTop: 7
  },
  alertDotHot: {
    backgroundColor: colors.red
  },
  planText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700"
  }
});
