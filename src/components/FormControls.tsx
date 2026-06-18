import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, gradients, radius, shadow } from "@/constants/theme";

type FieldProps = TextInputProps & {
  label: string;
};

export function Field({ label, style, ...props }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.dim}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

export function Chip({
  active,
  children,
  onPress
}: PropsWithChildren<{
  active?: boolean;
  onPress: () => void;
}>) {
  return (
    <Pressable style={[styles.chip, active && styles.activeChip]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.activeChipText]}>{children}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  children,
  onPress,
  disabled
}: PropsWithChildren<{
  onPress: () => void;
  disabled?: boolean;
}>) {
  const scale = useRef(new Animated.Value(1)).current;
  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 7,
      tension: 180,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        disabled={disabled}
        style={disabled && styles.disabled}
      >
        <LinearGradient colors={gradients.primaryButton} style={styles.button}>
          <Text style={styles.buttonText}>{children}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fieldWrap: {
    marginBottom: 16
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 0
  },
  input: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.72)",
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    letterSpacing: 0
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.62)"
  },
  activeChip: {
    backgroundColor: "rgba(221,231,255,0.86)",
    borderColor: colors.primary
  },
  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0
  },
  activeChipText: {
    color: colors.primary
  },
  button: {
    minHeight: 54,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.glow
  },
  disabled: {
    opacity: 0.55
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0
  }
});
