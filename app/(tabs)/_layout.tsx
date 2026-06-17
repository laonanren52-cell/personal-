import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { colors } from "@/constants/theme";

const iconMap = {
  index: "grid-outline",
  add: "add-circle-outline",
  import: "camera-outline",
  planner: "sparkles-outline",
  settings: "settings-outline"
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Platform.OS === "ios" ? 22 : 14,
          height: 68,
          borderRadius: 28,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: "rgba(13, 17, 31, 0.92)",
          shadowColor: "#6D5DFB",
          shadowOpacity: 0.2,
          shadowRadius: 22,
          elevation: 18,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 16 : 10
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700"
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={iconMap[route.name as keyof typeof iconMap] ?? "ellipse-outline"}
            size={size}
            color={color}
          />
        )
      })}
    >
      <Tabs.Screen name="index" options={{ title: "首页" }} />
      <Tabs.Screen name="add" options={{ title: "添加" }} />
      <Tabs.Screen name="import" options={{ title: "图片导入" }} />
      <Tabs.Screen name="planner" options={{ title: "AI规划" }} />
      <Tabs.Screen name="settings" options={{ title: "设置" }} />
    </Tabs>
  );
}
