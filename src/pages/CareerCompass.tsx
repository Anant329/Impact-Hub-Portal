import { PageWrapper } from "@/components/layout/PageWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, BookOpen, Calculator, Palette, ArrowRight, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const QUESTIONS = [
  {
    id: 1,
    text: "When faced with a new problem, you usually prefer to:",
    options: [
      { text: "Analyze the facts and look for logical patterns.", stream: "science" },
      { text: "Understand the financial or organizational impact.", stream: "commerce" },
      { text: "Brainstorm creative and out-of-the-box solutions.", stream: "arts" },
    ],
  },
  {
    id: 2,
    text: "Which of these activities sounds most appealing to you?",
    options: [
      { text: "Building a robot or writing a computer program.", stream: "science" },
      { text: "Managing a budget or starting a small business.", stream: "commerce" },
      { text: "Writing a story, painting, or studying history.", stream: "arts" },
    ],
  },
  {
    id: 3,
    text: "What subjects do you find yourself drawn to most naturally?",
    options: [
      { text: "Physics, Chemistry, or advanced Mathematics.", stream: "science" },
      { text: "Economics, Accountancy, or Business Studies.", stream: "commerce" },
      { text: "Literature, Psychology, or Fine Arts.", stream: "arts" },
    ],
  },
  {
    id: 4,
    text: "How do you prefer to express your ideas?",
    options: [
      { text: "Through formulas, data, and technical diagrams.", stream: "science" },
      { text: "Through presentations, spreadsheets, and strategy documents.", stream: "commerce" },
      { text: "Through essays, debates, visual art, or performance.", stream: "arts" },
    ],
  },
  {
    id: 5,
    text: "If you could pick an ideal future workplace, it would be:",
    options: [
      { text: "A research lab, tech company, or hospital.", stream: "science" },
      { text: "A corporate office, bank, or startup hub.", stream: "commerce" },
      { text: "A design studio, publishing house, or NGO.", stream: "arts" },
    ],
  },
];

const STREAM_ICONS = {
  science: BookOpen,
  commerce: Calculator,
  arts: Palette,
};

const STREAM_STYLES = {
  science: { color: "text-primary", bg: "bg-primary/20", border: "border-primary/50" },
  commerce: { color: "text-secondary", bg: "bg-secondary/20", border: "border-secondary/50" },
  arts: { color: "text-accent", bg: "bg-accent/20", border: "border-accent/50" },
};

type StreamKey = "science" | "commerce" | "arts";

export default function CareerCompass() {
  const { t } = useLanguage();
  const c = t.career;

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ science: 0, commerce: 0, arts: 0 });
  const [result, setResult] = useState<StreamKey | null>(null);

  const handleAnswer = (stream: string) => {
    const newScores = { ...scores, [stream]: scores[stream as StreamKey] + 1 };
    setScores(newScores);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const maxScore = Math.max(newScores.science, newScores.commerce, newScores.arts);
      const winningStream = (Object.keys(newScores) as StreamKey[]).find(
        (key) => newScores[key] === maxScore
      ) || "science";
      setResult(winningStream);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScores({ science: 0, commerce: 0, arts: 0 });
    setResult(null);
  };

  const streamEntries: [StreamKey, typeof c.streams.science][] = [
    ["science", c.streams.science],
    ["commerce", c.streams.commerce],
    ["arts", c.streams.arts],
  ];

  return (
    <PageWrapper className="flex flex-col gap-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 neon-text-purple text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
          {c.title}
        </h1>
        <p className="text-muted-foreground text-lg">{c.subtitle}</p>
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {!quizStarted && !result && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {streamEntries.map(([key, info]) => {
                  const Icon = STREAM_ICONS[key];
                  const style = STREAM_STYLES[key];
                  return (
                    <div
                      key={key}
                      className="glass-card rounded-3xl p-8 flex flex-col items-start hover:-translate-y-2 transition-transform duration-300"
                    >
                      <div className={`w-12 h-12 rounded-xl ${style.bg} ${style.border} border flex items-center justify-center mb-6`}>
                        <Icon className={`w-6 h-6 ${style.color}`} />
                      </div>
                      <h3 className="text-2xl font-display font-bold mb-3">{info.title}</h3>
                      <p className="text-muted-foreground mb-6 flex-1">{info.desc}</p>
                      <div className="w-full">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          {info.subjects}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="glass-card w-full max-w-2xl rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent pointer-events-none" />
                <h3 className="text-3xl font-display font-bold mb-4 relative z-10">{c.quiz.title}</h3>
                <p className="text-muted-foreground mb-8 relative z-10">{c.quiz.subtitle}</p>
                <button
                  onClick={() => setQuizStarted(true)}
                  className="px-8 py-4 rounded-xl font-bold bg-accent text-white hover:bg-accent/90 shadow-[0_0_20px_rgba(var(--accent),0.4)] transition-all inline-flex items-center gap-2 relative z-10"
                >
                  {c.quiz.submit} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {quizStarted && !result && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto w-full"
            >
              <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-1 bg-accent transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                />

                <div className="mb-8">
                  <div className="text-accent font-bold tracking-wider uppercase text-sm mb-2">
                    Question {currentQuestion + 1} of {QUESTIONS.length}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold leading-snug">
                    {QUESTIONS[currentQuestion].text}
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {QUESTIONS[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option.stream)}
                      className="text-left w-full p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all font-medium text-lg group"
                    >
                      <span className="inline-block w-8 h-8 rounded-full border border-white/20 text-center leading-8 mr-4 group-hover:border-accent group-hover:text-accent transition-colors">
                        {["A", "B", "C"][idx]}
                      </span>
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto w-full text-center"
            >
              <div
                className="glass-card rounded-3xl p-8 md:p-16 relative overflow-hidden border-t-4"
                style={{
                  borderTopColor: `hsl(var(--${result === "science" ? "primary" : result === "commerce" ? "secondary" : "accent"}))`,
                }}
              >
                <div className="text-muted-foreground font-bold tracking-wider uppercase text-sm mb-4">
                  {c.quiz.resultTitle}
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
                  {c.quiz.results[result].stream}
                </h2>

                <div
                  className={`w-24 h-24 mx-auto rounded-2xl ${STREAM_STYLES[result].bg} ${STREAM_STYLES[result].border} border flex items-center justify-center mb-8`}
                >
                  {(() => {
                    const Icon = STREAM_ICONS[result];
                    return <Icon className={`w-12 h-12 ${STREAM_STYLES[result].color}`} />;
                  })()}
                </div>

                <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto">
                  {c.quiz.results[result].desc}
                </p>

                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> {c.quiz.retake}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
