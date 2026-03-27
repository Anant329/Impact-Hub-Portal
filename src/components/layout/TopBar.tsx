import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLanguage, Language } from "@/contexts/LanguageContext";

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/15 backdrop-blur-sm">
      <span className="text-xs text-muted-foreground/70 font-medium hidden sm:inline">{date}</span>
      <span className="w-px h-3.5 bg-white/15 hidden sm:block" />
      <span className="text-xs font-mono font-bold text-primary tabular-nums tracking-widest">
        {time}
      </span>
    </div>
  );
}

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLang = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 md:left-64 z-30 h-14 flex items-center justify-between px-4 sm:px-6 transition-all duration-300",
        scrolled
          ? "bg-background/60 backdrop-blur-xl border-b border-white/8 shadow-sm"
          : "bg-transparent"
      )}
    >
      {/* Left: hamburger on mobile */}
      <button
        onClick={onMenuToggle}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Empty spacer on desktop left */}
      <div className="hidden md:block" />

      {/* Right: clock + language */}
      <div className="flex items-center gap-3">
        <LiveClock />

        {/* Language Switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all border",
              langOpen
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
            )}
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{language === "en" ? "EN" : "हि"}</span>
          </button>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-40 bg-background/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
              >
                {(
                  [
                    { code: "en" as Language, label: "English" },
                    { code: "hi" as Language, label: "हिंदी" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => handleLang(opt.code)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-sm transition-all",
                      language === opt.code
                        ? "bg-primary/20 text-primary font-bold"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <span>{opt.label}</span>
                    {language === opt.code && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
