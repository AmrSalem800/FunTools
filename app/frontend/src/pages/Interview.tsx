import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { translations } from "@/lib/i18n";
import {
  getInterviewQuestion,
  evaluateAnswer,
  getFinalReport,
  parseJSON,
} from "@/lib/ai-service";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Send,
  Star,
  Trophy,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Home,
  Sun,
  Moon,
  Globe,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";

const PARTICLES_BG = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/8c04603d-51a7-4b06-aa88-86b917718025.png";

type Stage = "select" | "interview" | "report";

interface QAEntry {
  question: string;
  answer: string;
  score: number;
  rating: string;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  tip: string;
  modelAnswer: string;
}

const fieldKeys = [
  "programming",
  "marketing",
  "design",
  "management",
  "medicine",
  "engineering",
  "finance",
  "education",
] as const;

const fieldIcons = ["💻", "📈", "🎨", "📊", "🏥", "⚙️", "💰", "📚"];

const levelKeys = ["junior", "mid", "senior"] as const;
const levelIcons = ["🌱", "🌿", "🌳"];

export default function InterviewPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, lang, toggleLang } = useApp();
  const t = translations[lang];
  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  const [stage, setStage] = useState<Stage>("select");
  const [selectedField, setSelectedField] = useState("");
  const [selectedFieldKey, setSelectedFieldKey] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedLevelKey, setSelectedLevelKey] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [qaHistory, setQaHistory] = useState<QAEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  // Report state
  const [report, setReport] = useState<any>(null);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const [error, setError] = useState("");

  const startInterview = async () => {
    if (!selectedField || !selectedLevel) return;
    setLoading(true);
    setError("");
    try {
      const result = await getInterviewQuestion(
        selectedField,
        selectedLevel,
        1,
        [],
        lang
      );
      const parsed = parseJSON(result);
      if (!parsed.question) {
        throw new Error("No question in response");
      }
      setCurrentQuestion(parsed.question);
      setQuestionNumber(1);
      setStage("interview");
    } catch (err) {
      console.error("Interview start error:", err);
      setError(t.errorOccurred + ". " + t.tryAgainLater);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    setError("");
    setShowEvaluation(false);

    try {
      const evalResult = await evaluateAnswer(
        selectedField,
        selectedLevel,
        currentQuestion,
        userAnswer,
        lang
      );
      const parsed = parseJSON(evalResult);
      setEvaluationResult(parsed);
      setShowEvaluation(true);

      const newEntry: QAEntry = {
        question: currentQuestion,
        answer: userAnswer,
        score: parsed.score,
        rating: parsed.rating,
        feedback: parsed.feedback,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        tip: parsed.tip || "",
        modelAnswer: parsed.modelAnswer || "",
      };
      setQaHistory((prev) => [...prev, newEntry]);
    } catch {
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (questionNumber >= 5) {
      await generateReport();
      return;
    }

    setLoading(true);
    setError("");
    setShowEvaluation(false);
    setEvaluationResult(null);
    setUserAnswer("");

    try {
      const prevQA = qaHistory.map((qa) => ({
        question: qa.question,
        answer: qa.answer,
      }));
      const result = await getInterviewQuestion(
        selectedField,
        selectedLevel,
        questionNumber + 1,
        prevQA,
        lang
      );
      const parsed = parseJSON(result);
      setCurrentQuestion(parsed.question);
      setQuestionNumber((prev) => prev + 1);
    } catch {
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getFinalReport(
        selectedField,
        selectedLevel,
        qaHistory,
        lang
      );
      const parsed = parseJSON(result);
      setReport(parsed);
      setStage("report");
    } catch {
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStage("select");
    setSelectedField("");
    setSelectedFieldKey("");
    setSelectedLevel("");
    setSelectedLevelKey("");
    setCurrentQuestion("");
    setQuestionNumber(1);
    setUserAnswer("");
    setQaHistory([]);
    setEvaluationResult(null);
    setShowEvaluation(false);
    setReport(null);
    setError("");
  };

  const getRatingColor = (rating: string) => {
    if (rating === "excellent") return "text-emerald-500";
    if (rating === "good") return "text-amber-500";
    return "text-red-500";
  };

  const getRatingBg = (rating: string) => {
    if (rating === "excellent") return "bg-emerald-500/10 border-emerald-500/30";
    if (rating === "good") return "bg-amber-500/10 border-amber-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  const getRatingIcon = (rating: string) => {
    if (rating === "excellent") return <Star className="w-5 h-5 text-emerald-500" />;
    if (rating === "good") return <ThumbsUp className="w-5 h-5 text-amber-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  const getRatingLabel = (rating: string) => {
    const r = t.ratings as Record<string, string>;
    return r[rating] || rating;
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-20 dark:opacity-40"
        style={{ backgroundImage: `url(${PARTICLES_BG})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/90 via-white/80 to-purple-50/90 dark:from-[#0F0F23]/95 dark:via-[#0F0F23]/90 dark:to-[#1A1A3E]/95" />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between p-4 md:p-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <BackArrow className="w-4 h-4" />
            <span>{t.back}</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full">
              <Globe className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              {t.interviewTitle}
            </h1>
            <p className="text-muted-foreground">{t.interviewDesc}</p>
          </div>

          {/* STAGE: SELECT */}
          {stage === "select" && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Field Selection */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-center">{t.selectField}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {fieldKeys.map((key, i) => {
                    const fieldName = (t.fields as Record<string, string>)[key];
                    const isSelected = selectedFieldKey === key;
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setSelectedField(fieldName);
                          setSelectedFieldKey(key);
                        }}
                        className={`group cursor-pointer perspective-1000`}
                      >
                        <div
                          className={`relative p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20 scale-105 shadow-lg shadow-indigo-500/20"
                              : "border-transparent bg-white/60 dark:bg-[#1A1A3E]/60 hover:border-indigo-300 hover:scale-[1.03]"
                          } backdrop-blur-sm`}
                        >
                          <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                            {fieldIcons[i]}
                          </div>
                          <p className="text-sm font-semibold">{fieldName}</p>
                          {isSelected && (
                            <div className="absolute -top-2 -end-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Level Selection */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-center">{t.selectLevel}</h2>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {levelKeys.map((key, i) => {
                    const levelName = (t.levels as Record<string, string>)[key];
                    const isSelected = selectedLevelKey === key;
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setSelectedLevel(levelName);
                          setSelectedLevelKey(key);
                        }}
                        className={`cursor-pointer p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/10 dark:bg-purple-500/20 scale-105 shadow-lg shadow-purple-500/20"
                            : "border-transparent bg-white/60 dark:bg-[#1A1A3E]/60 hover:border-purple-300 hover:scale-[1.03]"
                        } backdrop-blur-sm`}
                      >
                        <div className="text-3xl mb-2">{levelIcons[i]}</div>
                        <p className="text-sm font-semibold">{levelName}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  onClick={startInterview}
                  disabled={!selectedField || !selectedLevel || loading}
                  className="px-10 py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.starting}
                    </span>
                  ) : (
                    t.startInterview
                  )}
                </Button>
                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
              </div>
            </div>
          )}

          {/* STAGE: INTERVIEW */}
          {stage === "interview" && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Progress */}
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                  <span>
                    {t.question} {questionNumber} {t.of} 5
                  </span>
                  <span>{Math.round((questionNumber / 5) * 100)}%</span>
                </div>
                <Progress value={(questionNumber / 5) * 100} className="h-3 rounded-full" />
              </div>

              {/* Question Card */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-20" />
                  <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 rounded-full bg-indigo-500/10 shrink-0">
                        <Star className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="text-lg md:text-xl font-semibold leading-relaxed">
                        {currentQuestion}
                      </p>
                    </div>

                    {/* Answer Input */}
                    {!showEvaluation && (
                      <div className="space-y-4">
                        <textarea
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder={t.yourAnswer}
                          rows={4}
                          className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-0 resize-none focus:ring-2 focus:ring-indigo-500 transition-all text-base"
                          dir={lang === "ar" ? "rtl" : "ltr"}
                        />
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={!userAnswer.trim() || loading}
                          className="w-full py-4 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {t.evaluating}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send className="w-4 h-4" />
                              {t.submitAnswer}
                            </span>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Evaluation Result */}
                    {showEvaluation && evaluationResult && (
                      <div className="space-y-4 animate-fade-in-up">
                        {/* Rating Badge */}
                        <div
                          className={`flex items-center gap-3 p-4 rounded-xl border ${getRatingBg(
                            evaluationResult.rating
                          )}`}
                        >
                          {getRatingIcon(evaluationResult.rating)}
                          <div>
                            <span className={`font-bold text-lg ${getRatingColor(evaluationResult.rating)}`}>
                              {getRatingLabel(evaluationResult.rating)} - {evaluationResult.score}/100
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">
                              {evaluationResult.feedback}
                            </p>
                          </div>
                        </div>

                        {/* Tip */}
                        {evaluationResult.tip && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-sm">{evaluationResult.tip}</p>
                          </div>
                        )}

                        {/* Model Answer */}
                        {evaluationResult.modelAnswer && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="w-5 h-5 text-emerald-500" />
                              <h4 className="font-bold text-emerald-600 dark:text-emerald-400">
                                {t.modelAnswer}
                              </h4>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                              {evaluationResult.modelAnswer}
                            </p>
                          </div>
                        )}

                        {/* Next / Finish Button */}
                        <Button
                          onClick={handleNextQuestion}
                          disabled={loading}
                          className="w-full py-4 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : questionNumber >= 5 ? (
                            t.finishInterview
                          ) : (
                            t.nextQuestion
                          )}
                        </Button>
                      </div>
                    )}

                    {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE: REPORT */}
          {stage === "report" && report && (
            <div className="space-y-6 animate-fade-in-up max-w-2xl mx-auto">
              {/* Overall Score */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30" />
                <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-white/10 text-center">
                  <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-bounce-slow" />
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.reportTitle}</h2>

                  {/* Score Circle */}
                  <div className="relative w-32 h-32 mx-auto my-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(report.overallScore / 100) * 264} 264`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366F1" />
                          <stop offset="50%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-black">{report.overallScore}</span>
                    </div>
                  </div>

                  <p className={`text-lg font-bold ${getRatingColor(report.overallRating)}`}>
                    {getRatingLabel(report.overallRating)}
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">{report.summary}</p>
                </div>
              </div>

              {/* Strengths */}
              {report.strengths?.length > 0 && (
                <div className="bg-emerald-500/10 dark:bg-emerald-500/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    {t.strengths}
                  </h3>
                  <ul className="space-y-2">
                    {report.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {report.weaknesses?.length > 0 && (
                <div className="bg-red-500/10 dark:bg-red-500/5 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="w-5 h-5" />
                    {t.weaknesses}
                  </h3>
                  <ul className="space-y-2">
                    {report.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-red-500 mt-1">✗</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              {report.tips?.length > 0 && (
                <div className="bg-blue-500/10 dark:bg-blue-500/5 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Lightbulb className="w-5 h-5" />
                    {t.tips}
                  </h3>
                  <ul className="space-y-2">
                    {report.tips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500 mt-1">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Question Review */}
              <div className="bg-white/60 dark:bg-[#1A1A3E]/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-white/10">
                <h3 className="font-bold text-lg mb-4">{t.questionReview}</h3>
                <div className="space-y-3">
                  {qaHistory.map((qa, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-start hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${getRatingBg(
                              qa.rating
                            )} ${getRatingColor(qa.rating)}`}
                          >
                            {qa.score}
                          </span>
                          <span className="text-sm font-medium line-clamp-1">
                            {t.question} {i + 1}: {qa.question}
                          </span>
                        </div>
                        {expandedQ === i ? (
                          <ChevronUp className="w-4 h-4 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 shrink-0" />
                        )}
                      </button>
                      {expandedQ === i && (
                        <div className="p-4 pt-0 space-y-3 animate-fade-in-up">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              {t.yourAnswerLabel}:
                            </p>
                            <p className="text-sm bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                              {qa.answer}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              {t.aiEvaluation}:
                            </p>
                            <p className="text-sm">{qa.feedback}</p>
                          </div>
                          {/* Model Answer in Report Review */}
                          {qa.modelAnswer && (
                            <div className="mt-2 p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-emerald-500" />
                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                  {t.modelAnswer}:
                                </p>
                              </div>
                              <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                                {qa.modelAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleReset}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold"
                >
                  <RotateCcw className="w-4 h-4 me-2" />
                  {t.tryAgain}
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="px-8 py-3 rounded-xl font-bold"
                >
                  <Home className="w-4 h-4 me-2" />
                  {t.backToHome}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}