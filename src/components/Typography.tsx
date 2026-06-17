import { PropsWithChildren } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { colors } from "@/constants/theme";

export function PageTitle({ children, style, ...props }: PropsWithChildren<TextProps>) {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
}

export function SectionTitle({ children, style, ...props }: PropsWithChildren<TextProps>) {
  return (
    <Text style={[styles.section, style]} {...props}>
      {children}
    </Text>
  );
}

export function MutedText({ children, style, ...props }: PropsWithChildren<TextProps>) {
  return (
    <Text style={[styles.muted, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "900",
    letterSpacing: 0
  },
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0
  },
  muted: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0
  }
});
