import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedGlassScreen } from "@/components/AnimatedGlassScreen";
import { Chip, Field, PrimaryButton } from "@/components/FormControls";
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
      <MutedText>新建任务</MutedText>
      <Text style={styles.title}>让 AI 先判断轻重缓急</Text>

      <AnimatedCard delay={80} contentStyle={styles.group}>
        <View style={styles.groupHeader}>
          <Ionicons name="document-text-outline" size={18} color={colors.cyan} />
          <SectionTitle style={styles.groupTitle}>核心信息</SectionTitle>
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
          <Ionicons name="options-outline" size={18} color={colors.primary} />
          <SectionTitle style={styles.groupTitle}>任务属性</SectionTitle>
        </View>
        <Text style={styles.label}>任务类型</Text>
        <View style={styles.chips}>
          {categories.map((item) => (
            <Chip key={item} active={category === item} onPress={() => setCategory(item)}>
              {categoryLabels[item]}
            </Chip>
          ))}
        </View>

        <Text style={styles.label}>重要程度</Text>
        <View style={styles.energyRow}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Chip key={item} active={importance === item} onPress={() => setImportance(item)}>
              <Text style={[styles.energyDot, importance >= item && styles.energyDotActive]}>●</Text>
            </Chip>
          ))}
        </View>

        <Field
          label="预计耗时（小时）"
          value={estimatedHours}
          onChangeText={setEstimatedHours}
          keyboardType="decimal-pad"
          placeholder="例如 2"
        />
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
            trackColor={{ true: colors.primary, false: "rgba(255,255,255,0.16)" }}
            thumbColor={colors.text}
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
  group: {
    padding: 16,
    borderRadius: radius.xl,
    marginBottom: 14
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14
  },
  groupTitle: {
    fontSize: 16
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
  energyRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16
  },
  energyDot: {
    color: colors.dim,
    fontSize: 13,
    lineHeight: 15
  },
  energyDotActive: {
    color: colors.cyan
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
    backgroundColor: "rgba(221,231,255,0.42)"
  },
  footer: {
    marginTop: 2,
    marginBottom: 8,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.48)"
  }
});
