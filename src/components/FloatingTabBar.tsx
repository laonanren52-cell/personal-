import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, gradients, radius, shadow } from "@/constants/theme";

const iconMap = {
  index: "checkmark-done-circle-outline",
  add: "add-circle-outline",
  import: "scan-circle-outline",
  planner: "git-branch-outline",
  settings: "options-outline"
} as const;

export function FloatingTabBar({ state, descriptors, navigation }: any) {
  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <BlurView intensity={38} tint="light" style={styles.blur}>
        <LinearGradient colors={["rgba(255,255,255,0.88)", "rgba(255,255,255,0.68)"]} style={styles.bar}>
          {state.routes.map((route: { key: string; name: string; params?: object }, index: number) => {
            const descriptor = descriptors[route.key];
            const options = descriptor.options;
            const label =
              typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;
            const focused = state.index === index;
            const iconName = iconMap[route.name as keyof typeof iconMap] ?? "ellipse-outline";

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <TabItem
                key={route.key}
                label={String(label)}
                focused={focused}
                iconName={iconName}
                onPress={onPress}
              />
            );
          })}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

function TabItem({
  label,
  focused,
  iconName,
  onPress
}: {
  label: string;
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.92)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.08 : 0.94,
      friction: 6,
      tension: 170,
      useNativeDriver: true
    }).start();
  }, [focused, scale]);

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Animated.View style={[styles.itemInner, focused && styles.itemActive, { transform: [{ scale }] }]}>
        {focused ? (
          <LinearGradient colors={gradients.primaryButton} style={styles.activeFill} />
        ) : null}
        <Ionicons name={iconName} size={21} color={focused ? colors.white : colors.primary} />
        <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: Platform.OS === "ios" ? 20 : 12,
    height: 76
  },
  blur: {
    flex: 1,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: "rgba(255,255,255,0.82)",
    ...shadow.glow
  },
  bar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingVertical: 10
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: "center"
  },
  itemInner: {
    minHeight: 48,
    minWidth: 50,
    maxWidth: 78,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 10,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.40)"
  },
  itemActive: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.74)"
  },
  activeFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0
  },
  labelActive: {
    color: colors.white
  }
});
