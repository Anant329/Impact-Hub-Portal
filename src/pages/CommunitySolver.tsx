import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGrievances, GrievanceStatus, INDIAN_STATES, getDistricts } from "@/hooks/use-app-data";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, CheckCircle2, Clock, Plus, Clock3,
  ShieldAlert, Upload, MapPin, Loader2, X, Building2, Camera,
} from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

const KB_PATTERNS = ['asdf', 'qwer', 'zxcv', 'hjkl', 'uiop', 'bnm', 'tyui', 'ghjk'];

function isSensibleText(text: string, minWords = 1): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < minWords) return false;
  const lower = trimmed.toLowerCase();
  if (KB_PATTERNS.some(p => lower.includes(p))) return false;
  const stripped = lower.replace(/\s/g, '');
  if (stripped.length >= 6) {
    const uniqueRatio = new Set(stripped).size / stripped.length;
    if (uniqueRatio < 0.2) return false;
  }
  if (/^\d+$/.test(stripped) && stripped.length > 4) return false;
  return true;
}

const SENSELESS_MSG = "कृपया सही जानकारी दर्ज करें (Please enter valid information)";
const DESC_MSG = "Please provide a sensible description (at least 10 words, no random letters). / कृपया सही जानकारी दर्ज करें";

const grievanceSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .refine(v => isSensibleText(v), { message: SENSELESS_MSG }),
  category: z.enum(["Infrastructure", "Safety", "Education", "Healthcare", "Other"]),
  state: z.string().min(1, "State is required / राज्य चुनें"),
  district: z.string().min(1, "District is required / ज़िला चुनें"),
  description: z
    .string()
    .min(1, "Description is required")
    .refine(v => isSensibleText(v, 10), { message: DESC_MSG }),
});

type GrievanceForm = z.infer<typeof grievanceSchema>;

const StatusBadge = ({ status }: { status: GrievanceStatus }) => {
  switch (status) {
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" /> Pending
        </span>
      );
    case "In Progress":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider">
          <Clock3 className="w-3.5 h-3.5" /> In Progress
        </span>
      );
    case "Resolved":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
        </span>
      );
  }
};

