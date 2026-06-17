import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { analyzeTaskPriority, analyzeTaskPriorityWithAI, refreshTaskAnalysis } from "@/services/priority";
import { cancelAllTaskNotifications, cancelTaskNotifications, scheduleTaskNotifications } from "@/services/notifications";
import { defaultSettings, loadSettings, loadTasks, saveSettings, saveTasks } from "@/services/storage";
import { AppSettings, ImportTaskDraft, Task, TaskDraft } from "@/types/task";

type TaskContextValue = {
  tasks: Task[];
  settings: AppSettings;
  loading: boolean;
  importDrafts: ImportTaskDraft[];
  setImportDrafts: (drafts: ImportTaskDraft[]) => void;
  addTask: (draft: TaskDraft) => Promise<void>;
  addManyTasks: (drafts: TaskDraft[]) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearTasks: () => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  refreshPriorities: () => Promise<void>;
};

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [importDrafts, setImportDrafts] = useState<ImportTaskDraft[]>([]);

  useEffect(() => {
    Promise.all([loadTasks(), loadSettings()])
      .then(([storedTasks, storedSettings]) => {
        setTasks(sortTasks(storedTasks.map(refreshTaskAnalysis)));
        setSettings(storedSettings);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistTasks = useCallback(async (next: Task[]) => {
    const sorted = sortTasks(next);
    setTasks(sorted);
    await saveTasks(sorted);
  }, []);

  const buildTask = useCallback(
    async (draft: TaskDraft): Promise<Task> => {
      const now = new Date().toISOString();
      const analysis = settings.aiEnabled
        ? await analyzeTaskPriorityWithAI(draft, settings.apiKey)
        : analyzeTaskPriority(draft);
      return {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: draft.title.trim(),
        description: draft.description?.trim(),
        deadline: draft.deadline,
        category: draft.category,
        importance: draft.importance,
        estimatedHours: draft.estimatedHours,
        completed: false,
        reminderEnabled: draft.reminderEnabled,
        reminderOffsets: draft.reminderOffsets,
        createdAt: now,
        updatedAt: now,
        ...analysis
      };
    },
    [settings.aiEnabled, settings.apiKey]
  );

  const addTask = useCallback(
    async (draft: TaskDraft) => {
      const task = await buildTask(draft);
      await persistTasks([task, ...tasks]);
      await scheduleTaskNotifications(task);
    },
    [buildTask, persistTasks, tasks]
  );

  const addManyTasks = useCallback(
    async (drafts: TaskDraft[]) => {
      const built = await Promise.all(drafts.map(buildTask));
      await persistTasks([...built, ...tasks]);
      await Promise.all(built.map(scheduleTaskNotifications));
    },
    [buildTask, persistTasks, tasks]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const next = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task
      );
      const changed = next.find((task) => task.id === id);
      await persistTasks(next);
      if (changed?.completed) {
        await cancelTaskNotifications(id);
      } else if (changed) {
        await scheduleTaskNotifications(changed);
      }
    },
    [persistTasks, tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await cancelTaskNotifications(id);
      await persistTasks(tasks.filter((task) => task.id !== id));
    },
    [persistTasks, tasks]
  );

  const clearTasks = useCallback(async () => {
    await cancelAllTaskNotifications(tasks);
    await persistTasks([]);
  }, [persistTasks, tasks]);

  const updateSettings = useCallback(async (next: AppSettings) => {
    setSettings(next);
    await saveSettings(next);
  }, []);

  const refreshPriorities = useCallback(async () => {
    const next = tasks.map(refreshTaskAnalysis);
    await persistTasks(next);
    Alert.alert("已刷新", "任务轻重缓急已按当前时间重新计算。");
  }, [persistTasks, tasks]);

  const value = useMemo(
    () => ({
      tasks,
      settings,
      loading,
      importDrafts,
      setImportDrafts,
      addTask,
      addManyTasks,
      toggleTask,
      deleteTask,
      clearTasks,
      updateSettings,
      refreshPriorities
    }),
    [
      tasks,
      settings,
      loading,
      importDrafts,
      addTask,
      addManyTasks,
      toggleTask,
      deleteTask,
      clearTasks,
      updateSettings,
      refreshPriorities
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const value = useContext(TaskContext);
  if (!value) {
    throw new Error("useTasks must be used inside TaskProvider");
  }
  return value;
}

function sortTasks(items: Task[]) {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.score - a.score || new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}
