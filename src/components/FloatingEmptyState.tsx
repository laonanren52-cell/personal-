import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/FormControls";
import { MutedText } from "@/components/Typography";
import { colors, gradients, radius, shadow } from "@/constants/theme";

type Props = {
  onAction: () => void;
};

export function FloatingEmptyState({ onAction }: Props) {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  return (
    <LinearGradient colors={gradients.card} style={styles.empty}>
      <Animated.View
        style={[
          styles.iconHalo,
          {
            transform: [
              {
                translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] })
              }
            ]
          }
        ]}
      >
        <LinearGradient colors={gradients.primaryButton} style={styles.iconCircle}>
          <Feather name="zap" size={34} color={colors.white} />
        </LinearGradient>
      </Animated.View>
      <Text style={styles.emptyTitle}>还没有任务</Text>
      <MutedText style={styles.emptyCopy}>添加任务后，序光会自动帮你安排优先级</MutedText>
      <View style={styles.actionWrap}>
        <PrimaryButton onPress={onAction}>立即添加任务</PrimaryButton>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 42,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border
  },
  iconHalo: {
    width: 94,
    height: 94,
    borderRadius: 47,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(38,198,218,0.10)",
    marginBottom: 18,
    ...shadow.cyan
  },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 0
  },
  emptyCopy: {
    textAlign: "center"
  },
  actionWrap: {
    width: "100%",
    marginTop: 22
  }
});
