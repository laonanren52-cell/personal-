import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/theme";

type Props = {
  label: string;
  value: string | number;
  accent?: string;
};

export function MetricCard({ label, value, accent = colors.primary }: Props) {
  return (
    <LinearGradient colors={["rgba(255,255,255,0.11)", "rgba(255,255,255,0.045)"]} style={styles.card}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    justifyContent: "space-between",
    overflow: "hidden"
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0
  }
});
