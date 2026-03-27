import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert, Search, Compass, Activity, CheckCircle, Users } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Home() {
  const { t } = useLanguage();
  const h = t.home;

  return (
    <PageWrapper className="flex flex-col gap-12 lg:gap-16">
      {/* Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden glass-card min-h-[400px] flex items-center p-8 md:p-16">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-cyber-bg.png`}
            alt="Cyberpunk grid background"
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <motion.div initial="hidden" animate="show" variants={container}>
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6"
            >
              <Activity className="w-4 h-4" />
              <span>{h.badge}</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-tight mb-6"
            >
              {h.heroTitle} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text-blue">
                Impact Hub
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              {h.heroSubtitle}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Link
                href="/community-solver"
                className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all hover:-translate-y-1 inline-flex items-center gap-2"
              >
                {h.reportIssue} <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { icon: CheckCircle, value: "500+", label: h.stats.grievances, color: "text-primary", bg: "bg-primary/10" },
          { icon: Search, value: "200+", label: h.stats.items, color: "text-secondary", bg: "bg-secondary/10" },
          { icon: Users, value: "1,000+", label: h.stats.students, color: "text-accent", bg: "bg-accent/10" },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center border border-white/5`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Bento Grid Features */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-display font-bold">{h.coreModules}</h2>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(300px,auto)] gap-6"
        >
          {/* Card 1 - Community Solver */}
          <motion.div
            variants={item}
            className="md:col-span-2 group relative rounded-3xl overflow-hidden glass-card p-8 flex flex-col justify-end"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={`${import.meta.env.BASE_URL}images/bento-solver.png`}
                alt="Community Solver"
                className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                {h.solver.title}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">{h.solver.desc}</p>
              <Link
                href="/community-solver"
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
              >
                {h.solver.cta} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2 - Lost & Found */}
          <motion.div
            variants={item}
            className="md:col-span-1 group relative rounded-3xl overflow-hidden glass-card p-8 flex flex-col justify-end"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={`${import.meta.env.BASE_URL}images/bento-lost.png`}
                alt="Lost & Found"
                className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/50 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-secondary transition-colors">
                {h.lost.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">{h.lost.desc}</p>
              <Link
                href="/lost-found"
                className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-4 transition-all"
              >
                {h.lost.cta} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3 - Career Compass */}
          <motion.div
            variants={item}
            className="md:col-span-3 group relative rounded-3xl overflow-hidden glass-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-accent/20 hover:border-accent/50"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={`${import.meta.env.BASE_URL}images/bento-career.png`}
                alt="Career Compass"
                className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/50 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4 group-hover:text-accent transition-colors">
                {h.career.title}
              </h3>
              <p className="text-muted-foreground">{h.career.desc}</p>
            </div>
            <div className="relative z-10 shrink-0 w-full md:w-auto">
              <Link
                href="/career-compass"
                className="w-full md:w-auto px-8 py-4 rounded-xl font-bold bg-accent/20 text-accent border border-accent/50 hover:bg-accent hover:text-white shadow-[0_0_20px_rgba(var(--accent),0.2)] hover:shadow-[0_0_30px_rgba(var(--accent),0.5)] transition-all flex items-center justify-center gap-2"
              >
                {h.career.cta}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
