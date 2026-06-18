import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { animation, colors, gradients, radius, shadow } from "@/constants/theme";

type Props = PropsWithChildren<{
  delay?: number;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  colorsOverride?: readonly [string, string, ...string[]];
}>;

export function AnimatedCard({
  children,
  delay = 0,
  disabled,
  onPress,
  style,
  contentStyle,
  colorsOverride
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: animation.cardDuration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [delay, enter]);

  const pressTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 7,
      tension: 180,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] })
            },
            { scale }
          ]
        },
        style
      ]}
    >
      <Pressable
        disabled={disabled && !onPress}
        onPress={onPress}
        onPressIn={() => pressTo(0.985)}
        onPressOut={() => pressTo(1)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <LinearGradient
          colors={colorsOverride ?? gradients.card}
          style={[styles.card, hovered && Platform.OS === "web" ? styles.hovered : null, contentStyle]}
        >
          {children}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadow.glow
  },
  hovered: {
    borderColor: "rgba(79,124,255,0.34)"
  }
});
