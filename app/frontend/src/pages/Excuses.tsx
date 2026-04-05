import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { translations } from "@/lib/i18n";
import { generateExcuse, parseJSON } from "@/lib/ai-service";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, Loader2, Sun, Moon, Globe,
  Sparkles, AlertTriangle, Lightbulb, RotateCcw,
} from "lucide-react";

const HERO_IMG = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/3e132e9f-1e9d-4d1e-8737-e1a595e9bb29.png";

const styleOptions = ["convincing", "funny", "creative"] as const;
const styleEmojis = ["🎯", "😂", "🎨"];

export default function ExcusesPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, lang, toggleLang } = useApp();
  const t = translations[lang];
  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  const [situation, setSituation] = useState("");
  const [style, setStyle] = useState<string>("convincing");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const styleLabels: Record<string, string> = {
    convincing: t.excuseStyleConvincing,
    funny: t.excuseStyleFunny,
    creative: t.excuseStyleCreative,
  };

  const handleGenerate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await generateExcuse(situation, style, lang);
      const parsed = parseJSON(res);
      setResult(parsed);
    } catch {
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const getConvincingColor = (level: number) => {
    if (level >= 80) return "from-emerald-500 to-green-500";
    if (level >= 50) return "from-amber-500 to-yellow-500";
    return "from-red-500 to-orange-500";
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-15 dark:opacity-30"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-orange-50/90 via-white/80 to-red-50/90 dark:from-[#0F0F23]/95 dark:via-[#0F0F23]/90 dark:to-[#1A1A3E]/95" />

      <div className="relative z-10">
        <nav className="flex items-center justify-between p-4 md:p-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
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

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              {t.excusesTitle}
            </h1>
            <p className="text-muted-foreground">{t.excusesDesc}</p>
          </div>

          {!result && (
            <div className="animate-fade-in-up max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-20" />
                <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder={t.excuseSituation}
                    rows={3}
                    className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-0 resize-none focus:ring-2 focus:ring-orange-500 transition-all text-base mb-4"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  />

                  <p className="text-sm font-semibold mb-3">{t.excuseStyle}</p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {styleOptions.map((s, i) => (
                      <button
                        key={s}
                        onClick={() => setStyle(s)}
                        className={`p-3 rounded-xl text-center transition-all border-2 ${
                          style === s
                            ? "border-orange-500 bg-orange-500/10 scale-105"
                            : "border-transparent bg-gray-100 dark:bg-gray-800/50 hover:border-orange-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{styleEmojis[i]}</div>
                        <p className="text-xs font-medium">{styleLabels[s]}</p>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!situation.trim() || loading}
                    className="w-full py-4 text-base font-bold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.generating}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t.generateExcuse}
                      </span>
                    )}
                  </Button>
                  {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            </div>
          )}

          {result && result.excuses && (
            <div className="space-y-4 animate-fade-in-up">
              {result.excuses.map((exc: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-20" />
                  <div className="relative bg-white/90 dark:bg-[#1A1A3E]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎭</span>
                      <h3 className="font-bold text-lg">{t.excuseResult} #{i + 1}</h3>
                    </div>
                    <p className="text-base leading-relaxed mb-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                      {exc.excuse}
                    </p>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="font-medium">{t.convincingLevel}</span>
                        <span className="font-bold">{exc.convincingLevel}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getConvincingColor(exc.convincingLevel)} transition-all duration-1000`}
                          style={{ width: `${exc.convincingLevel}%` }}
                        />
                      </div>
                    </div>

                    {exc.deliveryTip && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-2">
                        <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm"><strong>{t.howToDeliver}:</strong> {exc.deliveryTip}</p>
                      </div>
                    )}

                    {exc.warning && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm"><strong>{t.warningNote}:</strong> {exc.warning}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="text-center mt-6">
                <Button
                  onClick={() => { setResult(null); setSituation(""); }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
                >
                  <RotateCcw className="w-4 h-4 me-2" />
                  {t.tryAgain}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}