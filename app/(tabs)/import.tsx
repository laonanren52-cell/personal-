import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedGlassScreen } from "@/components/AnimatedGlassScreen";
import { MobilePageContainer } from "@/components/MobilePageContainer";
import { MutedText } from "@/components/Typography";
import { colors, gradients, radius, shadow } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";
import { extractTasksFromText } from "@/services/extract";
import { recognizeImageText } from "@/services/ocr";

type ImportStatus = "idle" | "recognizing" | "extracting" | "confirming";

export default function ImportScreen() {
  const { settings, setImportDrafts } = useTasks();
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<ImportStatus>("idle");
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1,
          duration: 1900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(scan, {
          toValue: 0,
          duration: 1900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scan]);

  const pick = async (mode: "camera" | "library") => {
    const permission =
      mode === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("需要权限", mode === "camera" ? "请允许相机权限后再拍照。" : "请允许相册权限后再选择图片。");
      return;
    }

    const result =
      mode === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.8, base64: true })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, base64: true });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    setPreview(asset.uri);
    setBusy(true);
    setStatus("recognizing");
    try {
      const text = await recognizeImageText({
        base64: asset.base64,
        apiKey: settings.apiKey,
        aiEnabled: settings.aiEnabled
      });
      setOcrText(text);
      setStatus("extracting");
      const drafts = extractTasksFromText(text);
      if (!drafts.length) {
        setStatus("idle");
        Alert.alert("未提取到任务", "你可以换一张更清晰的图片，或稍后手动添加任务。");
        return;
      }
      setStatus("confirming");
      setImportDrafts(drafts);
      router.push("/confirm-import");
    } catch (error) {
      setStatus("idle");
      Alert.alert("识别失败", error instanceof Error ? error.message : "请稍后再试");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatedGlassScreen>
      <MobilePageContainer>
      <MutedText>截图识别</MutedText>
      <Text style={styles.title}>从截图、通知、聊天记录中提取待办</Text>

      <AnimatedCard delay={80} contentStyle={styles.scanPanel}>
        <View style={styles.scanWindow}>
          <View style={styles.scanGlow} />
          <Feather name="camera" size={64} color={colors.mint} />
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateY: scan.interpolate({ inputRange: [0, 1], outputRange: [-72, 72] })
                  }
                ]
              }
            ]}
          />
        </View>
        <Text style={styles.scanTitle}>截图变任务</Text>
        <MutedText style={styles.centerText}>选择截图后，系统会先识别文字，再提取可确认的任务。</MutedText>
        <View style={styles.statusRow}>
          {["recognizing", "extracting", "confirming"].map((item) => (
            <View key={item} style={[styles.statusDot, status === item && styles.statusDotActive]} />
          ))}
          <Text style={styles.statusText}>{getStatusText(status)}</Text>
        </View>
        <View style={styles.buttonRow}>
          <ActionButton icon="camera" label="拍照" onPress={() => pick("camera")} disabled={busy} />
          <ActionButton icon="image" label="相册" onPress={() => pick("library")} disabled={busy} />
        </View>
      </AnimatedCard>

      {preview ? <Image source={{ uri: preview }} style={styles.preview} /> : null}

      <AnimatedCard delay={180} contentStyle={styles.ocrBox}>
        <Text style={styles.ocrLabel}>{busy ? "正在处理" : "最近识别文本"}</Text>
        <Text style={styles.ocrText}>{ocrText || "还没有识别记录。"}</Text>
      </AnimatedCard>
      </MobilePageContainer>
    </AnimatedGlassScreen>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  disabled
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={disabled && styles.disabled}>
      <LinearGradient colors={gradients.primaryButton} style={styles.actionButton}>
        <Feather name={icon} size={19} color={colors.white} />
        <Text style={styles.actionText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function getStatusText(status: ImportStatus) {
  if (status === "recognizing") return "正在识别";
  if (status === "extracting") return "提取任务中";
  if (status === "confirming") return "等待确认";
  return "等待图片";
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 18
  },
  scanPanel: {
    borderRadius: 32,
    padding: 22,
    alignItems: "center"
  },
  scanWindow: {
    width: "100%",
    height: 190,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "rgba(38,198,218,0.18)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.58)",
    overflow: "hidden",
    marginBottom: 18
  },
  scanGlow: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(38,198,218,0.10)"
  },
  scanLine: {
    position: "absolute",
    left: 18,
    right: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOpacity: 0.32,
    shadowRadius: 9
  },
  scanTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8
  },
  centerText: {
    textAlign: "center"
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.62)"
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dim
  },
  statusDotActive: {
    backgroundColor: colors.cyan
  },
  statusText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900"
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    height: 52,
    borderRadius: 18,
    ...shadow.glow
  },
  actionText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900"
  },
  disabled: {
    opacity: 0.55
  },
  preview: {
    width: "100%",
    height: 210,
    borderRadius: 24,
    marginTop: 16,
    backgroundColor: colors.panelStrong
  },
  ocrBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 24
  },
  ocrLabel: {
    color: colors.cyan,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8
  },
  ocrText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22
  }
});
