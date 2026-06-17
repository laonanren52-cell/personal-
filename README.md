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
npm run dev
```

然后使用 Expo Go 扫码，或在模拟器中打开。

## 部署到腾讯云网页

这个项目是 Expo Router / React Native Web 项目，不是 Vite 项目。源码目录里不会有根级 `index.html`，`index.html` 会在构建后生成到 `dist/`。

不能直接把源码目录上传成网页。需要先构建 Web 静态文件：

```bash
npm install
npm run build
```

构建完成后会生成 `dist/` 目录。腾讯云静态网站、COS 静态托管、CloudBase 静态托管或 Nginx 都应该部署 `dist/` 目录里的内容，而不是部署项目根目录。

### 一键检查并修复腾讯云服务器

在腾讯云服务器上执行：

```bash
curl -fsSL https://raw.githubusercontent.com/laonanren52-cell/personal-/main/deploy/tencent-cloud-fix.sh -o tencent-cloud-fix.sh
chmod +x tencent-cloud-fix.sh
./tencent-cloud-fix.sh
```

如果项目实际目录不是 `/var/www/personal-`，用 `APP_DIR` 指定真实路径：

```bash
APP_DIR=/你的真实项目路径 ./tencent-cloud-fix.sh
```

脚本会自动检查 `pwd`、`ls -la`、`package.json`、`dist/index.html`，必要时执行 `npm install` 和 `npm run build`，并把 Nginx `root` 写到真实的 `dist` 绝对路径，然后执行 `sudo nginx -t`、`sudo systemctl reload nginx`、`curl -I http://127.0.0.1`。

### 方式一：用 serve 快速部署

适合先验证公网能否打开：

```bash
git clone https://github.com/laonanren52-cell/personal-.git
cd personal-
npm install
npm run build
npm run preview
```

`npm run preview` 会监听 `0.0.0.0:3000`，不是只监听 `localhost`。腾讯云安全组需要放行 TCP `3000`，然后访问：

```text
http://你的公网IP:3000
```

如需后台运行：

```bash
npm install -g pm2
pm2 start "npm run preview" --name personal-ai-schedule
pm2 save
```

### 方式二：用 Nginx 部署到 80 端口

推荐生产环境使用：

```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/laonanren52-cell/personal-.git
cd personal-
sudo npm install
sudo npm run build
```

Nginx 配置可直接使用仓库中的 `deploy/tencent-nginx.conf`：

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/personal-/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|ttf|woff|woff2)$ {
        try_files $uri =404;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

启用 Nginx 配置：

```bash
sudo cp /var/www/personal-/deploy/tencent-nginx.conf /etc/nginx/conf.d/personal-.conf
sudo nginx -t
sudo systemctl reload nginx
```

腾讯云安全组需要放行 TCP `80`。如果配置 HTTPS，还需要放行 TCP `443`。

常见打不开原因：

- 上传了源码目录，没有上传 `dist/`。
- 服务器只运行了 `npm install`，但没有执行 `npm run build`。
- Nginx `root` 指到了项目根目录，而不是 `dist`。
- 直接访问二级路由时没有 `try_files ... /index.html`，导致刷新或打开子页面 404。
- 用 `serve` 时只监听了 `localhost`，公网访问不到。本项目的 `npm run preview` 已配置为 `0.0.0.0:3000`。
- 腾讯云安全组或服务器防火墙没有开放 `80`、`443`、`3000`、`5173` 等实际使用端口。生产建议只开放 `80/443`。

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
