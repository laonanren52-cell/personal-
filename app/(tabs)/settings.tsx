import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedGlassScreen } from "@/components/AnimatedGlassScreen";
import { Chip, Field, PrimaryButton } from "@/components/FormControls";
import { MutedText, PageTitle, SectionTitle } from "@/components/Typography";
import { colors, radius } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";

const offsetOptions = [
  { label: "当天", value: 0 },
  { label: "提前1天", value: 1 },
  { label: "提前2天", value: 2 }
];

export default function SettingsScreen() {
  const { settings, updateSettings, clearTasks } = useTasks();
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [aiEnabled, setAiEnabled] = useState(settings.aiEnabled);
  const [defaultOffsets, setDefaultOffsets] = useState(settings.defaultReminderOffsets);

  const toggleOffset = (value: number) => {
    setDefaultOffsets((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value].sort((a, b) => b - a)
    );
  };

  const save = async () => {
    await updateSettings({
      apiKey,
      aiEnabled,
      defaultReminderOffsets: defaultOffsets.length ? defaultOffsets : [0]
    });
    Alert.alert("已保存", "设置已存入本地设备。");
  };

  return (
    <AnimatedGlassScreen>
      <MutedText>设置</MutedText>
      <PageTitle>真实 AI 与提醒偏好</PageTitle>

      <AnimatedCard delay={80} contentStyle={styles.panel}>
        <Field
          label="API Key"
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="可选，未填写时使用本地规则和 Mock OCR"
          secureTextEntry
        />

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchTitle}>启用真实 AI 分析</Text>
            <MutedText>开启后优先调用大模型；失败会自动回退本地算法。</MutedText>
          </View>
          <Switch
            value={aiEnabled}
            onValueChange={setAiEnabled}
            trackColor={{ true: colors.primary, false: "rgba(255,255,255,0.16)" }}
            thumbColor={colors.text}
          />
        </View>

        <SectionTitle style={styles.smallTitle}>默认提醒时间</SectionTitle>
        <View style={styles.chips}>
          {offsetOptions.map((item) => (
            <Chip key={item.value} active={defaultOffsets.includes(item.value)} onPress={() => toggleOffset(item.value)}>
              {item.label}
            </Chip>
          ))}
        </View>

        <PrimaryButton onPress={save}>保存设置</PrimaryButton>
      </AnimatedCard>

      <AnimatedCard delay={160} contentStyle={styles.about}>
        <View style={styles.aboutIcon}>
          <Ionicons name="information-circle-outline" size={24} color={colors.cyan} />
        </View>
        <View style={styles.aboutText}>
          <Text style={styles.aboutTitle}>App 说明</Text>
          <MutedText>
            这是面向学生、比赛、项目、作业和面试场景的 AI 待办规划 Demo。数据和 API Key 只保存在本机。
          </MutedText>
        </View>
      </AnimatedCard>

      <TouchableOpacity
        style={styles.danger}
        onPress={() =>
          Alert.alert("清空所有任务", "此操作会删除本地任务和已安排提醒。", [
            { text: "取消", style: "cancel" },
            { text: "清空", style: "destructive", onPress: clearTasks }
          ])
        }
      >
        <Ionicons name="trash-outline" size={18} color={colors.red} />
        <Text style={styles.dangerText}>清空所有任务</Text>
      </TouchableOpacity>
    </AnimatedGlassScreen>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 18,
    padding: 16,
    borderRadius: radius.xl
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
  switchText: {
    flex: 1
  },
  switchTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4
  },
  smallTitle: {
    marginBottom: 10,
    fontSize: 15
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  about: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: radius.lg
  },
  aboutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(70,216,255,0.1)"
  },
  aboutText: {
    flex: 1
  },
  aboutTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 6
  },
  danger: {
    marginTop: 16,
    minHeight: 52,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,92,122,0.38)",
    backgroundColor: "rgba(255,92,122,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  dangerText: {
    color: colors.red,
    fontSize: 14,
    fontWeight: "900"
  }
});
