import { PriorityAnalysis, Task, TaskCategory, TaskDraft, TaskQuadrant } from "@/types/task";

const categoryWeights: Record<TaskCategory, number> = {
  competition: 18,
  interview: 17,
  project: 14,
  homework: 11,
  life: 5,
  other: 6
};

function getHoursUntil(deadline: string) {
  return (new Date(deadline).getTime() - Date.now()) / 36e5;
}

export function analyzeTaskPriority(task: Pick<TaskDraft, "deadline" | "category" | "importance" | "estimatedHours">): PriorityAnalysis {
  const hoursUntil = getHoursUntil(task.deadline);
  const overdue = hoursUntil < 0;
  const deadlineScore = overdue
    ? 70
    : hoursUntil <= 12
      ? 52
      : hoursUntil <= 24
        ? 44
        : hoursUntil <= 72
          ? 34
          : hoursUntil <= 168
            ? 20
            : 8;
  const importanceScore = Math.min(5, Math.max(1, task.importance)) * 10;
  const effortScore = Math.min(task.estimatedHours ?? 1, 12) * 1.7;
  const categoryScore = categoryWeights[task.category] ?? 6;
  const score = Math.round(deadlineScore + importanceScore + effortScore + categoryScore);

  const urgent = overdue || hoursUntil <= 72 || score >= 92;
  const important = task.importance >= 4 || ["competition", "interview", "project"].includes(task.category);

  let quadrant: TaskQuadrant = "普通事项";
  if (urgent && important) {
    quadrant = "紧急且重要";
  } else if (!urgent && important) {
    quadrant = "重要但不紧急";
  } else if (urgent && !important) {
    quadrant = "紧急但不重要";
  }

  const priorityLevel = overdue || score >= 92 ? "high" : score >= 68 ? "medium" : "low";
  const aiAdvice = buildAdvice({ overdue, hoursUntil, priorityLevel, quadrant, estimatedHours: task.estimatedHours });

  return {
    priorityLevel,
    quadrant,
    aiAdvice,
    score
  };
}

function buildAdvice({
  overdue,
  hoursUntil,
  priorityLevel,
  quadrant,
  estimatedHours
}: {
  overdue: boolean;
  hoursUntil: number;
  priorityLevel: PriorityAnalysis["priorityLevel"];
  quadrant: TaskQuadrant;
  estimatedHours?: number;
}) {
  if (overdue) {
    return "已逾期，先补交或联系相关负责人说明进度。";
  }
  if (priorityLevel === "high" && hoursUntil <= 24) {
    return "今天必须先做，至少完成可提交版本。";
  }
  if (priorityLevel === "high") {
    return estimatedHours && estimatedHours >= 4
      ? "建议拆成两段推进，今天先完成最核心部分。"
      : "今天优先处理，避免临近截止堆叠。";
  }
  if (quadrant === "重要但不紧急") {
    return "可以排进明后天，但今天先收集资料或列大纲。";
  }
  if (quadrant === "紧急但不重要") {
    return "尽快用短时间处理，避免占用深度工作时段。";
  }
  return "可以安排到低峰时段，保持跟进即可。";
}

export async function analyzeTaskPriorityWithAI(
  task: TaskDraft,
  apiKey: string
): Promise<PriorityAnalysis> {
  if (!apiKey.trim()) {
    return analyzeTaskPriority(task);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "你是日程优先级分析器。只输出 JSON: priorityLevel(high/medium/low), quadrant, aiAdvice, score。"
          },
          {
            role: "user",
            content: JSON.stringify(task)
          }
        ],
        temperature: 0.2
      })
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    if (parsed.priorityLevel && parsed.quadrant && parsed.aiAdvice && typeof parsed.score === "number") {
      return parsed as PriorityAnalysis;
    }
  } catch (error) {
    console.warn("AI priority fallback:", error);
  }

  return analyzeTaskPriority(task);
}

export function refreshTaskAnalysis(task: Task): Task {
  const analysis = analyzeTaskPriority(task);
  return {
    ...task,
    ...analysis,
    updatedAt: new Date().toISOString()
  };
}
