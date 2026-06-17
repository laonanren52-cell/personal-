import { useState } from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Chip, Field, PrimaryButton } from "@/components/FormControls";
import { GlassScreen } from "@/components/GlassScreen";
import { MutedText, PageTitle, SectionTitle } from "@/components/Typography";
import { categoryLabels, colors } from "@/constants/theme";
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
    try {
      await addTask(draft);
      setTitle("");
      setDescription("");
      setNotes("");
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
    <GlassScreen>
      <MutedText>手动创建</MutedText>
      <PageTitle>把任务交给 AI 排序</PageTitle>
      <View style={styles.panel}>
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

        <SectionTitle style={styles.smallTitle}>任务类型</SectionTitle>
        <View style={styles.chips}>
          {categories.map((item) => (
            <Chip key={item} active={category === item} onPress={() => setCategory(item)}>
              {categoryLabels[item]}
            </Chip>
          ))}
        </View>

        <SectionTitle style={styles.smallTitle}>重要程度</SectionTitle>
        <View style={styles.chips}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Chip key={item} active={importance === item} onPress={() => setImportance(item)}>
              {item}
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

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchTitle}>需要提前提醒</Text>
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
            <SectionTitle style={styles.smallTitle}>提醒时间</SectionTitle>
            <View style={styles.chips}>
              {offsetOptions.map((item) => (
                <Chip key={item.value} active={reminderOffsets.includes(item.value)} onPress={() => toggleOffset(item.value)}>
                  {item.label}
                </Chip>
              ))}
            </View>
          </>
        ) : null}

        <Field label="备注" value={notes} onChangeText={setNotes} placeholder="可选，例如老师要求、提交入口" multiline style={styles.multiline} />
        <PrimaryButton onPress={submit} disabled={saving}>
          {saving ? "分析中..." : "添加并分析优先级"}
        </PrimaryButton>
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 18,
    padding: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.065)"
  },
  multiline: {
    minHeight: 92,
    textAlignVertical: "top"
  },
  smallTitle: {
    marginBottom: 10,
    marginTop: 4,
    fontSize: 15
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(7,9,20,0.35)",
    marginBottom: 16
  },
  switchTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4
  }
});
