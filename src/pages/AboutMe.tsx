import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { Building2, Globe, Users, Sparkles, MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FEATURES = [
  {
    icon: <Users className="w-6 h-6" />,
    en: { title: "Community Solver", desc: "File and track local grievances directly to Nagar Palika Parishad." },
    hi: { title: "सामुदायिक समाधान", desc: "नगर पालिका परिषद को सीधे स्थानीय शिकायतें दर्ज करें और ट्रैक करें।" },
  },
  {
    icon: <Globe className="w-6 h-6" />,
    en: { title: "Lost & Found", desc: "A community gallery to reunite people with lost belongings." },
    hi: { title: "खोया और पाया", desc: "खोई वस्तुएं वापस दिलाने के लिए सामुदायिक गैलरी।" },
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    en: { title: "Career Compass", desc: "Stream guidance quiz designed for Class 10 & 11 students." },
    hi: { title: "करियर गाइड", desc: "कक्षा 10 और 11 के छात्रों के लिए करियर मार्गदर्शन प्रश्नोत्तरी।" },
  },
];

const card = "glass-card rounded-2xl p-8";

export default function AboutMe() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <PageWrapper className="flex flex-col gap-12 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
          <Building2 className="w-4 h-4" />
          {isHi ? "भारत सरकार • नगर पालिका परिषद सुलतानपुर" : "Govt. of India • Nagar Palika Parishad Sultanpur"}
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">
          {isHi ? "हमारे बारे में" : "About Us"}
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
          {isHi
            ? "इम्पैक्ट हब — नगर पालिका परिषद सुलतानपुर द्वारा संचालित एक डिजिटल नागरिक सेवा पोर्टल, जो स्थानीय समस्याओं के त्वरित समाधान और समुदाय को सशक्त बनाने के लिए बनाया गया है।"
            : "Impact Hub is a digital civic service portal operated under Nagar Palika Parishad Sultanpur, built to empower the community with faster grievance resolution, lost item recovery, and student career guidance."}
        </p>
      </div>

      {/* Mission */}
      <div className={card}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-transparent rounded-t-2xl" />
        <h2 className="text-2xl font-display font-bold mb-4 text-primary">
          {isHi ? "हमारा उद्देश्य" : "Our Mission"}
        </h2>
        <p className="text-muted-foreground leading-relaxed text-base">
          {isHi
            ? "हम एक ऐसा पोर्टल बनाना चाहते हैं जो नागरिकों और स्थानीय प्रशासन के बीच की दूरी को कम करे। हर नागरिक की आवाज़ मायने रखती है — चाहे वह सड़क पर गड्ढे की शिकायत हो, खोई हुई वस्तु हो, या भविष्य के करियर का सवाल।"
            : "Our mission is to bridge the gap between citizens and local administration. Every citizen's voice matters — be it a pothole complaint, a lost item, or a student's future career question. Impact Hub ensures no concern goes unheard."}
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-6">
          {isHi ? "पोर्टल की विशेषताएं" : "Portal Modules"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{isHi ? f.hi.title : f.en.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{isHi ? f.hi.desc : f.en.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className={`${card} relative overflow-hidden`}>
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-secondary/10 rounded-full blur-[60px]" />
        <h2 className="text-2xl font-display font-bold mb-6">
          {isHi ? "संपर्क करें" : "Contact Us"}
        </h2>
        <div className="space-y-4 text-muted-foreground">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary shrink-0" />
            <span>{isHi ? "नगर पालिका परिषद, सुलतानपुर, उत्तर प्रदेश — 228001" : "Nagar Palika Parishad, Sultanpur, Uttar Pradesh — 228001"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary shrink-0" />
            <span>+91-5362-XXXXXX</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <span>impacthub@sultanpur.gov.in</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-muted-foreground/50 text-center">
          {isHi
            ? "© 2026 नगर पालिका परिषद सुलतानपुर। सर्वाधिकार सुरक्षित।"
            : "© 2026 Nagar Palika Parishad Sultanpur. All rights reserved."}
        </div>
      </div>
    </PageWrapper>
  );
}
