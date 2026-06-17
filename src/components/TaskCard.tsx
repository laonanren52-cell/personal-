import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categoryLabels, colors, priorityColors, priorityLabels } from "@/constants/theme";
import { Task } from "@/types/task";
import { formatDeadline, getRemainingText } from "@/utils/date";

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export function TaskCard({ task, onToggle, onDelete }: Props) {
  const priorityColor = priorityColors[task.priorityLevel];
  return (
    <LinearGradient
      colors={task.completed ? ["rgba(255,255,255,0.055)", "rgba(255,255,255,0.025)"] : ["rgba(255,255,255,0.13)", "rgba(255,255,255,0.045)"]}
      style={[styles.card, task.priorityLevel === "high" && !task.completed ? styles.hotCard : null]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={[styles.check, task.completed && styles.checked]} onPress={onToggle}>
          {task.completed ? <Ionicons name="checkmark" size={16} color={colors.background} /> : null}
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, task.completed && styles.doneText]} numberOfLines={2}>
            {task.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {formatDeadline(task.deadline)} · {categoryLabels[task.category]} · {getRemainingText(task.deadline)}
          </Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={17} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.tagRow}>
        <View style={[styles.priorityTag, { borderColor: priorityColor, backgroundColor: `${priorityColor}22` }]}>
          <Text style={[styles.priorityText, { color: priorityColor }]}>{priorityLabels[task.priorityLevel]}</Text>
        </View>
        <View style={styles.quadrantTag}>
          <Text style={styles.quadrantText}>{task.quadrant}</Text>
        </View>
        <Text style={styles.score}>AI {task.score}</Text>
      </View>

      <View style={styles.adviceBox}>
        <Ionicons name="sparkles-outline" size={15} color={colors.cyan} />
        <Text style={styles.advice} numberOfLines={2}>
          {task.aiAdvice}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    overflow: "hidden"
  },
  hotCard: {
    borderColor: "rgba(255, 92, 122, 0.45)"
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2
  },
  checked: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  titleWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    letterSpacing: 0
  },
  doneText: {
    color: colors.dim,
    textDecorationLine: "line-through"
  },
  meta: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  priorityTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0
  },
  quadrantTag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  quadrantText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0
  },
  score: {
    color: colors.dim,
    fontSize: 11,
    fontWeight: "800",
    marginLeft: "auto"
  },
  adviceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(70,216,255,0.08)"
  },
  advice: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: 0
  }
});
