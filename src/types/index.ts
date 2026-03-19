export type TouristType = 'Adventurous' | 'Cultural' | 'Relax' | 'Gastronomic' | 'Business';

export interface Activity {
  name: string;
  description: string;
  time: string;
  cost: number;
  lat: number;
  lng: number;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface BudgetBreakdown {
  accommodation: number;
  transport: number;
  food: number;
  activities: number;
  extra: number;
  total: number;
}

export interface Trip {
  id: string;
  trip_title: string;
  destination: string;
  summary: string;
  budget_breakdown: BudgetBreakdown;
  days: DayPlan[];
  practical_tips: string[];
  budget_alert: string | null;
  createdAt: number;
  params: {
    destination: string;
    budget: number;
    currency: string;
    days: number;
    tourist_type: string[];
    language: 'it' | 'en';
  };
}
