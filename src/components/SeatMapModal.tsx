import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Info, 
  Sparkles, 
  ShieldAlert, 
  Armchair, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { CabinClass, Seat, Traveler } from '../types/airline';
import { generateSeatMap } from '../data/mockSeats';

interface SeatAssignment {
  seatNumber: string;
  fee: number;
}

interface SeatMapModalProps {
  cabinClass: CabinClass;
  flightNumber: string;
  aircraft: string;
  travelers: Traveler[];
  onConfirmSeats: (seatAssignments: { [travelerId: string]: SeatAssignment }) => void;
  onClose: () => void;
}

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  cabinClass,
  flightNumber,
  aircraft,
  travelers,
  onConfirmSeats,
  onClose,
}) => {
  const [seats] = useState<Seat[]>(() => generateSeatMap(cabinClass));
  const [currentTravelerIdx, setCurrentTravelerIdx] = useState(0);

  // Map of travelerId -> { seatNumber, fee }
  const [assignedSeats, setAssignedSeats] = useState<Record<string, SeatAssignment>>(() => {
    const initial: Record<string, SeatAssignment> = {};
    travelers.forEach((t) => {
      if (t.seatNumber) {
        initial[t.id] = { seatNumber: t.seatNumber, fee: 0 };
      }
    });
    return initial;
  });

  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  const activeTraveler = travelers[currentTravelerIdx] || travelers[0];

  // Check if a seat is taken by another passenger in this booking
  const isSeatTakenByBooking = (seatId: string) => {
    return Object.entries(assignedSeats).some(
      ([tId, val]: [string, SeatAssignment]) => val.seatNumber === seatId && tId !== activeTraveler.id
    );
  };

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable || isSeatTakenByBooking(seat.id)) return;

    const newAssignments = {
      ...assignedSeats,
      [activeTraveler.id]: {
        seatNumber: seat.id,
        fee: seat.price,
      },
    };
    setAssignedSeats(newAssignments);

    // Auto-advance to next traveler if more exist and don't have seat yet
    if (currentTravelerIdx < travelers.length - 1) {
      setCurrentTravelerIdx(currentTravelerIdx + 1);
    }
  };

  // Group seats by row
  const rows: number[] = Array.from(new Set<number>(seats.map((s) => s.row))).sort((a, b) => a - b);

  const totalFees = (Object.values(assignedSeats) as SeatAssignment[]).reduce((acc: number, curr: SeatAssignment) => acc + curr.fee, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        id="seat-map-modal"
        className="bg-slate-900/90 backdrop-blur-2xl text-slate-100 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-black/80 border border-white/10 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-white/[0.03] backdrop-blur-md text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded border border-amber-500/30">
                Interactive Aircraft Fuselage
              </span>
              <span className="text-xs text-slate-400">• Flight {flightNumber}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Space_Grotesk'] mt-1 text-white">
              Select Your Seats ({aircraft})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passenger selection tabs */}
        <div className="bg-white/[0.02] px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Assigning for:</span>
            {travelers.map((t, idx) => {
              const assigned = assignedSeats[t.id]?.seatNumber;
              const isActive = idx === currentTravelerIdx;
              return (
                <button
                  key={t.id}
                  onClick={() => setCurrentTravelerIdx(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'bg-white/[0.05] text-slate-300 border border-white/10 hover:bg-white/[0.1]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {t.firstName || `Passenger ${idx + 1}`}
                  </span>
                  {assigned ? (
                    <span className="bg-slate-950 text-amber-400 px-1.5 py-0.2 rounded font-black text-[10px]">
                      {assigned}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px] font-medium">(No Seat)</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-slate-300">
            Total Seat Fees: <span className="text-emerald-400 text-sm font-extrabold">${totalFees}</span>
          </div>
        </div>

        {/* Legend bar */}
        <div className="bg-white/[0.01] px-6 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md border border-white/20 bg-white/5" />
            <span>Standard (Free)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md border border-sky-400/80 bg-sky-500/20" />
            <span>Extra Legroom ($25)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md border border-indigo-400/80 bg-indigo-500/20" />
            <span>Exit Row ($45)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[9px]">
              ✓
            </div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-white/10 text-slate-500 flex items-center justify-center text-[9px]">
              ✕
            </div>
            <span>Occupied</span>
          </div>
        </div>

        {/* Main Seat Map Visual Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/30 backdrop-blur-sm flex flex-col items-center">
          {/* Aircraft Nose / Cockpit */}
          <div className="w-64 h-14 bg-white/[0.04] border border-white/15 rounded-t-full flex items-center justify-center text-slate-400 text-xs font-bold mb-4 uppercase tracking-widest shadow-inner">
            ✈ Front / Cockpit
          </div>

          {/* Galley & Restrooms */}
          <div className="w-80 bg-white/[0.03] text-slate-300 text-[11px] font-bold py-1.5 rounded-lg text-center mb-4 border border-white/10">
            Front Galley &amp; Restrooms 🚻
          </div>

          {/* Fuselage Container */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-xl max-w-xl w-full">
            <div className="space-y-3">
              {rows.map((rowNum) => {
                const rowSeats = seats.filter((s) => s.row === rowNum);
                const isExitRow = rowSeats.some((s) => s.type === 'exit_row');

                return (
                  <div key={`row-${rowNum}`} className="relative">
                    {/* Exit Door Sign */}
                    {isExitRow && (
                      <div className="flex items-center justify-between text-[10px] font-bold text-amber-300 bg-amber-500/15 px-3 py-0.5 rounded border border-amber-500/30 mb-1.5">
                        <span>◀ Emergency Exit</span>
                        <span>Extra Legroom (+40")</span>
                        <span>Emergency Exit ▶</span>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2">
                      {/* Row number label */}
                      <span className="w-6 text-center text-xs font-extrabold text-slate-500">
                        {rowNum}
                      </span>

                      {/* Left Block */}
                      <div className="flex items-center gap-1.5">
                        {rowSeats.slice(0, cabinClass === 'business' ? 2 : 3).map((seat) => {
                          const isAssignedToActive = assignedSeats[activeTraveler.id]?.seatNumber === seat.id;
                          const isAssignedToOther = Object.entries(assignedSeats).some(
                            ([tId, val]: [string, SeatAssignment]) => val.seatNumber === seat.id && tId !== activeTraveler.id
                          );
                          const isTaken = !seat.isAvailable || isAssignedToOther;

                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={isTaken}
                              onClick={() => handleSeatClick(seat)}
                              onMouseEnter={() => setHoveredSeat(seat)}
                              className={`w-9 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-xs transition-all relative ${
                                isAssignedToActive
                                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-md font-black'
                                  : isTaken
                                  ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                                  : seat.type === 'exit_row'
                                  ? 'border border-indigo-400/70 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
                                  : seat.type === 'extra_legroom'
                                  ? 'border border-sky-400/70 bg-sky-500/20 text-sky-200 hover:bg-sky-500/30'
                                  : seat.type === 'lie_flat'
                                  ? 'border border-purple-400/70 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30'
                                  : 'border border-white/15 bg-white/5 text-slate-200 hover:border-amber-400 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-[11px] leading-none">{seat.id}</span>
                              {isTaken && <span className="text-[9px] leading-none mt-0.5">✕</span>}
                              {isAssignedToActive && <span className="text-[9px] leading-none mt-0.5">✓</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Center Aisle */}
                      <div className="w-8 flex items-center justify-center">
                        <div className="h-6 w-0.5 border-r border-dashed border-white/20" />
                      </div>

                      {/* Right Block */}
                      <div className="flex items-center gap-1.5">
                        {rowSeats.slice(cabinClass === 'business' ? 2 : 3).map((seat) => {
                          const isAssignedToActive = assignedSeats[activeTraveler.id]?.seatNumber === seat.id;
                          const isAssignedToOther = Object.entries(assignedSeats).some(
                            ([tId, val]: [string, SeatAssignment]) => val.seatNumber === seat.id && tId !== activeTraveler.id
                          );
                          const isTaken = !seat.isAvailable || isAssignedToOther;

                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={isTaken}
                              onClick={() => handleSeatClick(seat)}
                              onMouseEnter={() => setHoveredSeat(seat)}
                              className={`w-9 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-xs transition-all relative ${
                                isAssignedToActive
                                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-md font-black'
                                  : isTaken
                                  ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                                  : seat.type === 'exit_row'
                                  ? 'border border-indigo-400/70 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
                                  : seat.type === 'extra_legroom'
                                  ? 'border border-sky-400/70 bg-sky-500/20 text-sky-200 hover:bg-sky-500/30'
                                  : seat.type === 'lie_flat'
                                  ? 'border border-purple-400/70 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30'
                                  : 'border border-white/15 bg-white/5 text-slate-200 hover:border-amber-400 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-[11px] leading-none">{seat.id}</span>
                              {isTaken && <span className="text-[9px] leading-none mt-0.5">✕</span>}
                              {isAssignedToActive && <span className="text-[9px] leading-none mt-0.5">✓</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Row number label right */}
                      <span className="w-6 text-center text-xs font-extrabold text-slate-500">
                        {rowNum}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aircraft Tail */}
          <div className="w-48 bg-white/[0.04] text-slate-400 text-xs font-bold py-2 rounded-b-2xl text-center mt-4 border border-white/10">
            Rear Galley &amp; Lavatories ✈
          </div>
        </div>

        {/* Seat details preview hover card */}
        {hoveredSeat && (
          <div className="bg-white/[0.04] backdrop-blur-md text-white px-6 py-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm">
                {hoveredSeat.id}
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>
                    {hoveredSeat.type === 'exit_row'
                      ? 'Exit Row Seat (Extra Legroom)'
                      : hoveredSeat.type === 'extra_legroom'
                      ? 'Preferred Extra Legroom Seat'
                      : hoveredSeat.type === 'lie_flat'
                      ? 'Lie-Flat Suite'
                      : 'Standard Cabin Seat'}
                  </span>
                  <span className="text-amber-400 font-extrabold">
                    {hoveredSeat.price > 0 ? `+$${hoveredSeat.price}` : 'Complimentary'}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  {hoveredSeat.features.join(' • ')}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Click seat to assign to <strong className="text-white">{activeTraveler.firstName || 'passenger'}</strong>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-white/[0.03] backdrop-blur-md p-4 sm:p-5 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Selected:{' '}
            {travelers.map((t) => (
              <span key={t.id} className="font-bold text-white mr-2">
                {t.firstName || 'Traveler'}: <span className="text-amber-400">{assignedSeats[t.id]?.seatNumber || 'Unassigned'}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/20 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              id="confirm-seat-map-btn"
              onClick={() => {
                onConfirmSeats(assignedSeats);
                onClose();
              }}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Confirm Seat Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
