import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hexagon, Home, ClipboardList, Search, Compass, Info, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const NAV_ITEMS = [
  { href: "/", icon: Home, enKey: "home" as const, hiLabel: "होम" },
  { href: "/community-solver", icon: ClipboardList, enKey: "communitySolver" as const, hiLabel: "सामुदायिक समाधान" },
  { href: "/lost-found", icon: Search, enKey: "lostFound" as const, hiLabel: "खोया और पाया" },
  { href: "/career-compass", icon: Compass, enKey: "careerCompass" as const, hiLabel: "करियर गाइड" },
  { href: "/about", icon: Info, enKey: "about" as const, hiLabel: "मेरे बारे में" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onClose }: { onClose: () => void }) {
  const [location] = useLocation();
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 text-primary"
          >
            <Hexagon className="w-5 h-5 fill-primary/20" />
          </motion.div>
          <span className="font-display font-bold text-lg tracking-wider text-foreground">
            IMPACT<span className="text-primary">HUB</span>
          </span>
        </Link>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, enKey, hiLabel }) => {
          const label = isHi ? hiLabel : t.nav[enKey];
          const isActive = location === href || (href !== "/" && location.startsWith(href));
          return (
            <Link key={href} href={href} onClick={onClose}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer relative",
                  isActive
                    ? "bg-primary/12 text-primary border border-primary/25 shadow-[inset_0_0_12px_rgba(0,255,255,0.06)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full shadow-[0_0_8px_rgba(0,255,255,0.6)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-4.5 h-4.5 shrink-0 w-[18px] h-[18px]", isActive ? "text-primary" : "")} />
                <span className={isHi ? "font-medium" : ""}>{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/8">
        <p className="text-[11px] text-muted-foreground/40 leading-relaxed text-center">
          {isHi ? "नगर पालिका परिषद सुलतानपुर" : "Nagar Palika Parishad Sultanpur"}
        </p>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-white/[0.04] backdrop-blur-md border-r border-white/8">
        <SidebarContent onClose={onClose} />
      </aside>

      {/* Mobile sidebar — slide in/out */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="sidebar-mobile"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="md:hidden fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-slate-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
