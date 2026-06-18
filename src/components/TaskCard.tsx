import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Alert, Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { AnimatedCard } from "@/components/AnimatedCard";
import { categoryLabels, colors, gradients, priorityColors, priorityGlowColors, priorityLabels, radius, shadow } from "@/constants/theme";
import { Task } from "@/types/task";
import { formatDeadline, getRemainingText } from "@/utils/date";

type Props = {
  task: Task;
  index?: number;
  onToggle: () => void;
  onDelete: () => Promise<void> | void;
};

export function TaskCard({ task, index = 0, onToggle, onDelete }: Props) {
  const priorityColor = priorityColors[task.priorityLevel];
  const pulse = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(1)).current;
  const removeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (task.priorityLevel !== "high" || task.completed) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, task.completed, task.priorityLevel]);

  const toggle = () => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 0.82, useNativeDriver: true }),
      Animated.spring(checkScale, { toValue: 1, friction: 4, tension: 180, useNativeDriver: true })
    ]).start();
    onToggle();
  };

  const deleteWithConfirm = () => {
    Alert.alert("删除这个任务？", "删除后不可恢复。", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: () => {
          Animated.timing(removeAnim, {
            toValue: 0,
            duration: 180,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
          }).start(() => {
            void onDelete();
          });
        }
      }
    ]);
  };

  return (
    <AnimatedCard
      delay={index * 60}
      colorsOverride={task.completed ? gradients.cardDim : gradients.card}
      contentStyle={[styles.card, task.completed && styles.completedCard]}
    >
      <Animated.View
        style={{
          opacity: removeAnim,
          transform: [{ scale: removeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }]
        }}
      >
      {task.priorityLevel === "high" && !task.completed ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulseGlow,
            {
              backgroundColor: priorityGlowColors.high,
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.32] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.05] }) }]
            }
          ]}
        />
      ) : null}

      <View style={[styles.energyBar, { backgroundColor: priorityColor, shadowColor: priorityColor }]} />

      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
          <Pressable style={[styles.check, task.completed && styles.checked]} onPress={toggle}>
            {task.completed ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
          </Pressable>
        </Animated.View>

        <View style={styles.titleWrap}>
          <View style={styles.titleLine}>
            <Text style={[styles.title, task.completed && styles.doneText]} numberOfLines={2}>
              {task.title}
            </Text>
            <Pressable style={styles.deleteButton} onPress={deleteWithConfirm}>
              <Ionicons name="trash-outline" size={15} color={colors.red} />
            </Pressable>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.category}>{categoryLabels[task.category]}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.remaining}>{getRemainingText(task.deadline)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tagRow}>
        <View style={[styles.deadlinePill, { borderColor: `${priorityColor}66` }]}>
          <Ionicons name="time-outline" size={13} color={priorityColor} />
          <Text style={[styles.deadlineText, { color: priorityColor }]}>{formatDeadline(task.deadline)}</Text>
        </View>
        <View style={[styles.priorityTag, { borderColor: priorityColor, backgroundColor: `${priorityColor}20` }]}>
          <Text style={[styles.priorityText, { color: priorityColor }]}>{priorityLabels[task.priorityLevel]}</Text>
        </View>
        <View style={styles.quadrantTag}>
          <Text style={styles.quadrantText}>{task.quadrant}</Text>
        </View>
      </View>

      <LinearGradient colors={gradients.cyanGlass} style={styles.adviceBox}>
        <View style={styles.sparkBox}>
          <Ionicons name="sparkles-outline" size={15} color={colors.cyan} />
        </View>
        <Text style={styles.advice} numberOfLines={2}>
          {task.aiAdvice}
        </Text>
        <Text style={styles.score}>AI {task.score}</Text>
      </LinearGradient>
      </Animated.View>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 156,
    padding: 16,
    marginBottom: 12,
    position: "relative"
  },
  completedCard: {
    opacity: 0.62
  },
  pulseGlow: {
    position: "absolute",
    top: -24,
    right: -26,
    width: 142,
    height: 142,
    borderRadius: 71
  },
  energyBar: {
    position: "absolute",
    left: 0,
    top: 18,
    bottom: 18,
    width: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    shadowOpacity: 0.24,
    shadowRadius: 10
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    backgroundColor: "rgba(255,255,255,0.72)"
  },
  checked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    ...shadow.cyan
  },
  titleWrap: {
    flex: 1
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
    letterSpacing: 0
  },
  doneText: {
    color: colors.dim,
    textDecorationLine: "line-through"
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.62)"
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6
  },
  category: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  dot: {
    color: colors.dim,
    fontSize: 12
  },
  remaining: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  deadlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.66)"
  },
  deadlineText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0
  },
  priorityTag: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0
  },
  quadrantTag: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(221,231,255,0.52)"
  },
  quadrantText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0
  },
  adviceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 14,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.16)"
  },
  sparkBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34,199,217,0.10)"
  },
  advice: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: 0
  },
  score: {
    color: colors.dim,
    fontSize: 11,
    fontWeight: "900"
  }
});
