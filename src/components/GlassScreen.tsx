import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, gradients } from "@/constants/theme";

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export function GlassScreen({ children, scroll = true }: Props) {
  const content = <View style={styles.content}>{children}</View>;
  return (
    <LinearGradient colors={gradients.screen} style={styles.root}>
      <View style={styles.orbOne} />
      <View style={styles.orbTwo} />
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  safe: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 120
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8
  },
  orbOne: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(79,124,255,0.14)",
    top: -70,
    right: -80
  },
  orbTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(34,199,217,0.10)",
    top: 170,
    left: -90
  }
});
