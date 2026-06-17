import { Task } from "@/types/task";

export type PlanSection = {
  slot: "上午" | "下午" | "晚上";
  items: string[];
};

export function generateTodayPlan(tasks: Task[]): PlanSection[] {
  const active = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => b.score - a.score || new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  active.slice(0, 8).forEach((task, index) => {
    const text = buildPlanText(task);
    if (task.priorityLevel === "high" && morning.length < 2) {
      morning.push(text);
      return;
    }
    if ((task.estimatedHours ?? 1) >= 3 && afternoon.length < 3) {
      afternoon.push(text);
      return;
    }
    if (index % 3 === 0 && morning.length < 3) {
      morning.push(text);
    } else if (index % 3 === 1 && afternoon.length < 3) {
      afternoon.push(text);
    } else {
      evening.push(text);
    }
  });

  if (!morning.length) {
    morning.push("整理今日任务，先确认最接近截止的事项。");
  }
  if (!afternoon.length) {
    afternoon.push("安排一段 45 分钟深度工作，推进重要但不紧急任务。");
  }
  if (!evening.length) {
    evening.push("复盘完成情况，补齐明天需要的资料和提醒。");
  }

  return [
    { slot: "上午", items: morning },
    { slot: "下午", items: afternoon },
    { slot: "晚上", items: evening }
  ];
}

function buildPlanText(task: Task) {
  const hours = task.estimatedHours ?? 1;
  if (hours >= 4) {
    return `${task.title}：先拆出 2 个阶段，今天完成核心交付物。`;
  }
  if (task.priorityLevel === "high") {
    return `${task.title}：优先处理，至少完成可提交版本。`;
  }
  if (task.quadrant === "重要但不紧急") {
    return `${task.title}：先收集资料并列出执行清单。`;
  }
  return `${task.title}：用短时段推进，避免拖到截止前。`;
}
