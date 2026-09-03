import { Airport, CabinClass, Flight } from '../types/airline';
import { POPULAR_AIRPORTS } from './mockAirports';

interface FlightTemplate {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  aircraft: string;
  departureHour: number;
  departureMin: number;
  durationMinutes: number;
  stops: number;
  stopDetails?: string;
  baseEcoPrice: number;
  badge?: 'Best Value' | 'Cheapest' | 'Fastest' | 'Eco Friendly' | 'Popular';
}

const TEMPLATES: FlightTemplate[] = [
  {
    flightNumber: 'AV-104',
    airline: 'AeroVoyage Flagship',
    airlineCode: 'AV',
    aircraft: 'Boeing 787-9 Dreamliner',
    departureHour: 8,
    departureMin: 30,
    durationMinutes: 410,
    stops: 0,
    baseEcoPrice: 620,
    badge: 'Fastest',
  },
  {
    flightNumber: 'AV-280',
    airline: 'AeroVoyage Express',
    airlineCode: 'AV',
    aircraft: 'Airbus A350-1000',
    departureHour: 11,
    departureMin: 15,
    durationMinutes: 435,
    stops: 0,
    baseEcoPrice: 580,
    badge: 'Best Value',
  },
  {
    flightNumber: 'SA-402',
    airline: 'SkyAlliance Global',
    airlineCode: 'SA',
    aircraft: 'Boeing 777-300ER',
    departureHour: 14,
    departureMin: 0,
    durationMinutes: 510,
    stops: 1,
    stopDetails: 'FRA 1h 25m layover',
    baseEcoPrice: 485,
    badge: 'Cheapest',
  },
  {
    flightNumber: 'AV-710',
    airline: 'AeroVoyage Nightliner',
    airlineCode: 'AV',
    aircraft: 'Airbus A350-900',
    departureHour: 19,
    departureMin: 45,
    durationMinutes: 420,
    stops: 0,
    baseEcoPrice: 640,
    badge: 'Popular',
  },
  {
    flightNumber: 'EK-202',
    airline: 'Emirates SkyLink',
    airlineCode: 'EK',
    aircraft: 'Airbus A380-800 SuperJumbo',
    departureHour: 16,
    departureMin: 30,
    durationMinutes: 440,
    stops: 0,
    baseEcoPrice: 690,
  },
  {
    flightNumber: 'SQ-025',
    airline: 'Singapore Horizon',
    airlineCode: 'SQ',
    aircraft: 'Airbus A350-900 Ultra',
    departureHour: 22,
    departureMin: 10,
    durationMinutes: 425,
    stops: 0,
    baseEcoPrice: 710,
    badge: 'Eco Friendly',
  },
];

