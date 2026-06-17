# AI 轻重缓急日程助手

一个基于 React Native + Expo 的手机端 App Demo，面向学生、比赛、项目、作业、面试等场景，提供 AI 待办提醒、轻重缓急排序、图片导入任务和今日规划。

## 技术栈

- React Native + Expo
- TypeScript
- Expo Router 底部 Tab 导航
- AsyncStorage 本地存储
- expo-notifications 本地通知
- expo-image-picker 拍照和相册导入
- OCR Mock + OpenAI 接口预留
- AI 优先级本地规则算法 + OpenAI 接口预留

## 运行

```bash
npm install
npx expo start
```

然后使用 Expo Go 扫码，或在模拟器中打开。

## 功能

- 首页任务看板：按 AI 评分排序，展示今日数量、3 天内高优先级数量、最近截止任务和 AI 今日建议。
- 添加任务：支持标题、描述、截止时间、类型、重要程度、预计耗时、提醒和备注。
- AI 轻重缓急分析：`analyzeTaskPriority(task)` 使用本地规则输出优先级、四象限、建议和分数。
- 本地通知：创建任务后按优先级或用户选择的提前时间安排提醒。
- 图片导入：支持拍照或相册选择，未配置 API Key 时使用 Mock OCR。
- 文本提取任务：`extractTasksFromText(text)` 能识别明天、后天、周一到周日、x月x日、提交、截止、完成、修改、比赛、面试、作业、项目等关键词。
- 确认页：图片识别后的候选任务可编辑标题、日期、类型、重要程度，并选择是否加入。
- AI 规划：按高优先级、截止时间和预计耗时生成上午、下午、晚上计划。
- 设置：本地保存 API Key、真实 AI 开关、默认提醒时间，并支持清空任务。

## 真实 AI/OCR 接口

设置页填写 API Key 并启用真实 AI 后：

- 优先级分析会调用 `src/services/priority.ts` 中的 `analyzeTaskPriorityWithAI`。
- 图片 OCR 会调用 `src/services/ocr.ts` 中的 `recognizeImageText`。

如果接口失败或未配置 API Key，App 会自动回退到本地规则和 Mock OCR，确保 Demo 可跑。

## 目录结构

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    add.tsx
    import.tsx
    planner.tsx
    settings.tsx
  confirm-import.tsx
src/
  components/
  constants/
  context/
  services/
  types/
  utils/
```
