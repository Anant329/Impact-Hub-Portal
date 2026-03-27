import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Menu, X, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm shadow-[0_0_12px_rgba(0,255,255,0.08)]">
      <span className="text-xs text-muted-foreground font-medium">{date}</span>
      <span className="w-px h-3.5 bg-white/15" />
      <span className="text-xs font-mono font-bold text-primary tabular-nums tracking-widest">
        {time}
      </span>
    </div>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const langRef = useRef<HTMLDivElement>(null);

  const NAV_LINKS = [
    { href: "/", label: t.nav.home },
    { href: "/community-solver", label: t.nav.communitySolver },
    { href: "/lost-found", label: t.nav.lostFound },
    { href: "/career-compass", label: t.nav.careerCompass },
    { href: "/about", label: t.nav.about },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLang = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-white/5 shadow-lg"
          : "bg-transparent py-2"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 text-primary group-hover:neon-border-blue"
            >
              <Hexagon className="w-6 h-6 fill-primary/20" />
            </motion.div>
            <span className="font-display font-bold text-xl tracking-wider text-foreground group-hover:neon-text-blue transition-all">
              IMPACT<span className="text-primary">HUB</span>
            </span>
          </Link>

          {/* Live Clock — centre */}
          <LiveClock />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-lg",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Language Toggle + Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
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
                        { code: "en" as Language, label: "English", sub: "English" },
                        { code: "hi" as Language, label: "हिंदी", sub: "Hindi" },
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
                        {language === opt.code && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-white/5"
      >
        <div className="px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-xl text-base font-medium transition-all",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </header>
  );
}
