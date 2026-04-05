import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { translations } from "@/lib/i18n";
import { Sun, Moon, Globe, Clock, Users, Sparkles, ChevronRight, Brain, Palette, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_TIME_MACHINE = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/74ee0509-a106-47c4-8fc6-5a9d4013f4f6.png";
const HERO_INTERVIEW = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/6f46a3f1-00c5-4cbd-baf4-963c30c32181.png";
const HERO_EXCUSES = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/3e132e9f-1e9d-4d1e-8737-e1a595e9bb29.png";
const HERO_PERSONALITY = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/a681fb68-443b-491c-b64c-a3fd127ae317.png";
const HERO_CREATIVE = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/b8660f24-ae22-450e-a3ad-7bbd7f38b387.png";
const PARTICLES_BG = "https://mgx-backend-cdn.metadl.com/generate/images/552332/2026-04-03/8c04603d-51a7-4b06-aa88-86b917718025.png";

interface FeatureCard {
  title: string;
  desc: string;
  button: string;
  path: string;
  image: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, lang, toggleLang } = useApp();
  const t = translations[lang];

  const features: FeatureCard[] = [
    {
      title: t.timeMachineTitle,
      desc: t.timeMachineDesc,
      button: t.timeMachineButton,
      path: "/time-machine",
      image: HERO_TIME_MACHINE,
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      iconBg: "bg-amber-500/20",
    },
    {
      title: t.interviewTitle,
      desc: t.interviewDesc,
      button: t.interviewButton,
      path: "/interview",
      image: HERO_INTERVIEW,
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      iconBg: "bg-indigo-500/20",
    },
    {
      title: t.excusesTitle,
      desc: t.excusesDesc,
      button: t.excusesButton,
      path: "/excuses",
      image: HERO_EXCUSES,
      icon: <MessageSquare className="w-6 h-6 text-orange-400" />,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      iconBg: "bg-orange-500/20",
    },
    {
      title: t.personalityTitle,
      desc: t.personalityDesc,
      button: t.personalityButton,
      path: "/personality",
      image: HERO_PERSONALITY,
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      iconBg: "bg-purple-500/20",
    },
    {
      title: t.creativeToolsTitle,
      desc: t.creativeToolsDesc,
      button: t.creativeToolsButton,
      path: "/creative-tools",
      image: HERO_CREATIVE,
      icon: <Palette className="w-6 h-6 text-teal-400" />,
      gradient: "from-teal-500 via-emerald-500 to-green-500",
      iconBg: "bg-teal-500/20",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-30 dark:opacity-50 transition-opacity duration-500"
        style={{ backgroundImage: `url(${PARTICLES_BG})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/90 via-white/80 to-purple-50/90 dark:from-[#0F0F23]/95 dark:via-[#0F0F23]/90 dark:to-[#1A1A3E]/95 transition-colors duration-500" />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"][
                  Math.floor(Math.random() * 5)
                ]
              }, transparent)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t.appName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLang}
              className="rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
              title={t.language}
            >
              <Globe className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
              title={theme === "dark" ? t.lightMode : t.darkMode}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-4 pt-8 md:pt-14 pb-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4 leading-tight">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                {t.heroTitle}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-center text-muted-foreground max-w-2xl mx-auto mb-10">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl w-full px-4">
            {features.map((feature, idx) => (
              <div
                key={feature.path}
                className="group relative cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => navigate(feature.path)}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-50 transition-opacity duration-500`} />
                <div className="relative bg-white/80 dark:bg-[#1A1A3E]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl h-full">
                  <div className="relative h-36 md:h-40 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 start-3">
                      <div className={`p-2 rounded-full ${feature.iconBg} backdrop-blur-sm`}>
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg md:text-xl font-bold mb-1.5 transition-colors line-clamp-1">
                      {feature.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {feature.desc}
                    </p>
                    <div className={`flex items-center gap-2 font-semibold text-sm bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      <span>{feature.button}</span>
                      <ChevronRight className="w-4 h-4 text-current transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>
            {lang === "ar" ? "صُنع بـ ❤️ بواسطة الذكاء الاصطناعي" : "Made with ❤️ by AI"}
          </p>
        </footer>
      </div>
    </div>
  );
}