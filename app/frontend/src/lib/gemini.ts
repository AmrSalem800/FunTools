const API_KEY = "AIzaSyAamRznystvvPQly9RIYhUIjdY2QyMAZJE";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

async function callGemini(prompt: string, retries = 2): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.95,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        console.error(`Gemini API error (attempt ${attempt + 1}):`, response.status, errorBody);
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error("Empty Gemini response:", JSON.stringify(data));
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        throw new Error("No response from Gemini");
      }
      return text;
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed after retries");
}

export async function getHistoricalEvents(
  day: number,
  month: number,
  year: number | null,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction =
    lang === "ar"
      ? "أجب باللغة العربية فقط."
      : "Answer in English only.";

  const hasYear = year !== null && year > 0;

  const prompt =
    lang === "ar"
      ? `${langInstruction}
أنت مؤرخ خبير. ${
          hasYear
            ? `أخبرني بأهم 4-5 أحداث تاريخية وقعت في يوم ${day} من شهر ${month} من سنة ${year} أو قريباً من هذا التاريخ.`
            : `أخبرني بأهم 4-5 أحداث تاريخية وقعت في يوم ${day} من شهر ${month} (أي شهر ${month} في التقويم الميلادي). يمكن أن تكون الأحداث من أي سنة في التاريخ.`
        }

أجب بصيغة JSON فقط بدون أي نص إضافي، بالشكل التالي:
{
  "events": [
    {
      "year": "السنة",
      "title": "عنوان الحدث",
      "description": "وصف مختصر للحدث في 2-3 جمل"
    }
  ]
}`
      : `${langInstruction}
You are an expert historian. ${
          hasYear
            ? `Tell me the most important 4-5 historical events that happened on ${month}/${day}/${year} or around that date.`
            : `Tell me the most important 4-5 historical events that happened on ${month}/${day} (any year in history).`
        }

Answer in JSON format only without any extra text:
{
  "events": [
    {
      "year": "the year",
      "title": "Event title",
      "description": "Brief description in 2-3 sentences"
    }
  ]
}`;

  const text = await callGemini(prompt);
  return text;
}

export async function getInterviewQuestion(
  field: string,
  level: string,
  questionNumber: number,
  previousQA: Array<{ question: string; answer: string }>,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction =
    lang === "ar"
      ? "أجب باللغة العربية فقط."
      : "Answer in English only.";

  const prevContext =
    previousQA.length > 0
      ? previousQA
          .map(
            (qa, i) =>
              `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`
          )
          .join("\n\n")
      : "No previous questions.";

  const prompt =
    lang === "ar"
      ? `${langInstruction}
أنت مدير توظيف خبير في مجال "${field}" تجري مقابلة وظيفية لمرشح بمستوى "${level}".
هذا هو السؤال رقم ${questionNumber} من 5.

الأسئلة والإجابات السابقة:
${prevContext}

اطرح سؤال مقابلة واقعي ومناسب للمستوى. السؤال يجب أن يكون مختلفاً عن الأسئلة السابقة.

أجب بصيغة JSON فقط:
{
  "question": "نص السؤال"
}`
      : `${langInstruction}
You are an expert hiring manager in "${field}" conducting a job interview for a "${level}" candidate.
This is question ${questionNumber} of 5.

Previous Q&A:
${prevContext}

Ask a realistic interview question appropriate for the level. The question must be different from previous ones.

Answer in JSON format only:
{
  "question": "question text"
}`;

  const text = await callGemini(prompt);
  return text;
}

export async function evaluateAnswer(
  field: string,
  level: string,
  question: string,
  answer: string,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction =
    lang === "ar"
      ? "أجب باللغة العربية فقط."
      : "Answer in English only.";

  const prompt =
    lang === "ar"
      ? `${langInstruction}
أنت مدير توظيف خبير في مجال "${field}". قيّم إجابة المرشح (مستوى: ${level}).

السؤال: ${question}
الإجابة: ${answer}

قيّم الإجابة وأعطِ:
1. تقييم (excellent أو good أو needsImprovement)
2. نقاط القوة في الإجابة
3. نقاط الضعف
4. نصيحة للتحسين
5. درجة من 100

أجب بصيغة JSON فقط:
{
  "rating": "excellent أو good أو needsImprovement",
  "score": 85,
  "feedback": "تعليق مختصر على الإجابة",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف 1"],
  "tip": "نصيحة للتحسين"
}`
      : `${langInstruction}
You are an expert hiring manager in "${field}". Evaluate the candidate's answer (level: ${level}).

Question: ${question}
Answer: ${answer}

Evaluate and provide:
1. Rating (excellent, good, or needsImprovement)
2. Strengths
3. Weaknesses
4. Improvement tip
5. Score out of 100

Answer in JSON format only:
{
  "rating": "excellent or good or needsImprovement",
  "score": 85,
  "feedback": "Brief comment on the answer",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1"],
  "tip": "Improvement tip"
}`;

  const text = await callGemini(prompt);
  return text;
}

export async function getFinalReport(
  field: string,
  level: string,
  questionsAndEvals: Array<{
    question: string;
    answer: string;
    score: number;
    rating: string;
  }>,
  lang: "ar" | "en"
): Promise<string> {
  const langInstruction =
    lang === "ar"
      ? "أجب باللغة العربية فقط."
      : "Answer in English only.";

  const summary = questionsAndEvals
    .map(
      (qe, i) =>
        `Q${i + 1}: ${qe.question}\nAnswer: ${qe.answer}\nScore: ${qe.score}/100\nRating: ${qe.rating}`
    )
    .join("\n\n");

  const prompt =
    lang === "ar"
      ? `${langInstruction}
أنت مدير توظيف خبير. اكتب تقريراً نهائياً شاملاً عن أداء المرشح في مقابلة "${field}" (مستوى: ${level}).

ملخص الأسئلة والتقييمات:
${summary}

أجب بصيغة JSON فقط:
{
  "overallScore": 78,
  "overallRating": "good",
  "summary": "ملخص عام للأداء",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3"]
}`
      : `${langInstruction}
You are an expert hiring manager. Write a comprehensive final report on the candidate's performance in a "${field}" interview (level: ${level}).

Q&A Summary:
${summary}

Answer in JSON format only:
{
  "overallScore": 78,
  "overallRating": "good",
  "summary": "Overall performance summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "tips": ["tip 1", "tip 2", "tip 3"]
}`;

  const text = await callGemini(prompt);
  return text;
}

export function parseJSON(text: string): any {
  // Try multiple strategies to extract JSON
  // 1. Extract from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim());
    } catch {
      // continue to next strategy
    }
  }

  // 2. Try parsing the whole text directly
  try {
    return JSON.parse(text.trim());
  } catch {
    // continue to next strategy
  }

  // 3. Find JSON object pattern in text
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      // continue to next strategy
    }
  }

  // 4. Find JSON array pattern in text
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {
      // fall through
    }
  }

  throw new Error("Could not parse JSON from response");
}