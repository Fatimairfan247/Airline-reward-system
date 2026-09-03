export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export type FlightStatus = 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'In Flight' | 'Landed' | 'Cancelled';

export type PaymentMode = 'all' | 'cash' | 'points';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  terminal?: string;
  gate?: string;
  baggageClaim?: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  aircraft: string;
  origin: Airport;
  destination: Airport;
  departureTime: string; // ISO string or time string
  arrivalTime: string;
  departureDate: string; // YYYY-MM-DD
  duration: string; // e.g. "6h 45m"
  durationMinutes: number;
  stops: number;
  stopDetails?: string;
  cabinClasses: {
    economy: {
      available: boolean;
      cashPrice: number;
      pointsPrice: number;
      seatsLeft: number;
    };
    premium_economy?: {
      available: boolean;
      cashPrice: number;
      pointsPrice: number;
      seatsLeft: number;
    };
    business?: {
      available: boolean;
      cashPrice: number;
      pointsPrice: number;
      seatsLeft: number;
    };
    first?: {
      available: boolean;
      cashPrice: number;
      pointsPrice: number;
      seatsLeft: number;
    };
  };
  baggage: {
    carryOn: string;
    checked: string;
  };
  amenities: {
    wifi: boolean;
    power: boolean;
    meal: boolean;
    entertainment: boolean;
    lieFlatSeats: boolean;
  };
  badge?: 'Best Value' | 'Cheapest' | 'Fastest' | 'Eco Friendly' | 'Popular';
  status: FlightStatus;
  delayMinutes?: number;
  terminal?: string;
  gate?: string;
  baggageClaim?: string;
  weather?: {
    temp: string;
    condition: string;
  };
  flightProgressPercent?: number; // for in-flight tracking
}

export interface Seat {
  id: string;
  row: number;
  col: string; // A, B, C, D, E, F
  cabin: CabinClass;
  type: 'standard' | 'extra_legroom' | 'exit_row' | 'lie_flat';
  isAvailable: boolean;
  price: number; // in USD
  features: string[];
}

export interface Traveler {
  id: string;
  title: 'Mr' | 'Ms' | 'Mrs' | 'Dr';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  passportNumber?: string;
  nationality?: string;
  frequentFlyerNumber?: string;
  seatNumber?: string;
  mealPreference?: string;
  specialAssistance?: string;
  isSaved?: boolean;
}

export interface Booking {
  id: string; // e.g. "AV-78429X"
  flightId: string;
  flight: Flight;
  cabinClass: CabinClass;
  tripType: 'one-way' | 'round-trip';
  returnFlight?: Flight;
  travelers: Traveler[];
  bookingDate: string;
  paymentMethod: 'cash' | 'points' | 'points_plus_cash';
  fareBreakdown: {
    baseFare: number;
    taxesAndFees: number;
    seatFees: number;
    baggageFees: number;
    discountAmount: number;
    pointsUsed: number;
    cashPaid: number;
    totalUsd: number;
  };
  baggageAddons: {
    extraBags: number;
    cost: number;
  };
  status: 'confirmed' | 'checked-in' | 'cancelled' | 'completed';
  checkedInAt?: string;
  barcode: string;
  boardingGroup: string;
  eTicketIssued: boolean;
  cancellationDetails?: {
    cancelledAt: string;
    refundType: 'points' | 'cash' | 'voucher';
    refundAmount: number;
    voucherCode?: string;
  };
}

export interface SkyRewardsUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberNumber: string;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  pointsBalance: number;
  tierPointsThisYear: number;
  tierGoal: number;
  lifetimePoints: number;
  pointsExpiringSoon: number;
  expiryDate: string;
  activities: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    points: number;
    type: 'earned' | 'redeemed';
    flightNumber?: string;
  }>;
}

export interface SavedPaymentMethod {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  last4: string;
  cardholderName: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface TravelNotification {
  id: string;
  type: 'delay' | 'gate_change' | 'boarding' | 'checkin' | 'reward' | 'flight_update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  flightNumber?: string;
  badge?: string;
}

export interface FlightSearchCriteria {
  tripType: 'round_trip' | 'one_way' | 'multi_city';
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: CabinClass;
  payWithPoints: boolean;
}

export interface SearchParams {
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate?: string;
  tripType: 'round-trip' | 'one-way';
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: CabinClass;
  paymentMode: PaymentMode;
}
