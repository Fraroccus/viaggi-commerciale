import { useState, useEffect } from 'react';
import { Trip } from './types';
import { Language, translations } from './lib/translations';
import { generateTrip } from './lib/gemini';
import { storage } from './lib/storage';
import { TripForm } from './components/TripForm';
import { TripDisplay } from './components/TripDisplay';
import { SavedTrips } from './components/SavedTrips';
import { Compass, History, Plus, Globe, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'home' | 'result' | 'history';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<View>('home');
  const [loading, setLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    setSavedTrips(storage.getTrips());
  }, []);

  const handleGenerate = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const trip = await generateTrip(params);
      setCurrentTrip(trip);
      setView('result');
      setIsSaved(false);
    } catch (err: any) {
      setError(err.message || "Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (currentTrip) {
      storage.saveTrip(currentTrip);
      setSavedTrips(storage.getTrips());
      setIsSaved(true);
    }
  };

  const handleDelete = (id: string) => {
    storage.deleteTrip(id);
    setSavedTrips(storage.getTrips());
  };

  const handleSelectSaved = (trip: Trip) => {
    setCurrentTrip(trip);
    setView('result');
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Compass size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              {t.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'it' : 'en')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <Globe size={18} />
              {lang.toUpperCase()}
            </button>
            
            <nav className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setView('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'home' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Plus size={16} />
                <span className="hidden sm:inline">{t.newTrip}</span>
              </button>
              <button
                onClick={() => setView('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'history' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <History size={16} />
                <span className="hidden sm:inline">{t.myTrips}</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                  {t.subtitle}
                </h2>
                <p className="text-gray-500 text-lg">
                  {lang === 'en' 
                    ? "Enter your destination and preferences, and let our AI craft the perfect itinerary for you."
                    : "Inserisci la tua destinazione e le tue preferenze, e lascia che la nostra IA crei l'itinerario perfetto per te."}
                </p>
              </div>
              <TripForm onSubmit={handleGenerate} isLoading={loading} lang={lang} />
            </motion.div>
          )}

          {view === 'result' && currentTrip && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="mb-8">
                <button 
                  onClick={() => setView(savedTrips.some(t => t.id === currentTrip.id) ? 'history' : 'home')}
                  className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
                >
                  ← {t.back}
                </button>
              </div>
              <TripDisplay 
                trip={currentTrip} 
                lang={lang} 
                onSave={handleSave}
                isSaved={isSaved}
              />
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{t.myTrips}</h2>
                  <p className="text-gray-500">{lang === 'en' ? 'Your previously planned adventures' : 'Le tue avventure pianificate in precedenza'}</p>
                </div>
              </div>
              <SavedTrips 
                trips={savedTrips} 
                lang={lang} 
                onSelect={handleSelectSaved}
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-black/5 text-center text-gray-400 text-sm">
        <p>© 2026 AI Travel Planner • Built with Gemini AI</p>
      </footer>
    </div>
  );
}
