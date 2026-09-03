import React, { useState } from 'react';
import { 
  Plane, 
  ArrowRightLeft, 
  Calendar, 
  Users, 
  Sparkles, 
  Coins, 
  DollarSign, 
  ShieldCheck, 
  MapPin, 
  ChevronDown 
} from 'lucide-react';
import { Airport, CabinClass, PaymentMode, SearchParams } from '../types/airline';
import { POPULAR_AIRPORTS, POPULAR_ROUTES } from '../data/mockAirports';

const DEFAULT_SEARCH_PARAMS: SearchParams = {
  origin: POPULAR_AIRPORTS[0],
  destination: POPULAR_AIRPORTS[1],
  departureDate: '2026-09-18',
  returnDate: '2026-09-25',
  tripType: 'round-trip',
  passengers: { adults: 1, children: 0, infants: 0 },
  cabinClass: 'economy',
  paymentMode: 'all',
};

interface FlightSearchHeroProps {
  onSearch: (params: SearchParams) => void;
  currentParams?: SearchParams;
  initialCriteria?: any;
  rewardsBalance?: number;
  rewardsUser?: any;
  userName?: string;
  onNavigateTab?: (tab: 'search' | 'status' | 'dashboard' | 'rewards') => void;
}

export const FlightSearchHero: React.FC<FlightSearchHeroProps> = ({
  onSearch,
  currentParams,
  initialCriteria,
  rewardsBalance,
  rewardsUser,
  userName = 'Fatima Irfan',
  onNavigateTab,
}) => {
  const initial = currentParams || {
    ...DEFAULT_SEARCH_PARAMS,
    ...(initialCriteria ? {
      tripType: (initialCriteria.tripType === 'one_way' || initialCriteria.tripType === 'one-way') ? 'one-way' : 'round-trip',
      origin: typeof initialCriteria.origin === 'object' 
        ? initialCriteria.origin 
        : (POPULAR_AIRPORTS.find(a => a.code === initialCriteria.origin) || POPULAR_AIRPORTS[0]),
      destination: typeof initialCriteria.destination === 'object'
        ? initialCriteria.destination
        : (POPULAR_AIRPORTS.find(a => a.code === initialCriteria.destination) || POPULAR_AIRPORTS[1]),
      departureDate: initialCriteria.departureDate || DEFAULT_SEARCH_PARAMS.departureDate,
      returnDate: initialCriteria.returnDate || DEFAULT_SEARCH_PARAMS.returnDate,
      passengers: initialCriteria.passengers || DEFAULT_SEARCH_PARAMS.passengers,
      cabinClass: initialCriteria.cabinClass || DEFAULT_SEARCH_PARAMS.cabinClass,
      paymentMode: initialCriteria.payWithPoints ? 'points' : 'all',
    } : {})
  };

  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>(
    initial.tripType === 'one-way' ? 'one-way' : 'round-trip'
  );
  const [origin, setOrigin] = useState<Airport>(initial.origin || POPULAR_AIRPORTS[0]);
  const [destination, setDestination] = useState<Airport>(initial.destination || POPULAR_AIRPORTS[1]);
  const [departureDate, setDepartureDate] = useState<string>(initial.departureDate || '2026-09-18');
  const [returnDate, setReturnDate] = useState<string>(initial.returnDate || '2026-09-25');
  const [cabinClass, setCabinClass] = useState<CabinClass>(initial.cabinClass || 'economy');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(initial.paymentMode || 'all');
  
  const [adults, setAdults] = useState<number>(initial.passengers?.adults ?? 1);
  const [children, setChildren] = useState<number>(initial.passengers?.children ?? 0);
  const [showPassengerMenu, setShowPassengerMenu] = useState(false);

  // Swap airports
  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      tripType,
      passengers: { adults, children, infants: 0 },
      cabinClass,
      paymentMode,
    });
  };

  const handleSelectQuickRoute = (origCode: string, destCode: string) => {
    const o = POPULAR_AIRPORTS.find((a) => a.code === origCode) || POPULAR_AIRPORTS[0];
    const d = POPULAR_AIRPORTS.find((a) => a.code === destCode) || POPULAR_AIRPORTS[1];
    setOrigin(o);
    setDestination(d);
    onSearch({
      origin: o,
      destination: d,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      tripType,
      passengers: { adults, children, infants: 0 },
      cabinClass,
      paymentMode,
    });
  };

  const totalPassengers = adults + children;

  return (
    <div className="relative bg-transparent text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Best-in-Class Redemptions • Cash, SkyPoints &amp; Hybrid
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Where luxury meets effortless travel.
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Search, compare, and book worldwide flights with guaranteed transparent pricing, zero hidden fees, and instant boarding pass access.
          </p>
        </div>

        {/* Member Welcome Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 mb-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-xs max-w-4xl mx-auto shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white font-black text-xs flex items-center justify-center shadow-md">
              FI
            </div>
            <div>
              <div className="text-white font-semibold flex items-center gap-2">
                <span>Welcome back, <strong className="font-extrabold text-amber-300">{userName || rewardsUser?.name || 'Fatima Irfan'}</strong></span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] border border-amber-400/30">
                  {rewardsUser?.tier || 'Gold'} Tier Member
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                SkyRewards ID: <span className="font-mono text-slate-300">{rewardsUser?.memberNumber || 'AV-982-140-GLD'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">SkyPoints</span>
              <span className="text-amber-400 font-black font-mono text-sm">
                {(rewardsUser?.pointsBalance ?? rewardsBalance ?? 48500).toLocaleString()} pts
              </span>
            </div>
            {onNavigateTab && (
              <button
                type="button"
                id="hero-go-to-trips-btn"
                onClick={() => onNavigateTab('dashboard')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all"
              >
                My Trips &amp; Profile →
              </button>
            )}
          </div>
        </div>

        {/* Search Panel Card */}
        <div 
          id="flight-search-container"
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-7"
        >
          {/* Top Options Bar: Trip type + Payment mode */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
            {/* Trip Type Tabs */}
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                id="trip-roundtrip-btn"
                onClick={() => setTripType('round-trip')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tripType === 'round-trip'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Round Trip
              </button>
              <button
                type="button"
                id="trip-oneway-btn"
                onClick={() => setTripType('one-way')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tripType === 'one-way'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                One Way
              </button>
            </div>

            {/* Payment Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">
                Pay with:
              </span>
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  id="pay-all-compare-btn"
                  onClick={() => setPaymentMode('all')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    paymentMode === 'all'
                      ? 'bg-white/15 text-white shadow-sm border border-white/20'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Compare Cash &amp; Points
                </button>
                <button
                  type="button"
                  id="pay-cash-btn"
                  onClick={() => setPaymentMode('cash')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    paymentMode === 'cash'
                      ? 'bg-white/15 text-emerald-400 shadow-sm border border-white/20'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Cash ($)
                </button>
                <button
                  type="button"
                  id="pay-points-btn"
                  onClick={() => setPaymentMode('points')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    paymentMode === 'points'
                      ? 'bg-white/15 text-amber-300 shadow-sm border border-white/20'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  SkyPoints
                </button>
              </div>
            </div>
          </div>

          {/* Search Inputs Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
              {/* Origin Airport */}
              <div className="md:col-span-3 relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Departure City / Airport
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                  </div>
                  <select
                    id="origin-airport-select"
                    value={origin.code}
                    onChange={(e) => {
                      const found = POPULAR_AIRPORTS.find((a) => a.code === e.target.value);
                      if (found) setOrigin(found);
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-9 pr-8 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer backdrop-blur-md"
                  >
                    {POPULAR_AIRPORTS.map((a) => (
                      <option key={`orig-${a.code}`} value={a.code} disabled={a.code === destination.code} className="bg-slate-900 text-white">
                        {a.city} ({a.code}) - {a.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-center justify-center -my-2 md:my-0">
                <button
                  type="button"
                  id="swap-airports-btn"
                  onClick={handleSwapAirports}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-400 hover:text-indigo-300 flex items-center justify-center shadow-md transition-transform hover:rotate-180 duration-300 backdrop-blur-md"
                  title="Swap Origin & Destination"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Airport */}
              <div className="md:col-span-3 relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Arrival Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <select
                    id="destination-airport-select"
                    value={destination.code}
                    onChange={(e) => {
                      const found = POPULAR_AIRPORTS.find((a) => a.code === e.target.value);
                      if (found) setDestination(found);
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-9 pr-8 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer backdrop-blur-md"
                  >
                    {POPULAR_AIRPORTS.map((a) => (
                      <option key={`dest-${a.code}`} value={a.code} disabled={a.code === origin.code} className="bg-slate-900 text-white">
                        {a.city} ({a.code}) - {a.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Departure Date */}
              <div className={tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-3'}>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Departure Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="departure-date-input"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-9 pr-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Return Date (if round trip) */}
              {tripType === 'round-trip' && (
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Return Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      id="return-date-input"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-9 pr-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Second Row: Passengers, Cabin Class & Submit CTA */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 pt-2">
              {/* Passengers Dropdown */}
              <div className="md:col-span-4 relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Travelers
                </label>
                <button
                  type="button"
                  id="passengers-selector-btn"
                  onClick={() => setShowPassengerMenu(!showPassengerMenu)}
                  className="w-full bg-white/5 border border-white/10 text-left text-white rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-between hover:bg-white/10 transition-colors backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>
                      {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''} ({adults} Adult{adults > 1 ? 's' : ''}
                      {children > 0 ? `, ${children} Child` : ''})
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showPassengerMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Adults</div>
                        <div className="text-[11px] text-slate-400">Age 12+</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 disabled:opacity-40 text-white font-bold flex items-center justify-center hover:bg-white/20"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{adults}</span>
                        <button
                          type="button"
                          disabled={adults >= 8}
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <div>
                        <div className="text-xs font-bold text-white">Children</div>
                        <div className="text-[11px] text-slate-400">Age 2-11</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={children <= 0}
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 disabled:opacity-40 text-white font-bold flex items-center justify-center hover:bg-white/20"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{children}</span>
                        <button
                          type="button"
                          disabled={children >= 6}
                          onClick={() => setChildren(children + 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPassengerMenu(false)}
                      className="w-full mt-2 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Cabin Class */}
              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Cabin Class
                </label>
                <div className="relative">
                  <select
                    id="cabin-class-select"
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer backdrop-blur-md"
                  >
                    <option value="economy" className="bg-slate-900 text-white">Economy Standard</option>
                    <option value="premium_economy" className="bg-slate-900 text-white">Premium Economy (Extra Space)</option>
                    <option value="business" className="bg-slate-900 text-white">Business Class SkySuite</option>
                    <option value="first" className="bg-slate-900 text-white">First Class Luxury Suite</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Search Flights CTA Button */}
              <div className="md:col-span-4 flex items-end">
                <button
                  type="submit"
                  id="search-flights-submit-btn"
                  className="w-full h-[48px] bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform active:scale-[0.99]"
                >
                  <Plane className="w-4 h-4" />
                  Search Flights &amp; Rates
                </button>
              </div>
            </div>
          </form>

          {/* Popular Routes Quick Selector */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">
              Popular Routes:
            </span>
            {POPULAR_ROUTES.map((route) => (
              <button
                key={`${route.origin}-${route.destination}`}
                type="button"
                onClick={() => handleSelectQuickRoute(route.origin, route.destination)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors backdrop-blur-md"
              >
                <span>{route.origin}</span>
                <span className="text-indigo-400">✈</span>
                <span>{route.destination}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({route.tag})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits banner */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-indigo-400 font-bold text-sm">Flexible Booking</div>
            <div className="text-slate-400 text-xs mt-0.5">Free 24h cancellation &amp; fee-free changes</div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-emerald-400 font-bold text-sm">SkyRewards Guarantee</div>
            <div className="text-slate-400 text-xs mt-0.5">Earn 5x points on cash or redeem miles anytime</div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-indigo-400 font-bold text-sm">Transparent Fares</div>
            <div className="text-slate-400 text-xs mt-0.5">Taxes, baggage &amp; seat fees itemized upfront</div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-emerald-400 font-bold text-sm">Instant E-Tickets</div>
            <div className="text-slate-400 text-xs mt-0.5">Apple Wallet &amp; printable PDF boarding passes</div>
          </div>
        </div>
      </div>
    </div>
  );
};
