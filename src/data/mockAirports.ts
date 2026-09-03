import { Airport } from '../types/airline';

export const POPULAR_AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States', terminal: '4', gate: 'B28', baggageClaim: 'Carousel 7' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', terminal: '5', gate: 'A14', baggageClaim: 'Belt 4' },
  { code: 'HND', name: 'Haneda Tokyo Airport', city: 'Tokyo', country: 'Japan', terminal: '3', gate: '112', baggageClaim: 'Carousel 2' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', terminal: '3', gate: 'B12', baggageClaim: 'Carousel 19' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', terminal: '2', gate: 'E4', baggageClaim: 'Belt 32' },
  { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France', terminal: '2E', gate: 'K31', baggageClaim: 'Carousel 5' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States', terminal: 'Intl G', gate: 'G98', baggageClaim: 'Carousel 9' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States', terminal: 'B (TBIT)', gate: '150', baggageClaim: 'Carousel 1' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', terminal: '1', gate: 'Z58', baggageClaim: 'Hall B' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', terminal: '1', gate: '33', baggageClaim: 'Belt 6' },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', terminal: 'Main', gate: 'C22', baggageClaim: 'Carousel 8' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', terminal: 'Departures 3', gate: 'F7', baggageClaim: 'Carousel 14' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'United States', terminal: '5', gate: 'M16', baggageClaim: 'Belt 3' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', terminal: 'Airside Center', gate: 'E26', baggageClaim: 'Carousel 11' },
];

export const POPULAR_ROUTES = [
  { origin: 'JFK', destination: 'LHR', label: 'New York to London', tag: 'Top International' },
  { origin: 'SFO', destination: 'HND', label: 'San Francisco to Tokyo', tag: 'Pacific Premier' },
  { origin: 'DXB', destination: 'SIN', label: 'Dubai to Singapore', tag: 'Luxury Corridor' },
  { origin: 'LAX', destination: 'CDG', label: 'Los Angeles to Paris', tag: 'Best Rewards Value' },
  { origin: 'LHR', destination: 'DXB', label: 'London to Dubai', tag: 'Frequent Express' },
];
