import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { PropsWithChildren, useRef, useState } from "react";
import { Alert, Animated, Pressable, StyleProp, StyleSheet, Switch, Text, TextInput, View, ViewStyle } from "react-native";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedGlassScreen } from "@/components/AnimatedGlassScreen";
import { Chip, Field, PrimaryButton } from "@/components/FormControls";
import { MobilePageContainer } from "@/components/MobilePageContainer";
import { MutedText, SectionTitle } from "@/components/Typography";
import { categoryLabels, colors, gradients, radius } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";
import { TaskCategory, TaskDraft } from "@/types/task";
import { parseInputDateTime, toInputDateTime } from "@/utils/date";

const categories = Object.keys(categoryLabels) as TaskCategory[];
const offsetOptions = [
  { label: "当天", value: 0 },
  { label: "提前1天", value: 1 },
  { label: "提前2天", value: 2 }
];
const importanceOptions = [
  { value: 1, label: "轻松", color: colors.green, soft: "rgba(34,197,94,0.12)", description: "不影响整体安排，有空再做。" },
  { value: 2, label: "普通", color: colors.mint, soft: "rgba(38,198,218,0.12)", description: "正常安排即可，不需要立即处理。" },
  { value: 3, label: "重要", color: colors.primary, soft: "rgba(91,124,255,0.12)", description: "建议今天或明天安排时间推进。" },
  { value: 4, label: "紧急", color: colors.yellow, soft: "rgba(245,158,11,0.14)", description: "需要优先处理，建议尽快完成。" },
  { value: 5, label: "最高", color: colors.coral, soft: "rgba(255,92,122,0.12)", description: "最高优先级，AI 会将它排在前面并提前提醒。" }
] as const;

export default function AddScreen() {
  const { addTask, settings } = useTasks();
  const tomorrow = new Date(Date.now() + 24 * 36e5);
  tomorrow.setHours(18, 0, 0, 0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineText, setDeadlineText] = useState(toInputDateTime(tomorrow));
  const [category, setCategory] = useState<TaskCategory>("project");
  const [importance, setImportance] = useState(4);
  const [estimatedHours, setEstimatedHours] = useState("2");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderOffsets, setReminderOffsets] = useState<number[]>(settings.defaultReminderOffsets);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hoursFocused, setHoursFocused] = useState(false);
  const selectedImportance = importanceOptions.find((item) => item.value === importance) ?? importanceOptions[1];

  const toggleOffset = (value: number) => {
    setReminderOffsets((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value].sort((a, b) => b - a)
    );
  };

  const submit = async () => {
    const deadline = parseInputDateTime(deadlineText);
    if (!title.trim()) {
      Alert.alert("请填写任务标题");
      return;
    }
    if (!deadline) {
      Alert.alert("时间格式不正确", "请使用 YYYY-MM-DD HH:mm，例如 2026-06-18 18:00");
      return;
    }

    const draft: TaskDraft = {
      title,
      description,
      deadline: deadline.toISOString(),
      category,
      importance,
      estimatedHours: Number(estimatedHours) || 1,
      reminderEnabled,
      reminderOffsets,
      notes
    };

    setSaving(true);
    setSaved(false);
    try {
      await addTask(draft);
      setTitle("");
      setDescription("");
      setNotes("");
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
      Alert.alert("已添加", "AI 已完成轻重缓急分析并安排提醒。", [
        { text: "查看首页", onPress: () => router.replace("/") }
      ]);
    } catch (error) {
      Alert.alert("添加失败", error instanceof Error ? error.message : "请稍后再试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatedGlassScreen>
      <MobilePageContainer>
        <MutedText>新任务</MutedText>
        <Text style={styles.title}>把事情丢给序光</Text>

        <AnimatedCard delay={80} contentStyle={styles.group}>
          <View style={styles.groupHeader}>
            <View style={styles.headerIcon}>
              <Feather name="file-text" size={17} color={colors.primary} />
            </View>
            <View style={styles.headerCopy}>
              <SectionTitle style={styles.groupTitle}>核心信息</SectionTitle>
              <MutedText>先把任务本身说清楚</MutedText>
            </View>
          </View>
          <Field label="任务标题" value={title} onChangeText={setTitle} placeholder="例如：提交蓝桥杯资料" />
          <Field
            label="任务描述"
            value={description}
            onChangeText={setDescription}
            placeholder="补充要求、交付物或上下文"
            multiline
            style={styles.multiline}
          />
          <Field label="截止日期和时间" value={deadlineText} onChangeText={setDeadlineText} placeholder="YYYY-MM-DD HH:mm" />
        </AnimatedCard>

        <AnimatedCard delay={160} contentStyle={styles.group}>
          <View style={styles.groupHeader}>
            <View style={styles.headerIcon}>
              <Feather name="zap" size={17} color={colors.primary} />
            </View>
            <View style={styles.headerCopy}>
              <SectionTitle style={styles.groupTitle}>任务属性</SectionTitle>
              <MutedText>AI 会根据这些属性判断任务轻重缓急</MutedText>
            </View>
          </View>
          <Text style={styles.label}>任务类型</Text>
          <View style={styles.chips}>
            {categories.map((item) => (
              <CategoryPill key={item} active={category === item} label={categoryLabels[item]} onPress={() => setCategory(item)} />
            ))}
          </View>

          <Text style={styles.label}>重要程度</Text>
          <View style={styles.importanceGrid}>
            {importanceOptions.map((item) => (
              <ScalePressable key={item.value} onPress={() => setImportance(item.value)} style={styles.importanceWrap}>
                <View
                  style={[
                    styles.importancePill,
                    importance === item.value && {
                      borderColor: item.color,
                      backgroundColor: item.soft,
                      shadowColor: item.color
                    },
                    importance === item.value && styles.importancePillActive
                  ]}
                >
                  <Text style={[styles.importanceNumber, { color: importance === item.value ? item.color : colors.text }]}>
                    {item.value}
                  </Text>
                  <Text style={[styles.importanceLabel, { color: importance === item.value ? item.color : colors.muted }]}>
                    {item.label}
                  </Text>
                </View>
              </ScalePressable>
            ))}
          </View>
          <View style={[styles.importanceHint, { borderColor: selectedImportance.color, backgroundColor: selectedImportance.soft }]}>
            <Text style={[styles.importanceHintTitle, { color: selectedImportance.color }]}>
              当前选择：{selectedImportance.value} {selectedImportance.label}
            </Text>
            <Text style={styles.importanceHintText}>说明：{selectedImportance.description}</Text>
          </View>

          <View style={styles.compactSetting}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>预计耗时</Text>
              <MutedText>耗时越长，AI 越会建议提前开始</MutedText>
            </View>
            <View style={styles.hoursControl}>
              <TextInput
                value={estimatedHours}
                onChangeText={setEstimatedHours}
                keyboardType="decimal-pad"
                placeholder="2"
                placeholderTextColor={colors.dim}
                onFocus={() => setHoursFocused(true)}
                onBlur={() => setHoursFocused(false)}
                style={[styles.hoursInput, hoursFocused && styles.hoursInputFocused]}
              />
              <Text style={styles.hoursUnit}>小时</Text>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={240} contentStyle={styles.group}>
          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.switchTitle}>提前提醒</Text>
              <MutedText>创建后自动安排本地通知</MutedText>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ true: colors.primary, false: "rgba(148,163,184,0.24)" }}
              thumbColor={colors.white}
            />
          </View>

          {reminderEnabled ? (
            <>
              <Text style={styles.label}>提醒时间</Text>
              <View style={styles.segmented}>
                {offsetOptions.map((item) => (
                  <Chip key={item.value} active={reminderOffsets.includes(item.value)} onPress={() => toggleOffset(item.value)}>
                    {item.label}
                  </Chip>
                ))}
              </View>
            </>
          ) : null}

          <Field label="备注" value={notes} onChangeText={setNotes} placeholder="可选，例如老师要求、提交入口" multiline style={styles.multiline} />
        </AnimatedCard>

        <View style={styles.footer}>
          <PrimaryButton onPress={submit} disabled={saving}>
            {saved ? "已完成分析" : saving ? "分析中..." : "添加并分析优先级"}
          </PrimaryButton>
        </View>
      </MobilePageContainer>
    </AnimatedGlassScreen>
  );
}

