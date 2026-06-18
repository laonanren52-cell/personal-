import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { colors, gradients } from "@/constants/theme";

type Props = {
  size?: number;
  showName?: boolean;
  subtitle?: string;
};

export function BrandMark({ size = 42, showName = false, subtitle }: Props) {
  const iconSize = Math.max(16, Math.round(size * 0.48));
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={gradients.primaryButton} style={[styles.mark, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={styles.pathLine} />
        <View style={styles.dotOne} />
        <View style={styles.dotTwo} />
        <Ionicons name="checkmark-done" size={iconSize} color={colors.white} />
      </LinearGradient>
      {showName ? (
        <View style={styles.copy}>
          <Text style={styles.name}>序光</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  mark: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 14
  },
  pathLine: {
    position: "absolute",
    width: "72%",
    height: 2,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.48)",
    transform: [{ rotate: "-28deg" }]
  },
  dotOne: {
    position: "absolute",
    right: 9,
    top: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cyan
  },
  dotTwo: {
    position: "absolute",
    left: 10,
    bottom: 10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.86)"
  },
  copy: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 2
  }
});