function MapPicker({ onPin }: { onPin: (lat: number, lng: number, address: string) => void }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [pin, setPin] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", India")}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const address = data[0].display_name;
        setPin({ lat, lng, address });
        onPin(lat, lng, address);
      } else {
        setSearchError("Location not found. Try a more specific address.");
      }
    } catch {
      setSearchError("Failed to search. Check your connection.");
    } finally {
      setSearching(false);
    }
  };

  const mapSrc = pin
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${pin.lng - 0.015},${pin.lat - 0.015},${pin.lng + 0.015},${pin.lat + 0.015}&layer=mapnik&marker=${pin.lat},${pin.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=68.1,8.0,97.4,37.6&layer=mapnik`;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleSearch())}
            placeholder="Enter address to pin (e.g. MG Road, Bengaluru)"
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-3 rounded-xl bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors flex items-center gap-2 text-sm font-bold shrink-0"
        >
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {searching ? "Searching…" : "Pin"}
        </button>
      </div>
      {searchError && (
        <p className="text-destructive text-xs flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {searchError}
        </p>
      )}
      {pin && (
        <p className="text-xs text-green-400 flex items-center gap-1 line-clamp-1">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {pin.address}
        </p>
      )}
      <div className="rounded-xl overflow-hidden border border-white/10 h-56">
        <iframe src={mapSrc} className="w-full h-full" loading="lazy" title="Location Map" />
      </div>
      <p className="text-xs text-muted-foreground/40 text-center">
        Map © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap</a> contributors
      </p>
    </div>
  );
}

export default function CommunitySolver() {
  const { grievances, addGrievance, updateStatus } = useGrievances();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { t, language } = useLanguage();
  const s = t.solver;
  const isHi = language === "hi";

  const [photoData, setPhotoData] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoAnalysing, setPhotoAnalysing] = useState(false);
  const [photoAnalysed, setPhotoAnalysed] = useState(false);
  const [photoInvalid, setPhotoInvalid] = useState(false);
  const [pinInfo, setPinInfo] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [selectedState, setSelectedState] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GrievanceForm>({
    resolver: zodResolver(grievanceSchema),
  });

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const st = e.target.value;
    setSelectedState(st);
    setValue("state", st);
    setValue("district", "");
  };

  const analyseImage = (base64: string) => {
    setPhotoAnalysing(true);
    setPhotoInvalid(false);
    setTimeout(() => {
      setPhotoAnalysing(false);
      const isBlank = base64.length < 4000;
      if (isBlank) {
        setPhotoInvalid(true);
        setPhotoData(null);
        setPhotoPreview(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setPhotoData(base64);
        setPhotoAnalysed(true);
      }
    }, 1800);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setPhotoError(null);
      setPhotoAnalysed(false);
      analyseImage(result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoData(null);
    setPhotoPreview(null);
    setPhotoAnalysed(false);
    setPhotoInvalid(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = (data: GrievanceForm) => {
    if (!photoData) {
      setPhotoError(isHi ? "फोटो अनिवार्य है। कृपया समस्या की फोटो अपलोड करें।" : "Photo is mandatory. Please upload an image of the issue.");
      return;
    }
    addGrievance({
      ...data,
      photoUrl: photoData,
      pinLat: pinInfo?.lat,
      pinLng: pinInfo?.lng,
      pinAddress: pinInfo?.address,
    });
    reset();
    setPhotoData(null);
    setPhotoPreview(null);
    setPhotoAnalysed(false);
    setPinInfo(null);
    setSelectedState("");
    setIsFormOpen(false);
  };

  const districts = getDistricts(selectedState);

  return (
    <PageWrapper className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">
              {s.title}
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              {isHi ? "भारत सरकार" : "Govt. of India"}
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{s.subtitle}</p>
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20 w-fit">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-300/80 text-sm font-medium leading-relaxed">
              {isHi
                ? "सभी रिपोर्ट सीधे नगर पालिका परिषद (स्थानीय नगर निगम) को भेजी जाती हैं।"
                : "All reports are directly forwarded to Nagar Palika Parishad (Local Municipal Corporation)."}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all flex items-center gap-2 shrink-0"
        >
          {isFormOpen ? s.cancel : <><Plus className="w-5 h-5" /> {s.newGrievance}</>}
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-2xl p-8 md:p-10 relative space-y-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-transparent rounded-t-2xl" />

              {/* Warning */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-start p-5 rounded-xl bg-red-950/50 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.08)]"
              >
                <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-red-300 font-bold text-sm tracking-wide uppercase">
                    {isHi ? "⚠ चेतावनी (Warning)" : "⚠ Warning / Savdhani"}
                  </p>
                  <p className="text-red-300/80 text-sm leading-relaxed">
                    {isHi
                      ? "झूठी या भ्रामक रिपोर्ट दर्ज करना भारतीय कानून के तहत दंडनीय अपराध है। कृपया सटीक और सच्ची जानकारी प्रदान करें।"
                      : "Filing false or misleading reports is a punishable offense under Indian law. Please provide accurate and truthful information. False complaints may lead to legal action."}
                  </p>
                </div>
              </motion.div>

              <h2 className="text-2xl font-display font-bold">{s.submitReport}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Title + Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">{s.fields.title} <span className="text-red-400">*</span></label>
                    <input
                      {...register("title")}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder={s.fields.titlePlaceholder}
                    />
                    {errors.title && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">{s.fields.category} <span className="text-red-400">*</span></label>
                    <select
                      {...register("category")}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                    >
                      {s.categories.map((cat, i) => (
                        <option key={i} value={["Infrastructure", "Safety", "Education", "Healthcare", "Other"][i]}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* State + District */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">
                      {isHi ? "राज्य" : "State"} <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={selectedState}
                      onChange={handleStateChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                    >
                      <option value="">{isHi ? "— राज्य चुनें —" : "— Select State —"}</option>
                      {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                    {errors.state && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.state.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">
                      {isHi ? "ज़िला" : "District"} <span className="text-red-400">*</span>
                    </label>
                    {districts.length > 0 ? (
                      <select
                        {...register("district")}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                      >
                        <option value="">{isHi ? "— ज़िला चुनें —" : "— Select District —"}</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    ) : (
                      <input
                        {...register("district")}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder={isHi ? "ज़िला दर्ज करें…" : "Enter district…"}
                      />
                    )}
                    {errors.district && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.district.message}</p>}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">
                    {isHi ? "विवरण" : "Description"} <span className="text-red-400">*</span>
                    <span className="text-muted-foreground/50 ml-2 text-xs">({isHi ? "न्यूनतम 10 शब्द" : "min 10 words"})</span>
                  </label>
                  <textarea
                    {...register("description")}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder={s.fields.descPlaceholder}
                  />
                  {errors.description && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.description.message}</p>}
                </div>

                {/* Photo Upload — Mandatory + AI Analysis */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground">
                    {isHi ? "फोटो साक्ष्य" : "Photo Evidence"} <span className="text-red-400">*</span>
                    <span className="text-muted-foreground/50 ml-2 text-xs">({isHi ? "अनिवार्य" : "mandatory"})</span>
                  </label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="cs-photo-upload" />

                  {!photoPreview ? (
                    <label
                      htmlFor="cs-photo-upload"
                      className="flex flex-col items-center justify-center gap-3 w-full h-44 rounded-xl border-2 border-dashed border-white/20 bg-black/30 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <Camera className="w-9 h-9 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-semibold">{isHi ? "फोटो अपलोड करें" : "Click to upload photo"}</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP</p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden h-52 border border-white/10">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      {photoAnalysing && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          <p className="text-sm font-bold text-primary">
                            {isHi ? "समस्या का विश्लेषण हो रहा है..." : "Analyzing Problem..."}
                          </p>
                        </div>
                      )}
                      {!photoAnalysing && photoAnalysed && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold backdrop-blur-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isHi ? "फोटो विश्लेषण सफल" : "Image analyzed"}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center hover:bg-destructive/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {photoInvalid && (
                    <p className="text-destructive text-sm flex items-center gap-1 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {isHi ? "अमान्य फोटो! कृपया समस्या की स्पष्ट फोटो अपलोड करें।" : "Invalid photo! Please upload a clear photo of the issue."}
                    </p>
                  )}
                  {photoError && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {photoError}
                    </p>
                  )}
                </div>

                {/* Map */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground">
                    {isHi ? "सटीक स्थान पिन करें" : "Pin Exact Location"}
                    <span className="text-muted-foreground/40 ml-2 text-xs">({isHi ? "वैकल्पिक लेकिन अनुशंसित" : "optional but recommended"})</span>
                  </label>
                  <MapPicker onPin={(lat, lng, address) => setPinInfo({ lat, lng, address })} />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={photoAnalysing}
                    className="px-10 py-3.5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {s.submit}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tracking List */}
      <div className="space-y-5">
        <h3 className="text-2xl font-display font-bold flex items-center gap-2">
          {s.trackingList}
          <span className="px-2 py-0.5 bg-white/10 rounded-md text-sm font-sans">{grievances.length}</span>
        </h3>

        {grievances.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center border-dashed border-white/20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-xl font-bold mb-2">{s.allClear}</h4>
            <p className="text-muted-foreground">{s.noneYet}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {grievances.map((g) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:border-primary/50 transition-colors"
              >
                {g.photoUrl && (
                  <div className="sm:w-44 h-40 sm:h-auto shrink-0">
                    <img src={g.photoUrl} alt={g.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusBadge status={g.status} />
                      <span className="text-sm font-medium text-muted-foreground px-2 py-1 bg-white/5 rounded-md">{g.category}</span>
                    </div>
                    <h4 className="text-xl font-bold">{g.title}</h4>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{g.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground/60">
                      <span>📍 {g.district}, {g.state}</span>
                      {g.pinAddress && <span className="line-clamp-1 max-w-xs">🗺 {g.pinAddress}</span>}
                      <span>🕐 {format(g.createdAt, "MMM d, yyyy h:mm a")}</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    {g.status === "Pending" && (
                      <button onClick={() => updateStatus(g.id, "In Progress")} className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 transition-colors">
                        {s.startWork}
                      </button>
                    )}
                    {g.status === "In Progress" && (
                      <button onClick={() => updateStatus(g.id, "Resolved")} className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50 transition-colors">
                        {s.markResolved}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
