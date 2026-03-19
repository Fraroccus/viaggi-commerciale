import React from 'react';
import { Trip } from '../types';
import { Language, translations } from '../lib/translations';
import { Trash2, MapPin, Calendar, ChevronRight } from 'lucide-react';

interface SavedTripsProps {
  trips: Trip[];
  lang: Language;
  onSelect: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

export const SavedTrips: React.FC<SavedTripsProps> = ({ trips, lang, onSelect, onDelete }) => {
  const t = translations[lang];

  if (trips.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
        <p className="text-gray-500">{t.noTrips}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {trips.map((trip) => (
        <div 
          key={trip.id}
          className="group bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden hover:shadow-md transition-all"
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {trip.trip_title}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin size={14} />
                  {trip.destination}
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(trip.id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {trip.params.days} {t.day}
              </div>
              <div className="font-medium text-indigo-600">
                {trip.budget_breakdown.total} {trip.params.currency}
              </div>
            </div>

            <button
              onClick={() => onSelect(trip)}
              className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all"
            >
              {t.itinerary}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
