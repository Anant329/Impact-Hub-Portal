import { createContext, useContext, useState, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type Language = "en" | "hi";

export const translations = {
  en: {
    nav: {
      home: "Home",
      communitySolver: "Community Solver",
      lostFound: "Lost & Found",
      careerCompass: "Career Compass",
      about: "About Me",
    },
    home: {
      badge: "Empowering Communities",
      heroTitle: "Welcome to",
      heroSubtitle:
        "A decentralized digital portal designed to solve local grievances, reunite people with lost items, and guide the next generation.",
      reportIssue: "Report Issue",
      coreModules: "Core Modules",
      stats: {
        grievances: "Grievances Solved",
        items: "Items Recovered",
        students: "Students Guided",
      },
      solver: {
        title: "Community Solver",
        desc: "Submit local grievances regarding infrastructure, safety, or public services, and track their resolution status in real-time.",
        cta: "Open Module",
      },
      lost: {
        title: "Lost & Found",
        desc: "A visual gallery to help reunite people with their lost belongings quickly and safely.",
        cta: "Explore",
      },
      career: {
        title: "Career Compass",
        desc: "Designed specifically for Class 10/11 students. Take our interactive career quiz to discover which stream best aligns with your strengths and interests.",
        cta: "Take the Quiz",
      },
    },
    solver: {
      title: "Community Solver",
      subtitle:
        "Report local issues to help us build a better environment. Track the progress of submitted grievances in real-time.",
      newGrievance: "New Grievance",
      cancel: "Cancel",
      submitReport: "Submit a Report",
      submit: "Submit Report",
      trackingList: "Tracking List",
      allClear: "All clear!",
      noneYet: "No grievances have been reported yet.",
      startWork: "Start Work",
      markResolved: "Mark Resolved",
      fields: {
        title: "Title",
        titlePlaceholder: "E.g., Pothole on Main Street",
        category: "Category",
        description: "Description",
        descPlaceholder: "Provide details about the issue (at least 10 words)...",
      },
      categories: ["Infrastructure", "Safety", "Education", "Healthcare", "Other"],
    },
    lostFound: {
      title: "Lost & Found",
      subtitle:
        "Reuniting people with their belongings. Post items you've lost or found in the community.",
      createPost: "Create Post",
      cancel: "Cancel",
      formTitle: "Post an Item",
      submit: "Submit",
      nothingYet: "Nothing here yet",
      beFirst: "Be the first to post a lost or found item.",
      resolve: "Mark Resolved",
      fields: {
        name: "Item Name",
        namePlaceholder: "E.g., Blue Backpack",
        type: "Type",
        description: "Description",
        descPlaceholder: "Describe the item in detail...",
        location: "Location",
        locationPlaceholder: "Where was it lost/found?",
        contact: "Contact Info",
        contactPlaceholder: "Phone number or email",
        imageUrl: "Photo (optional)",
        imageUrlPlaceholder: "Upload photo",
      },
    },
    career: {
      title: "Career Compass",
      subtitle: "Discover your ideal academic stream for Class 10 & 11",
      streams: {
        science: {
          title: "Science Stream",
          desc: "Physics, Chemistry, Biology, and Mathematics. Ideal for engineering, medicine, and research careers.",
          subjects: "Key Subjects: Physics, Chemistry, Biology/Maths, Computer Science",
        },
        commerce: {
          title: "Commerce Stream",
          desc: "Accountancy, Economics, Business Studies. Ideal for finance, entrepreneurship, and management careers.",
          subjects: "Key Subjects: Accountancy, Economics, Business Studies, Mathematics",
        },
        arts: {
          title: "Arts & Humanities",
          desc: "History, Political Science, Sociology, Literature. Ideal for law, civil services, journalism, and design.",
          subjects: "Key Subjects: History, Political Science, Sociology, Fine Arts",
        },
      },
      quiz: {
        title: "Take the Career Quiz",
        subtitle: "Answer 5 questions to get a personalized stream recommendation.",
        prev: "Previous",
        next: "Next",
        submit: "See My Result",
        retake: "Retake Quiz",
        resultTitle: "Your Recommended Stream",
        results: {
          science: {
            stream: "Science",
            desc: "Your analytical mindset and love for problem-solving align perfectly with the Science stream. Consider careers in Engineering, Medicine, or Research.",
          },
          commerce: {
            stream: "Commerce",
            desc: "Your practical and organizational skills point towards Commerce. Consider careers in Finance, Business Administration, CA, or Entrepreneurship.",
          },
          arts: {
            stream: "Arts & Humanities",
            desc: "Your creative and empathetic nature is a great fit for Arts. Consider careers in Law, Civil Services, Journalism, Design, or Teaching.",
          },
        },
      },
    },
  },
  hi: {
    nav: {
      home: "होम",
      communitySolver: "सामुदायिक समाधान",
      lostFound: "खोया और पाया",
      careerCompass: "करियर गाइड",
      about: "मेरे बारे में",
    },
    home: {
      badge: "समुदाय को सशक्त बनाना",
      heroTitle: "आपका स्वागत है",
      heroSubtitle:
        "एक विकेन्द्रीकृत डिजिटल पोर्टल जो स्थानीय शिकायतों को सुलझाने, खोई वस्तुओं को वापस दिलाने और अगली पीढ़ी को मार्गदर्शन देने के लिए बनाया गया है।",
      reportIssue: "समस्या दर्ज करें",
      coreModules: "मुख्य मॉड्यूल",
      stats: {
        grievances: "शिकायतें सुलझाई गईं",
        items: "वस्तुएं वापस मिलीं",
        students: "छात्रों को मार्गदर्शन",
      },
      solver: {
        title: "सामुदायिक समाधान",
        desc: "बुनियादी ढांचे, सुरक्षा या सार्वजनिक सेवाओं से संबंधित स्थानीय शिकायतें दर्ज करें और रीयल-टाइम में उनकी स्थिति ट्रैक करें।",
        cta: "मॉड्यूल खोलें",
      },
      lost: {
        title: "खोया और पाया",
        desc: "लोगों को उनकी खोई हुई वस्तुएं जल्दी और सुरक्षित रूप से वापस दिलाने के लिए एक विज़ुअल गैलरी।",
        cta: "देखें",
      },
      career: {
        title: "करियर गाइड",
        desc: "विशेष रूप से कक्षा 10/11 के छात्रों के लिए। हमारी इंटरैक्टिव करियर प्रश्नोत्तरी लें और जानें कि आपकी रुचियों के अनुसार कौन सी धारा सबसे अच्छी है।",
        cta: "प्रश्नोत्तरी लें",
      },
    },
    solver: {
      title: "सामुदायिक समाधान",
      subtitle:
        "बेहतर माहौल बनाने में मदद के लिए स्थानीय समस्याएं दर्ज करें। रीयल-टाइम में शिकायतों की प्रगति ट्रैक करें।",
      newGrievance: "नई शिकायत",
      cancel: "रद्द करें",
      submitReport: "रिपोर्ट दर्ज करें",
      submit: "जमा करें",
      trackingList: "ट्रैकिंग सूची",
      allClear: "सब ठीक है!",
      noneYet: "अभी तक कोई शिकायत दर्ज नहीं हुई है।",
      startWork: "काम शुरू करें",
      markResolved: "हल हुआ चिह्नित करें",
      fields: {
        title: "शीर्षक",
        titlePlaceholder: "जैसे, मुख्य सड़क पर गड्ढा",
        category: "श्रेणी",
        description: "विवरण",
        descPlaceholder: "समस्या के बारे में विस्तृत जानकारी दें (कम से कम 10 शब्द)...",
      },
      categories: ["बुनियादी ढांचा", "सुरक्षा", "शिक्षा", "स्वास्थ्य", "अन्य"],
    },
    lostFound: {
      title: "खोया और पाया",
      subtitle:
        "लोगों को उनका सामान वापस दिलाना। समुदाय में खोई या मिली वस्तुएं पोस्ट करें।",
      createPost: "पोस्ट बनाएं",
      cancel: "रद्द करें",
      formTitle: "वस्तु पोस्ट करें",
      submit: "जमा करें",
      nothingYet: "अभी कुछ नहीं है",
      beFirst: "पहले खोई या मिली वस्तु पोस्ट करें।",
      resolve: "हल हुआ चिह्नित करें",
      fields: {
        name: "वस्तु का नाम",
        namePlaceholder: "जैसे, नीला बैकपैक",
        type: "प्रकार",
        description: "विवरण",
        descPlaceholder: "वस्तु का विस्तृत विवरण दें...",
        location: "स्थान",
        locationPlaceholder: "कहाँ खोई/मिली?",
        contact: "संपर्क जानकारी",
        contactPlaceholder: "फ़ोन नंबर या ईमेल",
        imageUrl: "फोटो (वैकल्पिक)",
        imageUrlPlaceholder: "फोटो अपलोड करें",
      },
    },
    career: {
      title: "करियर गाइड",
      subtitle: "कक्षा 10 और 11 के लिए आदर्श अकादमिक धारा खोजें",
      streams: {
        science: {
          title: "विज्ञान धारा",
          desc: "भौतिकी, रसायन विज्ञान, जीव विज्ञान और गणित। इंजीनियरिंग, चिकित्सा और शोध करियर के लिए आदर्श।",
          subjects: "मुख्य विषय: भौतिकी, रसायन, जीव विज्ञान/गणित, कंप्यूटर विज्ञान",
        },
        commerce: {
          title: "वाणिज्य धारा",
          desc: "लेखांकन, अर्थशास्त्र, व्यावसायिक अध्ययन। वित्त, उद्यमिता और प्रबंधन करियर के लिए आदर्श।",
          subjects: "मुख्य विषय: लेखांकन, अर्थशास्त्र, व्यावसायिक अध्ययन, गणित",
        },
        arts: {
          title: "कला एवं मानविकी",
          desc: "इतिहास, राजनीति विज्ञान, समाजशास्त्र, साहित्य। कानून, सिविल सेवा, पत्रकारिता और डिजाइन के लिए आदर्श।",
          subjects: "मुख्य विषय: इतिहास, राजनीति विज्ञान, समाजशास्त्र, ललित कला",
        },
      },
      quiz: {
        title: "करियर प्रश्नोत्तरी लें",
        subtitle: "व्यक्तिगत धारा सिफारिश पाने के लिए 5 सवालों के जवाब दें।",
        prev: "पिछला",
        next: "अगला",
        submit: "मेरा परिणाम देखें",
        retake: "दोबारा प्रश्नोत्तरी लें",
        resultTitle: "आपकी अनुशंसित धारा",
        results: {
          science: {
            stream: "विज्ञान",
            desc: "आपकी विश्लेषणात्मक सोच और समस्या-समाधान की क्षमता विज्ञान धारा के लिए एकदम सही है। इंजीनियरिंग, चिकित्सा या शोध में करियर पर विचार करें।",
          },
          commerce: {
            stream: "वाणिज्य",
            desc: "आपके व्यावहारिक और संगठनात्मक कौशल वाणिज्य की ओर इशारा करते हैं। वित्त, CA, व्यवसाय प्रशासन या उद्यमिता में करियर पर विचार करें।",
          },
          arts: {
            stream: "कला एवं मानविकी",
            desc: "आपकी रचनात्मक और सहानुभूतिपूर्ण प्रकृति कला के लिए उपयुक्त है। कानून, सिविल सेवा, पत्रकारिता, डिजाइन या शिक्षण में करियर पर विचार करें।",
          },
        },
      },
    },
  },
} as const;

export type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useLocalStorage<{ hasSeen: boolean; language: Language }>(
    "impact_hub_welcome_v2",
    { hasSeen: false, language: "en" }
  );

  const language = stored.language;

  const setLanguage = (lang: Language) => {
    setStored((prev) => ({ ...prev, language: lang }));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
