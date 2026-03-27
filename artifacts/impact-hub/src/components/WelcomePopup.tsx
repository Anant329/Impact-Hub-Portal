import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => setIsVisible(false);

  const isHindi = language === "hi";

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleEnter}
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="relative w-full max-w-sm bg-card/80 backdrop-blur-2xl border-2 border-primary/30 rounded-3xl p-10 shadow-[0_0_60px_rgba(0,255,255,0.18)] overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-primary/25 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-secondary/25 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15, stiffness: 300, damping: 20 }}
                className="w-20 h-20 bg-primary/10 border-2 border-primary/30 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(0,255,255,0.2)]"
              >
                <span className="text-4xl select-none">🙏</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary leading-tight"
              >
                {isHindi ? "नमस्ते" : "Welcome"}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="text-muted-foreground text-base leading-relaxed"
              >
                {isHindi
                  ? "नगर पालिका परिषद सुलतानपुर आपका स्वागत करता है"
                  : "Impact Hub — your community's digital portal for grievances, lost items, and career guidance."}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEnter}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg bg-primary text-primary-foreground shadow-[0_0_24px_rgba(0,255,255,0.35)] hover:shadow-[0_0_36px_rgba(0,255,255,0.55)] transition-shadow"
              >
                <Sparkles className="w-5 h-5" />
                {isHindi ? "पोर्टल में प्रवेश करें" : "Enter Portal"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