function ScalePressable({
  children,
  onPress,
  style
}: PropsWithChildren<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}>) {
  const scale = useRef(new Animated.Value(1)).current;
  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 7,
      tension: 180,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable onPress={onPress} onPressIn={() => animateTo(0.98)} onPressOut={() => animateTo(1)}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

function CategoryPill({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <ScalePressable onPress={onPress}>
      {active ? (
        <LinearGradient colors={gradients.primaryButton} style={[styles.categoryPill, styles.categoryPillActive]}>
          <Text style={[styles.categoryText, styles.categoryTextActive]}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{label}</Text>
        </View>
      )}
    </ScalePressable>
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
  group: {
    padding: 16,
    borderRadius: 26,
    marginBottom: 14,
    borderColor: "rgba(120,140,180,0.18)",
    backgroundColor: "rgba(255,255,255,0.78)"
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,124,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(91,124,255,0.16)"
  },
  headerCopy: {
    flex: 1
  },
  groupTitle: {
    fontSize: 16,
    color: colors.text
  },
  multiline: {
    minHeight: 92,
    textAlignVertical: "top"
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 9,
    letterSpacing: 0
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  categoryPill: {
    minHeight: 38,
    minWidth: 62,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(120,140,180,0.16)",
    backgroundColor: "rgba(255,255,255,0.68)",
    alignItems: "center",
    justifyContent: "center"
  },
  categoryPillActive: {
    borderColor: "rgba(91,124,255,0.12)"
  },
  categoryText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 0
  },
  categoryTextActive: {
    color: colors.white
  },
  importanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  importanceWrap: {
    flexBasis: "30%",
    flexGrow: 1
  },
  importancePill: {
    minHeight: 48,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(120,140,180,0.16)",
    backgroundColor: "rgba(255,255,255,0.68)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  importancePillActive: {
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5
  },
  importanceNumber: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "900",
    letterSpacing: 0
  },
  importanceLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
    marginTop: 1,
    letterSpacing: 0
  },
  importanceHint: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 16
  },
  importanceHintTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
    letterSpacing: 0
  },
  importanceHintText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700"
  },
  compactSetting: {
    minHeight: 74,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.68)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  settingText: {
    flex: 1
  },
  settingTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    marginBottom: 3
  },
  hoursControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  hoursInput: {
    width: 94,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.88)",
    color: colors.text,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900"
  },
  hoursInputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 10
  },
  hoursUnit: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900"
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.62)",
    marginBottom: 16
  },
  switchText: {
    flex: 1
  },
  switchTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4
  },
  segmented: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
    padding: 6,
    borderRadius: 22,
    backgroundColor: "rgba(230,236,255,0.54)"
  },
  footer: {
    marginTop: 2,
    marginBottom: 8,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.48)"
  }
});
