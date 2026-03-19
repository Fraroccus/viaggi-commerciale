import { Trip } from "../types";

const STORAGE_KEY = "ai_travel_planner_trips";

export const storage = {
  saveTrip: (trip: Trip) => {
    const trips = storage.getTrips();
    const updatedTrips = [trip, ...trips];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
  },

  getTrips: (): Trip[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  deleteTrip: (id: string) => {
    const trips = storage.getTrips();
    const updatedTrips = trips.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
  },

  getTripById: (id: string): Trip | undefined => {
    return storage.getTrips().find((t) => t.id === id);
  }
};
