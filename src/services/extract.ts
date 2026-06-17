import { ImportTaskDraft, TaskCategory } from "@/types/task";
import { addDays, toInputDateTime } from "@/utils/date";

const weekdayMap: Record<string, number> = {
  周日: 0,
  星期日: 0,
  周一: 1,
  星期一: 1,
  周二: 2,
  星期二: 2,
  周三: 3,
  星期三: 3,
  周四: 4,
  星期四: 4,
  周五: 5,
  星期五: 5,
  周六: 6,
  星期六: 6
};

export function extractTasksFromText(text: string): ImportTaskDraft[] {
  const chunks = text
    .replace(/\r/g, "\n")
    .split(/[。；;，,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const candidates = chunks.filter((chunk) =>
    /(明天|后天|今天晚上|周[一二三四五六日]|星期[一二三四五六日]|[0-9一二三四五六七八九十]{1,2}月[0-9一二三四五六七八九十]{1,2}日|截止|提交|完成|修改|比赛|面试|作业|项目)/.test(
      chunk
    )
  );

  return candidates.map((chunk) => {
    const deadline = inferDeadline(chunk);
    return {
      title: normalizeTitle(chunk),
      description: `从图片文字识别：${chunk}`,
      deadline: deadline ? deadline.toISOString() : "",
      category: inferCategory(chunk),
      importance: inferImportance(chunk),
      estimatedHours: inferHours(chunk),
      reminderEnabled: true,
      reminderOffsets: [1, 0],
      selected: true
    };
  });
}

function normalizeTitle(text: string) {
  return text
    .replace(/^(请|需要|记得|要求)/, "")
    .replace(/(之前|前|截止)$/g, "")
    .trim()
    .slice(0, 36);
}

function inferCategory(text: string): TaskCategory {
  if (/比赛|竞赛|蓝桥杯|挑战杯|互联网\+/.test(text)) return "competition";
  if (/面试|简历|offer|笔试/.test(text)) return "interview";
  if (/作业|实验|论文|课程/.test(text)) return "homework";
  if (/项目|汇报|PPT|原型|需求/.test(text)) return "project";
  if (/生活|体检|缴费|快递/.test(text)) return "life";
  return "other";
}

function inferImportance(text: string) {
  if (/截止|提交|比赛|面试|答辩|必须|最终/.test(text)) return 5;
  if (/完成|修改|汇报|作业|项目/.test(text)) return 4;
  return 3;
}

function inferHours(text: string) {
  if (/PPT|汇报|比赛|项目|论文|面试/.test(text)) return 3;
  if (/修改|收集|整理/.test(text)) return 1.5;
  return 1;
}

function inferDeadline(text: string): Date | null {
  const now = new Date();
  const base = new Date(now);
  base.setSeconds(0, 0);

  if (/今天晚上/.test(text)) {
    base.setHours(20, 0, 0, 0);
    return base;
  }
  if (/明天/.test(text)) {
    const date = addDays(base, 1);
    date.setHours(/晚上/.test(text) ? 20 : 18, 0, 0, 0);
    return date;
  }
  if (/后天/.test(text)) {
    const date = addDays(base, 2);
    date.setHours(/晚上/.test(text) ? 20 : 18, 0, 0, 0);
    return date;
  }

  const weekdayKey = Object.keys(weekdayMap).find((key) => text.includes(key));
  if (weekdayKey) {
    const date = nextWeekday(weekdayMap[weekdayKey]);
    date.setHours(/晚上/.test(text) ? 20 : 18, 0, 0, 0);
    return date;
  }

  const monthDayMatch = text.match(/([0-9一二三四五六七八九十]{1,2})月([0-9一二三四五六七八九十]{1,2})日/);
  if (monthDayMatch) {
    const month = cnNumberToInt(monthDayMatch[1]);
    const day = cnNumberToInt(monthDayMatch[2]);
    if (month >= 1 && day >= 1) {
      const date = new Date(now.getFullYear(), month - 1, day, /晚上/.test(text) ? 20 : 18, 0, 0);
      if (date.getTime() < now.getTime()) {
        date.setFullYear(now.getFullYear() + 1);
      }
      return date;
    }
  }

  return null;
}

function nextWeekday(target: number) {
  const now = new Date();
  const date = new Date(now);
  const diff = (target + 7 - now.getDay()) % 7;
  date.setDate(now.getDate() + diff);
  return date;
}

function cnNumberToInt(value: string) {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }
  const map: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10
  };
  if (value === "十") return 10;
  if (value.startsWith("十")) return 10 + (map[value[1]] ?? 0);
  if (value.includes("十")) {
    const [ten, rest] = value.split("十");
    return (map[ten] ?? 1) * 10 + (map[rest] ?? 0);
  }
  return map[value] ?? 0;
}

export function draftDeadlineToText(value: string) {
  if (!value) return "";
  return toInputDateTime(new Date(value));
}
