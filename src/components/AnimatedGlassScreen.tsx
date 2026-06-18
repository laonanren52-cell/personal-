import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { animation, colors, gradients } from "@/constants/theme";

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export function AnimatedGlassScreen({ children, scroll = true }: Props) {
  const page = useRef(new Animated.Value(0)).current;
  const driftA = useRef(new Animated.Value(0)).current;
  const driftB = useRef(new Animated.Value(0)).current;
  const driftC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(page, {
      toValue: 1,
      duration: animation.pageDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();

    const makeLoop = (value: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      );

    const loops = [makeLoop(driftA, 7200), makeLoop(driftB, 8800), makeLoop(driftC, 10400)];
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [driftA, driftB, driftC, page]);

  const content = (
    <Animated.View
      style={[
        styles.content,
        {
          opacity: page,
          transform: [
            {
              translateY: page.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0]
              })
            }
          ]
        }
      ]}
    >
      {children}
    </Animated.View>
  );

  return (
    <LinearGradient colors={gradients.screen} style={styles.root}>
      <Animated.View
        style={[
          styles.orb,
          styles.orbOne,
          {
            opacity: driftA.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.32] }),
            transform: [
              { translateX: driftA.interpolate({ inputRange: [0, 1], outputRange: [0, -26] }) },
              { translateY: driftA.interpolate({ inputRange: [0, 1], outputRange: [0, 22] }) },
              { scale: driftA.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.08] }) }
            ]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.orbTwo,
          {
            opacity: driftB.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.26] }),
            transform: [
              { translateX: driftB.interpolate({ inputRange: [0, 1], outputRange: [0, 28] }) },
              { translateY: driftB.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) },
              { scale: driftB.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.12] }) }
            ]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.orbThree,
          {
            opacity: driftC.interpolate({ inputRange: [0, 1], outputRange: [0.09, 0.2] }),
            transform: [
              { translateX: driftC.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) },
              { translateY: driftC.interpolate({ inputRange: [0, 1], outputRange: [0, -24] }) },
              { scale: driftC.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.1] }) }
            ]
          }
        ]}
      />
      <View style={styles.vignette} />
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
    paddingBottom: 132
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8
  },
  orb: {
    position: "absolute",
    borderRadius: 999
  },
  orbOne: {
    width: 260,
    height: 260,
    top: -82,
    right: -92,
    backgroundColor: "rgba(139,124,255,0.7)"
  },
  orbTwo: {
    width: 220,
    height: 220,
    top: 184,
    left: -118,
    backgroundColor: "rgba(70,216,255,0.62)"
  },
  orbThree: {
    width: 190,
    height: 190,
    bottom: 120,
    right: -84,
    backgroundColor: "rgba(96,230,168,0.34)"
  },
  vignette: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(3,5,13,0.18)"
  }
});
