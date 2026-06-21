import { useState } from "react";
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedGlassScreen } from "@/components/AnimatedGlassScreen";
import { AppIcon } from "@/components/AppIcon";
import { BrandLogo } from "@/components/BrandLogo";
import { Chip, Field, PrimaryButton } from "@/components/FormControls";
import { MobilePageContainer } from "@/components/MobilePageContainer";
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
  const [clearing, setClearing] = useState(false);

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

  const confirmClearTasks = () => {
    Alert.alert("确认清空全部任务？", "此操作不可恢复，将删除所有任务数据。", [
      { text: "取消", style: "cancel" },
      {
        text: "确认清空",
        style: "destructive",
        onPress: async () => {
          setClearing(true);
          try {
            await clearTasks();
            Alert.alert("已清空全部任务");
          } catch (error) {
            Alert.alert("清空失败", error instanceof Error ? error.message : "请稍后再试");
          } finally {
            setClearing(false);
          }
        }
      }
    ]);
  };

  return (
    <AnimatedGlassScreen>
      <MobilePageContainer>
      <BrandLogo showName subtitle="让事情自己排好队" />
      <MutedText style={styles.pageKicker}>偏好</MutedText>
      <PageTitle style={styles.pageTitle}>我的偏好</PageTitle>

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
            trackColor={{ true: colors.primary, false: "rgba(148,163,184,0.24)" }}
            thumbColor={colors.white}
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
          <BrandLogo size={28} />
        </View>
        <View style={styles.aboutText}>
          <Text style={styles.aboutTitle}>关于序光</Text>
          <MutedText>
            序光面向学生、比赛、项目、作业和面试场景，帮助你自动判断优先级、安排提醒和生成今日计划。数据和 API Key 只保存在本机。
          </MutedText>
        </View>
      </AnimatedCard>

      <TouchableOpacity
        style={styles.danger}
        disabled={clearing}
        onPress={confirmClearTasks}
      >
        <AppIcon name="trash" size={17} color={colors.coral} />
        <Text style={styles.dangerText}>{clearing ? "正在清空..." : "清空所有任务"}</Text>
      </TouchableOpacity>
      </MobilePageContainer>
    </AnimatedGlassScreen>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    marginTop: 2,
    marginBottom: 2
  },
  pageKicker: {
    marginTop: 16
  },
  panel: {
    marginTop: 18,
    padding: 16,
    borderRadius: 26
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
    backgroundColor: "rgba(255,255,255,0.62)",
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,124,255,0.10)"
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
    borderColor: "rgba(255,92,122,0.24)",
    backgroundColor: "rgba(255,92,122,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  dangerText: {
    color: colors.coral,
    fontSize: 14,
    fontWeight: "900"
  }
});
