import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Chip, Field, PrimaryButton } from "@/components/FormControls";
import { GlassScreen } from "@/components/GlassScreen";
import { MutedText, PageTitle } from "@/components/Typography";
import { categoryLabels, colors } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";
import { draftDeadlineToText } from "@/services/extract";
import { ImportTaskDraft, TaskCategory, TaskDraft } from "@/types/task";
import { parseInputDateTime } from "@/utils/date";

const categories = Object.keys(categoryLabels) as TaskCategory[];

export default function ConfirmImportScreen() {
  const { importDrafts, setImportDrafts, addManyTasks } = useTasks();
  const [drafts, setDrafts] = useState(
    importDrafts.map((draft) => ({
      ...draft,
      deadline: draftDeadlineToText(draft.deadline)
    }))
  );
  const [saving, setSaving] = useState(false);

  const updateDraft = (index: number, patch: Partial<ImportTaskDraft & { deadline: string }>) => {
    setDrafts((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const submit = async () => {
    const selected = drafts.filter((draft) => draft.selected);
    if (!selected.length) {
      Alert.alert("请选择任务", "至少选择一条任务加入列表。");
      return;
    }

    const normalized: TaskDraft[] = [];
    for (const draft of selected) {
      const deadline = parseInputDateTime(draft.deadline);
      if (!deadline) {
        Alert.alert("日期待补充", `“${draft.title}” 的日期格式不正确，请补充为 YYYY-MM-DD HH:mm。`);
        return;
      }
      normalized.push({
        title: draft.title,
        description: draft.description,
        deadline: deadline.toISOString(),
        category: draft.category,
        importance: draft.importance,
        estimatedHours: draft.estimatedHours,
        reminderEnabled: draft.reminderEnabled,
        reminderOffsets: draft.reminderOffsets
      });
    }

    setSaving(true);
    try {
      await addManyTasks(normalized);
      setImportDrafts([]);
      Alert.alert("已加入任务", `${normalized.length} 条任务已完成 AI 分析。`, [
        { text: "回到首页", onPress: () => router.replace("/") }
      ]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassScreen>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <MutedText>确认导入</MutedText>
          <PageTitle>编辑后再加入任务列表</PageTitle>
        </View>
      </View>

      {drafts.length ? (
        drafts.map((draft, index) => (
          <View key={`${draft.title}-${index}`} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>候选任务 {index + 1}</Text>
              <Switch
                value={draft.selected}
                onValueChange={(selected) => updateDraft(index, { selected })}
                trackColor={{ true: colors.primary, false: "rgba(255,255,255,0.16)" }}
                thumbColor={colors.text}
              />
            </View>
            <Field label="标题" value={draft.title} onChangeText={(title) => updateDraft(index, { title })} />
            <Field
              label="日期"
              value={draft.deadline}
              onChangeText={(deadline) => updateDraft(index, { deadline })}
              placeholder="YYYY-MM-DD HH:mm"
            />
            <Text style={styles.label}>类型</Text>
            <View style={styles.chips}>
              {categories.map((item) => (
                <Chip key={item} active={draft.category === item} onPress={() => updateDraft(index, { category: item })}>
                  {categoryLabels[item]}
                </Chip>
              ))}
            </View>
            <Text style={styles.label}>重要程度</Text>
            <View style={styles.chips}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Chip key={item} active={draft.importance === item} onPress={() => updateDraft(index, { importance: item })}>
                  {item}
                </Chip>
              ))}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>暂无待确认任务，请先从图片导入页识别。</Text>
        </View>
      )}

      <PrimaryButton onPress={submit} disabled={saving || !drafts.length}>
        {saving ? "加入中..." : "确认加入选中任务"}
      </PrimaryButton>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 18
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 3
  },
  headerText: {
    flex: 1
  },
  card: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.065)",
    padding: 16,
    marginBottom: 14
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  empty: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 16
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center"
  }
});
