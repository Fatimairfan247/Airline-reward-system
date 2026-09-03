import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Plane, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Bell, 
  CloudSun, 
  MapPin, 
  Luggage, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Flight } from '../types/airline';
import { SEED_LIVE_FLIGHTS } from '../data/mockFlights';
import { POPULAR_AIRPORTS } from '../data/mockAirports';

interface FlightStatusTrackerProps {
  onSubscribeAlerts: (flightNumber: string) => void;
}

export const FlightStatusTracker: React.FC<FlightStatusTrackerProps> = ({
  onSubscribeAlerts,
}) => {
  const [searchType, setSearchType] = useState<'flight' | 'route'>('flight');
  const [flightNumberQuery, setFlightNumberQuery] = useState('AV-102');
  const [originCode, setOriginCode] = useState('JFK');
  const [destCode, setDestCode] = useState('LHR');
  const [flights, setFlights] = useState<Flight[]>(SEED_LIVE_FLIGHTS);
  const [subscribedFlights, setSubscribedFlights] = useState<string[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'flight') {
      const q = flightNumberQuery.trim().toUpperCase();
      const filtered = SEED_LIVE_FLIGHTS.filter((f) =>
        f.flightNumber.toUpperCase().includes(q)
      );
      setFlights(filtered.length > 0 ? filtered : SEED_LIVE_FLIGHTS);
    } else {
      const filtered = SEED_LIVE_FLIGHTS.filter(
        (f) => f.origin.code === originCode && f.destination.code === destCode
      );
      setFlights(filtered.length > 0 ? filtered : SEED_LIVE_FLIGHTS);
    }
  };

  const handleRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const toggleSubscribe = (flightNo: string) => {
    if (subscribedFlights.includes(flightNo)) {
      setSubscribedFlights(subscribedFlights.filter((f) => f !== flightNo));
    } else {
      setSubscribedFlights([...subscribedFlights, flightNo]);
      onSubscribeAlerts(flightNo);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Live Flight Radar &amp; Airport Tracker
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Real-Time Flight Status &amp; Airport Updates
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Monitor delays, departure gates, baggage carousels, airborne coordinates, and get instant travel alerts for any flight.
          </p>
        </div>

        {/* Search Input Card */}
        <div className="mt-6 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-3">
            <button
              type="button"
              onClick={() => setSearchType('flight')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                searchType === 'flight' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              By Flight Number
            </button>
            <button
              type="button"
              onClick={() => setSearchType('route')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                searchType === 'route' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              By Route (City to City)
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            {searchType === 'flight' ? (
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="e.g. AV-102, AV-304, AV-88"
                  value={flightNumberQuery}
                  onChange={(e) => setFlightNumberQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md placeholder:text-slate-500"
                />
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 gap-3">
                <select
                  value={originCode}
                  onChange={(e) => setOriginCode(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-3 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 cursor-pointer backdrop-blur-md"
                >
                  {POPULAR_AIRPORTS.map((a) => (
                    <option key={`stat-orig-${a.code}`} value={a.code} className="bg-slate-900 text-white">
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
                <select
                  value={destCode}
                  onChange={(e) => setDestCode(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-3 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 cursor-pointer backdrop-blur-md"
                >
                  {POPULAR_AIRPORTS.map((a) => (
                    <option key={`stat-dest-${a.code}`} value={a.code} className="bg-slate-900 text-white">
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all"
            >
              <Search className="w-4 h-4" />
              Check Status
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <span>Try sample flights:</span>
            {['AV-102 (In Flight)', 'AV-304 (Boarding)', 'AV-88 (Delayed)'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setSearchType('flight');
                  const code = sample.split(' ')[0];
                  setFlightNumberQuery(code);
                  setFlights(SEED_LIVE_FLIGHTS.filter((f) => f.flightNumber === code));
                }}
                className="underline hover:text-indigo-400 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white">
            Live Flight Status ({flights.length} active flights tracked)
          </h3>
          <p className="text-xs text-slate-400">Last radar refresh: {lastRefreshed}</p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-bold shadow-md transition-colors backdrop-blur-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Radar
        </button>
      </div>

      {/* Flight Status Cards */}
      <div className="space-y-4">
        {flights.map((flight) => {
          const isSubscribed = subscribedFlights.includes(flight.flightNumber);

          return (
            <div
              key={flight.id}
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl overflow-hidden"
            >
              {/* Card Top Banner */}
              <div className="p-5 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-indigo-400 flex items-center justify-center font-black shadow-sm">
                    {flight.airlineCode}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base">
                        {flight.airline}
                      </span>
                      <span className="text-sm font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/30 font-mono">
                        {flight.flightNumber}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{flight.aircraft}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                      flight.status === 'On Time'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : flight.status === 'Delayed'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : flight.status === 'Boarding'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse'
                        : flight.status === 'In Flight'
                        ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                        : 'bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {flight.status} {flight.delayMinutes ? `(+${flight.delayMinutes}m)` : ''}
                  </span>

                  {/* Subscribe Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSubscribe(flight.flightNumber)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSubscribed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {isSubscribed ? 'Alerts Active ✓' : 'Get Alerts'}
                  </button>
                </div>
              </div>

              {/* Card Mid: Flight Schedule & Gate Matrix */}
              <div className="p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  {/* Origin */}
                  <div className="sm:col-span-4 text-left">
                    <span className="text-3xl font-black text-white font-['Space_Grotesk']">
                      {flight.origin.code}
                    </span>
                    <div className="text-xs font-bold text-slate-200">{flight.origin.city}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Scheduled: <strong className="text-white">{flight.departureTime}</strong>
                    </div>
                  </div>

                  {/* Airborne Route Progress Line */}
                  <div className="sm:col-span-4 text-center">
                    <div className="text-xs font-bold text-slate-400 mb-1 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {flight.duration}
                    </div>

                    <div className="relative flex items-center justify-center my-2">
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                          style={{ width: `${flight.flightProgressPercent || (flight.status === 'Landed' ? 100 : flight.status === 'In Flight' ? 68 : 10)}%` }}
                        />
                      </div>
                      {flight.status === 'In Flight' && (
                        <div 
                          className="absolute -top-1.5 transform -translate-x-1/2"
                          style={{ left: `${flight.flightProgressPercent || 68}%` }}
                        >
                          <Plane className="w-5 h-5 text-indigo-400 rotate-90 bg-slate-950 rounded-full p-0.5 shadow-md" />
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400">
                      {flight.status === 'In Flight'
                        ? 'Cruising at 38,000 ft • 560 mph'
                        : flight.stops === 0
                        ? 'Non-stop route'
                        : flight.stopDetails}
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="sm:col-span-4 text-right">
                    <span className="text-3xl font-black text-white font-['Space_Grotesk']">
                      {flight.destination.code}
                    </span>
                    <div className="text-xs font-bold text-slate-200">{flight.destination.city}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Est. Arrival: <strong className="text-white">{flight.arrivalTime}</strong>
                    </div>
                  </div>
                </div>

                {/* Gate & Baggage Status Badges */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs backdrop-blur-md">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Terminal</span>
                    <span className="text-base font-black text-white">
                      Terminal {flight.terminal || '4'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Departure Gate</span>
                    <span className="text-base font-black text-amber-400">
                      Gate {flight.gate || 'B28'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Baggage Carousel</span>
                    <span className="text-base font-black text-white">
                      {flight.baggageClaim || 'Carousel 4'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Destination Weather</span>
                    <span className="text-xs font-extrabold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                      <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                      {flight.weather?.temp || '22°C'}
                    </span>
                  </div>
                </div>

                {/* Delay Notice Banner if delayed */}
                {flight.delayMinutes && flight.delayMinutes > 0 ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center gap-2 text-xs text-amber-200 backdrop-blur-md">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Flight Delay Advisory:</strong> Departures held approx 40 mins due to high-altitude air traffic congestion. Checked bags remain on schedule.
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