export function generateFlightsForRoute(
  origin: Airport,
  destination: Airport,
  dateStr: string
): Flight[] {
  // Normalize date
  const [year, month, day] = dateStr ? dateStr.split('-').map(Number) : [2026, 9, 10];
  const baseDate = new Date(year, (month || 9) - 1, day || 10);

  return TEMPLATES.map((tmpl, idx) => {
    const depTime = new Date(baseDate);
    depTime.setHours(tmpl.departureHour, tmpl.departureMin, 0, 0);

    const arrTime = new Date(depTime.getTime() + tmpl.durationMinutes * 60 * 1000);

    const hours = Math.floor(tmpl.durationMinutes / 60);
    const mins = tmpl.durationMinutes % 60;
    const durationFormatted = `${hours}h ${mins > 0 ? `${mins}m` : ''}`;

    // Price scaling
    const ecoPrice = tmpl.baseEcoPrice + (idx * 25);
    const ecoPoints = Math.round(ecoPrice * 65); // ~1.54 cents per point

    const premEcoPrice = Math.round(ecoPrice * 1.55);
    const premEcoPoints = Math.round(premEcoPrice * 62);

    const bizPrice = Math.round(ecoPrice * 3.4);
    const bizPoints = Math.round(bizPrice * 58);

    const firstPrice = Math.round(ecoPrice * 6.2);
    const firstPoints = Math.round(firstPrice * 54);

    const statuses: Flight['status'][] = ['On Time', 'On Time', 'On Time', 'Delayed', 'On Time', 'Boarding'];
    const currentStatus = statuses[idx % statuses.length];
    const isDelayed = currentStatus === 'Delayed';

    return {
      id: `FL-${origin.code}-${destination.code}-${tmpl.flightNumber}-${idx}`,
      flightNumber: tmpl.flightNumber,
      airline: tmpl.airline,
      airlineCode: tmpl.airlineCode,
      aircraft: tmpl.aircraft,
      origin: {
        ...origin,
        terminal: origin.terminal || `${(idx % 3) + 1}`,
        gate: origin.gate || `${String.fromCharCode(65 + (idx % 4))}${12 + idx * 3}`,
      },
      destination: {
        ...destination,
        terminal: destination.terminal || `${(idx % 2) + 2}`,
        gate: destination.gate || `${String.fromCharCode(66 + (idx % 3))}${20 + idx * 2}`,
        baggageClaim: destination.baggageClaim || `Belt ${(idx % 8) + 1}`,
      },
      departureDate: dateStr || '2026-09-10',
      departureTime: depTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      arrivalTime: arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      duration: durationFormatted,
      durationMinutes: tmpl.durationMinutes,
      stops: tmpl.stops,
      stopDetails: tmpl.stopDetails,
      cabinClasses: {
        economy: {
          available: true,
          cashPrice: ecoPrice,
          pointsPrice: ecoPoints,
          seatsLeft: 14 - (idx * 2),
        },
        premium_economy: {
          available: true,
          cashPrice: premEcoPrice,
          pointsPrice: premEcoPoints,
          seatsLeft: 7 - (idx % 3),
        },
        business: {
          available: true,
          cashPrice: bizPrice,
          pointsPrice: bizPoints,
          seatsLeft: 5 - (idx % 2),
        },
        first: {
          available: idx % 2 === 0,
          cashPrice: firstPrice,
          pointsPrice: firstPoints,
          seatsLeft: 2,
        },
      },
      baggage: {
        carryOn: '1 Personal Item + 1 Carry-on (10kg)',
        checked: idx === 2 ? '1 Included (23kg)' : '2 Included (23kg each)',
      },
      amenities: {
        wifi: true,
        power: true,
        meal: true,
        entertainment: true,
        lieFlatSeats: tmpl.aircraft.includes('787') || tmpl.aircraft.includes('A350') || tmpl.aircraft.includes('A380'),
      },
      badge: tmpl.badge,
      status: currentStatus,
      delayMinutes: isDelayed ? 35 : 0,
      terminal: origin.terminal || '4',
      gate: origin.gate || 'B22',
      baggageClaim: destination.baggageClaim || 'Carousel 4',
      weather: {
        temp: '22°C / 72°F',
        condition: 'Clear Sky & Smooth Air',
      },
      flightProgressPercent: idx === 1 ? 64 : 0,
    };
  });
}

