import React, { useState } from 'react';
import { TouristType } from '../types';
import { Language, translations } from '../lib/translations';
import { MapPin, Euro, Calendar, Users, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface TripFormProps {
  onSubmit: (params: any) => void;
  isLoading: boolean;
  lang: Language;
}

const TOURIST_TYPES: TouristType[] = ['Adventurous', 'Cultural', 'Relax', 'Gastronomic', 'Business'];

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading, lang }) => {
  const t = translations[lang];
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState(1000);
  const [currency, setCurrency] = useState('€');
  const [days, setDays] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<TouristType[]>(['Cultural']);

  const toggleType = (type: TouristType) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      destination,
      budget,
      currency,
      days,
      tourist_type: selectedTypes,
      language: lang
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-black/5">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MapPin size={16} className="text-indigo-500" />
          {t.destination}
        </label>
        <input
          required
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder={t.destinationPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Euro size={16} className="text-indigo-500" />
            {t.budget} ({currency})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-3 rounded-xl border border-gray-200 outline-none"
            >
              <option value="€">€</option>
              <option value="$">$</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar size={16} className="text-indigo-500" />
            {t.duration}
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Users size={16} className="text-indigo-500" />
          {t.touristType}
        </label>
        <div className="flex flex-wrap gap-2">
          {TOURIST_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTypes.includes(type)
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.types[type]}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        type="submit"
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t.generating}
          </>
        ) : (
          <>
            <Send size={18} />
            {t.generate}
          </>
        )}
      </motion.button>
    </form>
  );
};
