import { Tabs } from "expo-router";
import { colors } from "@/constants/theme";
import { FloatingTabBar } from "@/components/FloatingTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.muted
      }}
    >
      <Tabs.Screen name="index" options={{ title: "首页" }} />
      <Tabs.Screen name="add" options={{ title: "新任务" }} />
      <Tabs.Screen name="import" options={{ title: "识别" }} />
      <Tabs.Screen name="planner" options={{ title: "节奏" }} />
      <Tabs.Screen name="settings" options={{ title: "偏好" }} />
    </Tabs>
  );
}