// Pre-seeded live flights for the Live Status Tracker
export const SEED_LIVE_FLIGHTS: Flight[] = [
  {
    id: 'LIVE-AV-102',
    flightNumber: 'AV-102',
    airline: 'AeroVoyage Flagship',
    airlineCode: 'AV',
    aircraft: 'Boeing 787-9 Dreamliner',
    origin: POPULAR_AIRPORTS[0], // JFK
    destination: POPULAR_AIRPORTS[1], // LHR
    departureDate: '2026-09-03',
    departureTime: '08:15 AM',
    arrivalTime: '08:25 PM',
    duration: '7h 10m',
    durationMinutes: 430,
    stops: 0,
    cabinClasses: {
      economy: { available: true, cashPrice: 620, pointsPrice: 42000, seatsLeft: 4 },
      business: { available: true, cashPrice: 2150, pointsPrice: 125000, seatsLeft: 2 },
    },
    baggage: { carryOn: '1 Free Carry-on', checked: '2 Free Checked Bags' },
    amenities: { wifi: true, power: true, meal: true, entertainment: true, lieFlatSeats: true },
    status: 'In Flight',
    flightProgressPercent: 68,
    terminal: '4',
    gate: 'B24',
    baggageClaim: 'Belt 5',
    weather: { temp: '19°C / 66°F', condition: 'Mild showers in London' },
  },
  {
    id: 'LIVE-AV-304',
    flightNumber: 'AV-304',
    airline: 'AeroVoyage SkySuite',
    airlineCode: 'AV',
    aircraft: 'Airbus A350-1000',
    origin: POPULAR_AIRPORTS[6], // SFO
    destination: POPULAR_AIRPORTS[2], // HND Tokyo
    departureDate: '2026-09-03',
    departureTime: '11:40 AM',
    arrivalTime: '03:15 PM (+1)',
    duration: '11h 35m',
    durationMinutes: 695,
    stops: 0,
    cabinClasses: {
      economy: { available: true, cashPrice: 890, pointsPrice: 58000, seatsLeft: 9 },
      business: { available: true, cashPrice: 3400, pointsPrice: 195000, seatsLeft: 1 },
    },
    baggage: { carryOn: '1 Free Carry-on', checked: '2 Free Checked Bags' },
    amenities: { wifi: true, power: true, meal: true, entertainment: true, lieFlatSeats: true },
    status: 'Boarding',
    terminal: 'Intl G',
    gate: 'G96',
    baggageClaim: 'Carousel 2',
    weather: { temp: '26°C / 79°F', condition: 'Sunny in Tokyo' },
  },
  {
    id: 'LIVE-AV-88',
    flightNumber: 'AV-88',
    airline: 'AeroVoyage Express',
    airlineCode: 'AV',
    aircraft: 'Boeing 777-300ER',
    origin: POPULAR_AIRPORTS[3], // DXB Dubai
    destination: POPULAR_AIRPORTS[4], // SIN Singapore
    departureDate: '2026-09-03',
    departureTime: '02:00 PM',
    arrivalTime: '01:45 AM (+1)',
    duration: '7h 45m',
    durationMinutes: 465,
    stops: 0,
    cabinClasses: {
      economy: { available: true, cashPrice: 540, pointsPrice: 36000, seatsLeft: 12 },
    },
    baggage: { carryOn: '1 Carry-on', checked: '1 Checked Bag' },
    amenities: { wifi: true, power: true, meal: true, entertainment: true, lieFlatSeats: true },
    status: 'Delayed',
    delayMinutes: 40,
    terminal: '3',
    gate: 'B18',
    baggageClaim: 'Belt 32',
    weather: { temp: '31°C / 88°F', condition: 'Tropical breeze' },
  },
  {
    id: 'LIVE-AV-512',
    flightNumber: 'AV-512',
    airline: 'AeroVoyage European',
    airlineCode: 'AV',
    aircraft: 'Airbus A321neo',
    origin: POPULAR_AIRPORTS[5], // CDG Paris
    destination: POPULAR_AIRPORTS[0], // JFK New York
    departureDate: '2026-09-03',
    departureTime: '04:10 PM',
    arrivalTime: '06:50 PM',
    duration: '8h 40m',
    durationMinutes: 520,
    stops: 0,
    cabinClasses: {
      economy: { available: true, cashPrice: 710, pointsPrice: 47000, seatsLeft: 8 },
    },
    baggage: { carryOn: '1 Carry-on', checked: '2 Checked Bags' },
    amenities: { wifi: true, power: true, meal: true, entertainment: true, lieFlatSeats: true },
    status: 'On Time',
    terminal: '2E',
    gate: 'K44',
    baggageClaim: 'Carousel 7',
    weather: { temp: '24°C / 75°F', condition: 'Clear Skies' },
  },
];

export function generateMockFlights(
  originCode: string,
  destinationCode: string,
  departureDate: string,
  cabinClass: CabinClass = 'economy'
): Flight[] {
  const originAirport = POPULAR_AIRPORTS.find((a) => a.code === originCode) || {
    code: originCode,
    name: `${originCode} International`,
    city: originCode,
    country: 'Global',
    terminal: '1',
  };

  const destAirport = POPULAR_AIRPORTS.find((a) => a.code === destinationCode) || {
    code: destinationCode,
    name: `${destinationCode} International`,
    city: destinationCode,
    country: 'Global',
    terminal: '2',
  };

  return generateFlightsForRoute(originAirport, destAirport, departureDate);
}

