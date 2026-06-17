import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, Task } from "@/types/task";

const TASKS_KEY = "ai_priority_tasks";
const SETTINGS_KEY = "ai_priority_settings";

export const defaultSettings: AppSettings = {
  apiKey: "",
  aiEnabled: false,
  defaultReminderOffsets: [1, 0]
};

export async function loadTasks() {
  const raw = await AsyncStorage.getItem(TASKS_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]) {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function loadSettings() {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    return defaultSettings;
  }
  try {
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
