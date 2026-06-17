import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Task } from "@/types/task";
import { getRemainingText } from "@/utils/date";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

const notificationKey = (taskId: string) => `notification_ids_${taskId}`;

export async function ensureNotificationPermission() {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) {
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export function getDefaultOffsets(priorityLevel: Task["priorityLevel"]) {
  if (priorityLevel === "high") {
    return [2, 1, 0];
  }
  if (priorityLevel === "medium") {
    return [1, 0];
  }
  return [0];
}

export async function scheduleTaskNotifications(task: Task) {
  await cancelTaskNotifications(task.id);
  if (!task.reminderEnabled || task.completed) {
    return;
  }
  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) {
    return;
  }

  const deadline = new Date(task.deadline);
  if (Number.isNaN(deadline.getTime())) {
    return;
  }

  const offsets = task.reminderOffsets.length ? task.reminderOffsets : getDefaultOffsets(task.priorityLevel);
  const ids: string[] = [];
  for (const offset of offsets) {
    const triggerDate = buildTriggerDate(deadline, offset);
    if (triggerDate.getTime() <= Date.now()) {
      continue;
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `任务提醒：${task.title}`,
        body: `${getOffsetText(offset, task.deadline)}，${task.aiAdvice}`,
        sound: true
      },
      trigger: { date: triggerDate } as Notifications.NotificationTriggerInput
    });
    ids.push(id);
  }

  await AsyncStorage.setItem(notificationKey(task.id), JSON.stringify(ids));
}

export async function cancelTaskNotifications(taskId: string) {
  const raw = await AsyncStorage.getItem(notificationKey(taskId));
  if (!raw) {
    return;
  }
  try {
    const ids = JSON.parse(raw) as string[];
    await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  } finally {
    await AsyncStorage.removeItem(notificationKey(taskId));
  }
}

export async function cancelAllTaskNotifications(tasks: Task[]) {
  await Promise.all(tasks.map((task) => cancelTaskNotifications(task.id)));
}

function buildTriggerDate(deadline: Date, offsetDays: number) {
  const date = new Date(deadline);
  if (offsetDays === 0) {
    date.setHours(Math.min(deadline.getHours(), 9), 0, 0, 0);
    if (date.getTime() <= Date.now()) {
      const fallback = new Date(deadline.getTime() - 2 * 36e5);
      return fallback;
    }
    return date;
  }
  date.setDate(date.getDate() - offsetDays);
  date.setHours(9, 0, 0, 0);
  return date;
}

function getOffsetText(offset: number, deadline: string) {
  if (offset === 0) {
    return `今天截止，${getRemainingText(deadline)}`;
  }
  return `距离截止还有 ${offset} 天`;
}
