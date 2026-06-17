import { PropsWithChildren } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/theme";

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
    <TouchableOpacity style={[styles.chip, active && styles.activeChip]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.activeChipText]}>{children}</Text>
    </TouchableOpacity>
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
  return (
    <TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.07)",
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    letterSpacing: 0
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.05)"
  },
  activeChip: {
    backgroundColor: "rgba(139,124,255,0.23)",
    borderColor: colors.primary
  },
  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0
  },
  activeChipText: {
    color: colors.text
  },
  button: {
    minHeight: 54,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8
  },
  disabled: {
    opacity: 0.55
  },
  buttonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0
  }
});
