import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TaskProvider } from "@/context/TaskContext";
import { colors } from "@/constants/theme";

export default function RootLayout() {
  return (
    <TaskProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="confirm-import" options={{ presentation: "modal" }} />
      </Stack>
    </TaskProvider>
  );
}
