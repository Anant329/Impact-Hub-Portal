import { PageWrapper } from "@/components/layout/PageWrapper";
import { useLostItems, ItemType, INDIAN_STATES, getDistricts } from "@/hooks/use-app-data";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Plus, MapPin, Phone, CheckCircle,
  Image as ImageIcon, Search, Clock, ShieldAlert, Upload, X, Camera,
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

const itemSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .refine(v => isSensibleText(v), { message: SENSELESS_MSG }),
  type: z.enum(["Lost", "Found"]),
  state: z.string().min(1, "State is required / राज्य चुनें"),
  district: z.string().min(1, "District is required / ज़िला चुनें"),
  description: z
    .string()
    .min(5, "विवरण आवश्यक है (Description is required)")
    .refine(v => isSensibleText(v), { message: SENSELESS_MSG }),
  location: z
    .string()
    .min(3, "Location is required")
    .refine(v => isSensibleText(v), { message: SENSELESS_MSG }),
  contact: z.string().min(5, "Contact info is required"),
});

type ItemForm = z.infer<typeof itemSchema>;

export default function LostFound() {
  const { items, addItem, resolveItem } = useLostItems();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { t, language } = useLanguage();
  const lf = t.lostFound;
  const isHi = language === "hi";

  const [selectedState, setSelectedState] = useState("");
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: { type: "Lost" },
  });

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const st = e.target.value;
    setSelectedState(st);
    setValue("state", st);
    setValue("district", "");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoData(reader.result as string);
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoData(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = (data: ItemForm) => {
    addItem({ ...data, imageUrl: photoData ?? undefined });
    reset();
    setPhotoData(null);
    setPhotoPreview(null);
    setSelectedState("");
    setIsFormOpen(false);
  };

  const districts = getDistricts(selectedState);

  return (
    <PageWrapper className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-10">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-white">
            {lf.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{lf.subtitle}</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-6 py-3 rounded-xl font-bold bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_15px_rgba(var(--secondary),0.3)] transition-all flex items-center gap-2 shrink-0"
        >
          {isFormOpen ? lf.cancel : <><Plus className="w-5 h-5" /> {lf.createPost}</>}
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
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-accent to-transparent rounded-t-2xl" />

              {/* Warning — same style as CommunitySolver */}
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
                      ? "झूठी जानकारी पोस्ट करना दंडनीय अपराध है। लोगों की वस्तुएं वापस दिलाने में मदद के लिए सटीक जानकारी दें।"
                      : "Posting false information is a punishable offense. Provide accurate details to help reunite people with their belongings."}
                  </p>
                </div>
              </motion.div>

              <h2 className="text-2xl font-display font-bold">{lf.formTitle}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Name + Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">{lf.fields.name} <span className="text-red-400">*</span></label>
                    <input
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                      placeholder={lf.fields.namePlaceholder}
                    />
                    {errors.name && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">{lf.fields.type} <span className="text-red-400">*</span></label>
                    <div className="flex gap-3">
                      <label className="flex-1 relative cursor-pointer">
                        <input type="radio" {...register("type")} value="Lost" className="peer sr-only" />
                        <div className="w-full py-3 rounded-xl text-center border border-white/10 bg-black/40 peer-checked:bg-destructive/20 peer-checked:border-destructive peer-checked:text-destructive font-bold transition-all text-sm">
                          {isHi ? "मेरा खोया है" : "I Lost This"}
                        </div>
                      </label>
                      <label className="flex-1 relative cursor-pointer">
                        <input type="radio" {...register("type")} value="Found" className="peer sr-only" />
                        <div className="w-full py-3 rounded-xl text-center border border-white/10 bg-black/40 peer-checked:bg-green-500/20 peer-checked:border-green-500 peer-checked:text-green-400 font-bold transition-all text-sm">
                          {isHi ? "मुझे मिला है" : "I Found This"}
                        </div>
                      </label>
                    </div>
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
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-foreground"
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
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-foreground"
                      >
                        <option value="">{isHi ? "— ज़िला चुनें —" : "— Select District —"}</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    ) : (
                      <input
                        {...register("district")}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                        placeholder={isHi ? "ज़िला दर्ज करें…" : "Enter district…"}
                      />
                    )}
                    {errors.district && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.district.message}</p>}
                  </div>
                </div>

                {/* Location + Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">{lf.fields.location} <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                      <input
                        {...register("location")}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                        placeholder={lf.fields.locationPlaceholder}
                      />
                    </div>
                    {errors.location && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.location.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">{lf.fields.contact} <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                      <input
                        {...register("contact")}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                        placeholder={lf.fields.contactPlaceholder}
                      />
                    </div>
                    {errors.contact && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.contact.message}</p>}
                  </div>
                </div>

                {/* Description — now required */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">
                    {isHi ? "विवरण" : "Description"} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all resize-none"
                    placeholder={lf.fields.descPlaceholder}
                  />
                  {errors.description && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.description.message}</p>}
                </div>

                {/* Photo Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground">
                    {isHi ? "फोटो" : "Photo"}
                    <span className="text-muted-foreground/50 ml-2 text-xs">({isHi ? "वैकल्पिक" : "optional"})</span>
                  </label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="lf-photo-upload" />

                  {!photoPreview ? (
                    <label
                      htmlFor="lf-photo-upload"
                      className="flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed border-white/20 bg-black/30 cursor-pointer hover:border-secondary/50 hover:bg-secondary/5 transition-all"
                    >
                      <Camera className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-semibold">{isHi ? "फोटो अपलोड करें" : "Click to upload photo"}</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP</p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden h-48 border border-white/10">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center hover:bg-destructive/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-10 py-3.5 rounded-xl font-bold bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_15px_rgba(var(--secondary),0.3)] transition-all"
                  >
                    {lf.submit}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {items.length === 0 ? (
          <div className="col-span-full glass-card rounded-2xl p-16 text-center border-dashed border-white/20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-xl font-bold mb-2">{lf.nothingYet}</h4>
            <p className="text-muted-foreground">{lf.beFirst}</p>
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl overflow-hidden flex flex-col hover:border-secondary/50 transition-all group"
            >
              <div className="h-48 bg-black/50 relative border-b border-white/5">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <ImageIcon className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {item.type === "Lost" ? (
                    <span className="px-3 py-1 rounded-full bg-destructive/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      {isHi ? "खोया" : "Lost"}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      {isHi ? "मिला" : "Found"}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-bold font-display group-hover:text-secondary transition-colors line-clamp-1 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-auto space-y-2 text-sm text-muted-foreground/80">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                  {(item.district || item.state) && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📍</span>
                      <span className="line-clamp-1 text-xs">{item.district}{item.state ? `, ${item.state}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{item.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{format(item.createdAt, "MMM d, yyyy")}</span>
                  </div>
                </div>

                <button
                  onClick={() => resolveItem(item.id)}
                  className="w-full py-2.5 rounded-lg font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" /> {lf.resolve}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}
