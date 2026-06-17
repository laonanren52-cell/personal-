export const mockOcrText =
  "周五前提交项目汇报 PPT，周三晚上完成初稿，周四找老师修改。下周一准备面试自我介绍，后天完成算法作业。";

export async function recognizeImageText({
  base64,
  apiKey,
  aiEnabled
}: {
  base64?: string | null;
  apiKey: string;
  aiEnabled: boolean;
}) {
  if (!aiEnabled || !apiKey.trim() || !base64) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return mockOcrText;
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
            role: "user",
            content: [
              {
                type: "text",
                text: "请识别图片中的中文任务、日期、截止要求。只返回识别出的原始文字，不要解释。"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ],
        temperature: 0.1
      })
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || mockOcrText;
  } catch (error) {
    console.warn("OCR fallback:", error);
    return mockOcrText;
  }
}
