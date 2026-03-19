import React from 'react';
import { Trip } from '../types';
import { Language, translations } from '../lib/translations';
import { MapView } from './MapView';
import { CostChart } from './CostChart';
import { Clock, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface TripDisplayProps {
  trip: Trip;
  lang: Language;
  onSave?: () => void;
  isSaved?: boolean;
}

export const TripDisplay: React.FC<TripDisplayProps> = ({ trip, lang, onSave, isSaved }) => {
  const t = translations[lang];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{trip.trip_title}</h2>
            <p className="text-gray-500 mt-1">{trip.destination}</p>
          </div>
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                isSaved 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
              }`}
            >
              {isSaved ? <CheckCircle2 size={18} /> : null}
              {isSaved ? t.saved : t.save}
            </button>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed">{trip.summary}</p>
        
        {trip.budget_alert && (
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p>{trip.budget_alert}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Info size={20} className="text-indigo-500" />
            {t.budgetBreakdown}
          </h3>
          <CostChart breakdown={trip.budget_breakdown} lang={lang} />
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500">{t.total} Est.</p>
              <p className="text-lg font-bold text-gray-900">{trip.budget_breakdown.total} {trip.params.currency}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-indigo-600 font-medium">{t.budget} Target</p>
              <p className="text-lg font-bold text-indigo-900">{trip.params.budget} {trip.params.currency}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <MapView trip={trip} />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">{t.itinerary}</h3>
        {trip.days.map((day, idx) => (
          <motion.div 
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden"
          >
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
              <h4 className="font-bold text-indigo-900">
                {t.day} {day.day}: {day.title}
              </h4>
            </div>
            <div className="p-6 space-y-6">
              {day.activities.map((activity, aIdx) => (
                <div key={aIdx} className="flex gap-4">
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Clock size={18} />
                    </div>
                    {aIdx < day.activities.length - 1 && (
                      <div className="w-px h-full bg-gray-100 my-2" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-gray-900">{activity.name}</h5>
                      <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        {activity.cost} {trip.params.currency}
                      </span>
                    </div>
                    <p className="text-sm text-indigo-500 font-medium">{activity.time}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Info size={20} className="text-indigo-400" />
          {t.practicalTips}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trip.practical_tips.map((tip, idx) => (
            <li key={idx} className="flex gap-3 text-slate-300 text-sm">
              <span className="text-indigo-400 font-bold">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
