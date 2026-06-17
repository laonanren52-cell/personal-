import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlassScreen } from "@/components/GlassScreen";
import { MutedText, PageTitle } from "@/components/Typography";
import { colors } from "@/constants/theme";
import { useTasks } from "@/context/TaskContext";
import { extractTasksFromText } from "@/services/extract";
import { recognizeImageText } from "@/services/ocr";

export default function ImportScreen() {
  const { settings, setImportDrafts } = useTasks();
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [busy, setBusy] = useState(false);

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
    try {
      const text = await recognizeImageText({
        base64: asset.base64,
        apiKey: settings.apiKey,
        aiEnabled: settings.aiEnabled
      });
      setOcrText(text);
      const drafts = extractTasksFromText(text);
      if (!drafts.length) {
        Alert.alert("未提取到任务", "你可以换一张更清晰的图片，或稍后手动添加任务。");
        return;
      }
      setImportDrafts(drafts);
      router.push("/confirm-import");
    } catch (error) {
      Alert.alert("识别失败", error instanceof Error ? error.message : "请稍后再试");
    } finally {
      setBusy(false);
    }
  };

  return (
    <GlassScreen>
      <MutedText>图片导入</MutedText>
      <PageTitle>从截图、白板或通知里提取任务</PageTitle>

      <View style={styles.scanPanel}>
        <View style={styles.scanCircle}>
          <Ionicons name="scan-outline" size={54} color={colors.cyan} />
        </View>
        <Text style={styles.scanTitle}>OCR 可用 Mock 保底</Text>
        <MutedText style={styles.centerText}>
          未配置 API Key 时会使用内置模拟文本，保证 Demo 可以完整走通识别和确认流程。
        </MutedText>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => pick("camera")} disabled={busy}>
            <Ionicons name="camera-outline" size={20} color={colors.text} />
            <Text style={styles.actionText}>拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => pick("library")} disabled={busy}>
            <Ionicons name="images-outline" size={20} color={colors.text} />
            <Text style={styles.actionText}>相册</Text>
          </TouchableOpacity>
        </View>
      </View>

      {preview ? <Image source={{ uri: preview }} style={styles.preview} /> : null}

      <View style={styles.ocrBox}>
        <Text style={styles.ocrLabel}>{busy ? "识别中..." : "最近识别文本"}</Text>
        <Text style={styles.ocrText}>{ocrText || "还没有识别记录。"}</Text>
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  scanPanel: {
    marginTop: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.065)",
    padding: 22,
    alignItems: "center"
  },
  scanCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(70,216,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(70,216,255,0.28)",
    marginBottom: 16
  },
  scanTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8
  },
  centerText: {
    textAlign: "center"
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
    backgroundColor: colors.primary
  },
  actionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(7,9,20,0.45)"
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
