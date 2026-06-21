import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { colors, gradients } from "@/constants/theme";

type Props = {
  size?: number;
  showName?: boolean;
  subtitle?: string;
};

export function BrandLogo({ size = 42, showName = false, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={gradients.primaryButton} style={[styles.logo, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.path, { width: size * 0.68, left: size * 0.16, top: size * 0.52 }]} />
        <View style={[styles.pathShort, { width: size * 0.34, left: size * 0.26, top: size * 0.38 }]} />
        <View style={[styles.checkA, { width: size * 0.18, left: size * 0.31, top: size * 0.61 }]} />
        <View style={[styles.checkB, { width: size * 0.34, left: size * 0.43, top: size * 0.55 }]} />
        <View style={[styles.glowDot, { width: size * 0.16, height: size * 0.16, right: size * 0.16, top: size * 0.2 }]} />
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
  logo: {
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 14
  },
  path: {
    position: "absolute",
    height: 2,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.52)",
    transform: [{ rotate: "-24deg" }]
  },
  pathShort: {
    position: "absolute",
    height: 2,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.38)",
    transform: [{ rotate: "28deg" }]
  },
  checkA: {
    position: "absolute",
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.white,
    transform: [{ rotate: "42deg" }]
  },
  checkB: {
    position: "absolute",
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.white,
    transform: [{ rotate: "-48deg" }]
  },
  glowDot: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: colors.mint,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)"
  },
  copy: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
    letterSpacing: 0
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 2
  }
});
