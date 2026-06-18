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
      <Tabs.Screen name="add" options={{ title: "添加" }} />
      <Tabs.Screen name="import" options={{ title: "图片导入" }} />
      <Tabs.Screen name="planner" options={{ title: "AI规划" }} />
      <Tabs.Screen name="settings" options={{ title: "设置" }} />
    </Tabs>
  );
}
