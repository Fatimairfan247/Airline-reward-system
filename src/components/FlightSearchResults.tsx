import React, { useState, useMemo } from 'react';
import { 
  Plane, 
  Clock, 
  Wifi, 
  Zap, 
  Utensils, 
  Tv, 
  Luggage, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Info, 
  SlidersHorizontal, 
  Coins, 
  DollarSign,
  BedDouble,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CabinClass, Flight, PaymentMode, SearchParams } from '../types/airline';
import { POPULAR_AIRPORTS } from '../data/mockAirports';

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

interface FlightSearchResultsProps {
  flights: Flight[];
  searchParams?: SearchParams;
  criteria?: any;
  onSelectFlight: (flight: Flight, cabin: CabinClass) => void;
  userPointsBalance?: number;
  onModifySearch?: () => void;
}

export const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({
  flights = [],
  searchParams: passedParams,
  criteria,
  onSelectFlight,
  userPointsBalance = 0,
  onModifySearch,
}) => {
  const searchParams: SearchParams = useMemo(() => {
    if (passedParams) return passedParams;
    const originAirport = criteria?.origin && typeof criteria.origin === 'object'
      ? criteria.origin
      : POPULAR_AIRPORTS.find(a => a.code === criteria?.origin) || POPULAR_AIRPORTS[0];
    const destAirport = criteria?.destination && typeof criteria.destination === 'object'
      ? criteria.destination
      : POPULAR_AIRPORTS.find(a => a.code === criteria?.destination) || POPULAR_AIRPORTS[1];

    return {
      origin: originAirport,
      destination: destAirport,
      departureDate: criteria?.departureDate || DEFAULT_SEARCH_PARAMS.departureDate,
      returnDate: criteria?.returnDate || DEFAULT_SEARCH_PARAMS.returnDate,
      tripType: (criteria?.tripType === 'one_way' || criteria?.tripType === 'one-way') ? 'one-way' : 'round-trip',
      passengers: criteria?.passengers || DEFAULT_SEARCH_PARAMS.passengers,
      cabinClass: criteria?.cabinClass || DEFAULT_SEARCH_PARAMS.cabinClass,
      paymentMode: criteria?.payWithPoints ? 'points' : 'all',
    };
  }, [passedParams, criteria]);
  const [selectedSort, setSelectedSort] = useState<'value' | 'price' | 'duration' | 'departure'>('value');
  const [stopsFilter, setStopsFilter] = useState<'all' | 'nonstop' | '1stop'>('all');
  const [airlineFilter, setAirlineFilter] = useState<string>('all');
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  // Extract unique airlines
  const airlines = useMemo(() => {
    return Array.from(new Set(flights.map((f) => f.airline)));
  }, [flights]);

  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    return flights
      .filter((flight) => {
        if (stopsFilter === 'nonstop' && flight.stops > 0) return false;
        if (stopsFilter === '1stop' && flight.stops !== 1) return false;
        if (airlineFilter !== 'all' && flight.airline !== airlineFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const cabin = searchParams.cabinClass;
        const priceA = a.cabinClasses[cabin]?.cashPrice || 99999;
        const priceB = b.cabinClasses[cabin]?.cashPrice || 99999;

        if (selectedSort === 'price') {
          return priceA - priceB;
        }
        if (selectedSort === 'duration') {
          return a.durationMinutes - b.durationMinutes;
        }
        if (selectedSort === 'departure') {
          return a.departureTime.localeCompare(b.departureTime);
        }
        // 'value' sort: consider badge and price/duration ratio
        if (a.badge === 'Best Value') return -1;
        if (b.badge === 'Best Value') return 1;
        return priceA - priceB;
      });
  }, [flights, stopsFilter, airlineFilter, selectedSort, searchParams.cabinClass]);

  const cabinLabel = {
    economy: 'Economy',
    premium_economy: 'Premium Economy',
    business: 'Business Class',
    first: 'First Class',
  }[searchParams.cabinClass];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Route Header Banner */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 shadow-xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              {searchParams.origin.city} ({searchParams.origin.code})
            </span>
            <ArrowRight className="w-5 h-5 text-indigo-400" />
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              {searchParams.destination.city} ({searchParams.destination.code})
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-slate-400 font-medium">
            <span>📅 {searchParams.departureDate}</span>
            <span>•</span>
            <span>
              👤 {searchParams.passengers.adults + searchParams.passengers.children} Passenger
              {searchParams.passengers.adults + searchParams.passengers.children > 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span className="bg-white/10 border border-white/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold text-xs backdrop-blur-md">
              {cabinLabel}
            </span>
            {searchParams.tripType === 'round-trip' && (
              <>
                <span>•</span>
                <span>Return: {searchParams.returnDate}</span>
              </>
            )}
          </div>
        </div>

        {/* User points balance highlight */}
        <div className="bg-white/5 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-xs">
            ★
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Your SkyRewards Balance</div>
            <div className="text-sm font-extrabold text-amber-300">
              {userPointsBalance.toLocaleString()} SkyPoints
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filters:</span>
          </div>

          {/* Stops filter */}
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setStopsFilter('all')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                stopsFilter === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              All Stops
            </button>
            <button
              onClick={() => setStopsFilter('nonstop')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                stopsFilter === 'nonstop' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              Non-stop Only
            </button>
            <button
              onClick={() => setStopsFilter('1stop')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                stopsFilter === '1stop' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              1 Stop
            </button>
          </div>

          {/* Airline filter */}
          <select
            value={airlineFilter}
            onChange={(e) => setAirlineFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer backdrop-blur-md"
          >
            <option value="all" className="bg-slate-900 text-white">All Airlines ({airlines.length})</option>
            {airlines.map((air) => (
              <option key={air} value={air} className="bg-slate-900 text-white">
                {air}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Sort by:</span>
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setSelectedSort('value')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedSort === 'value' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              Best Value
            </button>
            <button
              onClick={() => setSelectedSort('price')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedSort === 'price' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cheapest
            </button>
            <button
              onClick={() => setSelectedSort('duration')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedSort === 'duration' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              Fastest
            </button>
          </div>
        </div>
      </div>

      {/* Flight Cards List */}
      {filteredFlights.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-xl">
          <Plane className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No flights matched your filter</h3>
          <p className="text-sm text-slate-400 mt-1">Try resetting the stops or airline filters above.</p>
          <button
            onClick={() => {
              setStopsFilter('all');
              setAirlineFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFlights.map((flight) => {
            const cabinPricing = flight.cabinClasses[searchParams.cabinClass];
            if (!cabinPricing || !cabinPricing.available) return null;

            const isExpanded = expandedDetailsId === flight.id;
            const canAffordWithPoints = userPointsBalance >= cabinPricing.pointsPrice;

            return (
              <div
                key={flight.id}
                id={`flight-card-${flight.flightNumber}`}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all shadow-xl overflow-hidden"
              >
                {/* Flight Card Body */}
                <div className="p-5 sm:p-6">
                  {/* Top Bar: Airline & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 text-indigo-400 flex items-center justify-center font-bold text-xs shadow-sm">
                        {flight.airlineCode}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm sm:text-base">
                            {flight.airline}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            • {flight.flightNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Aircraft: {flight.aircraft}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {flight.badge && (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            flight.badge === 'Best Value'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : flight.badge === 'Fastest'
                              ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                              : flight.badge === 'Cheapest'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          ★ {flight.badge}
                        </span>
                      )}
                      <span className="text-[11px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {cabinPricing.seatsLeft} seats left
                      </span>
                    </div>
                  </div>

                  {/* Flight Schedule & Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-5">
                    {/* Schedule Column */}
                    <div className="lg:col-span-7">
                      <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8">
                        {/* Departure */}
                        <div className="text-left">
                          <div className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Space_Grotesk']">
                            {flight.departureTime}
                          </div>
                          <div className="text-sm font-bold text-slate-200 mt-0.5">
                            {flight.origin.code}
                          </div>
                          <div className="text-xs text-slate-400">
                            {flight.origin.city} (T{flight.origin.terminal || '4'})
                          </div>
                        </div>

                        {/* Route Line & Duration */}
                        <div className="flex-1 max-w-[180px] sm:max-w-[220px] text-center">
                          <div className="text-xs font-bold text-slate-400 mb-1 flex items-center justify-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {flight.duration}
                          </div>
                          <div className="relative flex items-center justify-center">
                            <div className="w-full h-0.5 bg-white/20" />
                            <div className="absolute w-2 h-2 rounded-full bg-indigo-500 left-0" />
                            <Plane className="w-4 h-4 text-slate-200 rotate-90 mx-auto bg-slate-950 px-0.5 z-10 rounded-full" />
                            <div className="absolute w-2 h-2 rounded-full bg-emerald-400 right-0" />
                          </div>
                          <div className="text-[11px] font-semibold mt-1">
                            {flight.stops === 0 ? (
                              <span className="text-emerald-400 font-bold">Non-stop</span>
                            ) : (
                              <span className="text-amber-400 font-bold">{flight.stopDetails}</span>
                            )}
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Space_Grotesk']">
                            {flight.arrivalTime}
                          </div>
                          <div className="text-sm font-bold text-slate-200 mt-0.5">
                            {flight.destination.code}
                          </div>
                          <div className="text-xs text-slate-400">
                            {flight.destination.city} (T{flight.destination.terminal || '2'})
                          </div>
                        </div>
                      </div>

                      {/* Amenities & Baggage tags */}
                      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-white/10 text-xs text-slate-300">
                        <span className="inline-flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5 text-slate-400" />
                          {flight.baggage.checked}
                        </span>
                        {flight.amenities.wifi && (
                          <span className="inline-flex items-center gap-1">
                            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                            Starlink Wi-Fi
                          </span>
                        )}
                        {flight.amenities.power && (
                          <span className="inline-flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            65W Power
                          </span>
                        )}
                        {flight.amenities.meal && (
                          <span className="inline-flex items-center gap-1">
                            <Utensils className="w-3.5 h-3.5 text-slate-400" />
                            Dining
                          </span>
                        )}
                        {flight.amenities.lieFlatSeats && searchParams.cabinClass === 'business' && (
                          <span className="inline-flex items-center gap-1 text-indigo-400 font-bold">
                            <BedDouble className="w-3.5 h-3.5" />
                            180° Lie-Flat Pod
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Selection Column */}
                    <div className="lg:col-span-5 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Compare Cash & Points Display */}
                        {searchParams.paymentMode === 'cash' && (
                          <div>
                            <div className="text-xs font-semibold text-slate-400">Total Cash Price</div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                                ${cabinPricing.cashPrice}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">USD / person</span>
                            </div>
                            <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                              Earns +{Math.round(cabinPricing.cashPrice * 5)} SkyPoints
                            </p>
                          </div>
                        )}

                        {searchParams.paymentMode === 'points' && (
                          <div>
                            <div className="text-xs font-semibold text-slate-400">SkyRewards Redemption</div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-['Space_Grotesk']">
                                {cabinPricing.pointsPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">pts + $18 tax</span>
                            </div>
                            <div className="mt-1">
                              {canAffordWithPoints ? (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                                  <Check className="w-3.5 h-3.5" /> Points balance sufficient
                                </span>
                              ) : (
                                <span className="text-xs text-amber-300 font-semibold">
                                  Need {(cabinPricing.pointsPrice - userPointsBalance).toLocaleString()} more pts (Points + Cash available at checkout)
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {searchParams.paymentMode === 'all' && (
                          <div className="space-y-1.5">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase">Cash</span>
                                <div className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
                                  ${cabinPricing.cashPrice}
                                </div>
                              </div>
                              <span className="text-xs text-slate-400 font-bold">OR</span>
                              <div className="text-right">
                                <span className="text-[11px] font-bold text-amber-400 uppercase">SkyPoints</span>
                                <div className="text-xl sm:text-2xl font-black text-amber-400 font-['Space_Grotesk']">
                                  {cabinPricing.pointsPrice.toLocaleString()} <span className="text-xs font-normal">pts</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400 text-center">
                              Taxes &amp; airport fees included • Points + Cash slider at checkout
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedDetailsId(isExpanded ? null : flight.id)}
                          className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? 'Hide Details' : 'Flight Details'}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          id={`select-flight-${flight.flightNumber}-btn`}
                          onClick={() => onSelectFlight(flight, searchParams.cabinClass)}
                          className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
                        >
                          Select Flight
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Flight Details Drawer */}
                {isExpanded && (
                  <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 p-5 sm:p-6 animate-in slide-in-from-top-2 duration-150">
                    <h4 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-indigo-400" />
                      Fare Rules, Baggage &amp; Itinerary Breakdown
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Column 1: Baggage */}
                      <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <h5 className="font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Luggage className="w-3.5 h-3.5 text-indigo-400" />
                          Baggage Allowance
                        </h5>
                        <ul className="space-y-1.5 text-slate-300">
                          <li>• Personal item: fits under seat (max 7kg)</li>
                          <li>• Carry-on bag: {flight.baggage.carryOn}</li>
                          <li>• Checked baggage: {flight.baggage.checked}</li>
                          <li>• Additional baggage can be added during checkout</li>
                        </ul>
                      </div>

                      {/* Column 2: Fare Rules */}
                      <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <h5 className="font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          Flexibility &amp; Changes
                        </h5>
                        <ul className="space-y-1.5 text-slate-300">
                          <li>• 100% Risk-Free 24h cancellation guarantee</li>
                          <li>• Same-day flight changes allowed for Gold/Platinum</li>
                          <li>• Refundable to original payment method or airline voucher</li>
                          <li>• Seat selection available in next step</li>
                        </ul>
                      </div>

                      {/* Column 3: Transparent Taxes Breakdown */}
                      <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <h5 className="font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                          Taxes &amp; Fees Itemization
                        </h5>
                        <div className="space-y-1 text-slate-300">
                          <div className="flex justify-between">
                            <span>Base Airline Fare:</span>
                            <span className="font-semibold text-white">${Math.round(cabinPricing.cashPrice * 0.82)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>US Transportation Tax:</span>
                            <span className="font-semibold text-white">${Math.round(cabinPricing.cashPrice * 0.075)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Passenger Facility Charge:</span>
                            <span className="font-semibold text-white">$18.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Airport Security Fee (9/11):</span>
                            <span className="font-semibold text-white">$11.20</span>
                          </div>
                          <div className="flex justify-between border-t border-white/10 pt-1 font-bold text-white">
                            <span>Total (all fees included):</span>
                            <span>${cabinPricing.cashPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
