import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassScreen } from "@/components/GlassScreen";
import { MutedText, PageTitle, SectionTitle } from "@/components/Typography";
import { colors } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";
import { generateTodayPlan } from "@/services/planner";

export default function PlannerScreen() {
  const { tasks } = useTasks();
  const plan = useMemo(() => generateTodayPlan(tasks), [tasks]);
  const activeCount = tasks.filter((task) => !task.completed).length;

  return (
    <GlassScreen>
      <MutedText>AI 规划</MutedText>
      <PageTitle>把今天拆成可执行的节奏</PageTitle>

      <LinearGradient colors={["rgba(70,216,255,0.2)", "rgba(139,124,255,0.12)"]} style={styles.summary}>
        <Ionicons name="sparkles-outline" size={24} color={colors.cyan} />
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>今日计划已生成</Text>
          <MutedText>基于 {activeCount} 个未完成任务，优先安排高分、临近截止和耗时较长的事项。</MutedText>
        </View>
      </LinearGradient>

      {plan.map((section) => (
        <View key={section.slot} style={styles.section}>
          <View style={styles.sectionTop}>
            <SectionTitle>{section.slot}</SectionTitle>
            <View style={styles.line} />
          </View>
          {section.items.map((item, index) => (
            <View key={`${section.slot}-${index}`} style={styles.planItem}>
              <View style={styles.index}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </View>
              <Text style={styles.planText}>{item}</Text>
            </View>
          ))}
        </View>
      ))}
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 18,
    marginBottom: 22,
    padding: 16,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border
  },
  summaryText: {
    flex: 1
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6
  },
  section: {
    marginBottom: 20
  },
  sectionTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border
  },
  planItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.055)",
    marginBottom: 10
  },
  index: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(139,124,255,0.24)",
    alignItems: "center",
    justifyContent: "center"
  },
  indexText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900"
  },
  planText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700"
  }
});
