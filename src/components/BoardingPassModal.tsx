import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Plane, 
  QrCode, 
  ShieldCheck, 
  Luggage, 
  Clock, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { Booking } from '../types/airline';

interface BoardingPassModalProps {
  booking: Booking;
  onClose: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({
  booking,
  onClose,
}) => {
  const traveler = booking.travelers[0] || { firstName: 'Fatima', lastName: 'Irfan', seatNumber: '2A' };
  const flight = booking.flight;

  const handlePrint = () => {
    window.print();
  };

  const handleAppleWallet = () => {
    alert('Simulated: Boarding pass downloaded to Apple Wallet (.pkpass) / Google Wallet!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        id="boarding-pass-modal"
        className="bg-slate-900/90 backdrop-blur-2xl text-slate-100 rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl shadow-black/80 border border-white/10 overflow-hidden"
      >
        {/* Top Control Bar */}
        <div className="bg-white/[0.03] backdrop-blur-md text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
              BP
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Official Electronic Boarding Pass
              </h3>
              <p className="text-[11px] text-slate-400">
                IATA Compliant • PNR: <strong className="text-amber-400">{booking.id}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors border border-white/10"
              title="Print Pass"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleAppleWallet}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-400 border border-white/10 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Save Pass
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-white/10 ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-center bg-slate-950/20">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative print:border-none print:shadow-none">
            {/* Top Navy Airline Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Plane className="w-5 h-5 rotate-45" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold tracking-wider font-['Space_Grotesk'] text-white">
                    AEROVOYAGE <span className="text-amber-400">SKYSUITE</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-amber-300 tracking-widest">
                    {booking.cabinClass === 'business' || booking.cabinClass === 'first' ? 'SkyPriority Business' : 'Economy Global'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Boarding Pass</span>
                <span className="text-xs font-extrabold text-white bg-white/10 px-2.5 py-1 rounded-md border border-white/15 font-mono">
                  {booking.id}
                </span>
              </div>
            </div>

            {/* Main Pass Details */}
            <div className="p-6 sm:p-7 space-y-6">
              {/* Route Display */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Space_Grotesk']">
                    {flight.origin.code}
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-0.5">
                    {flight.origin.city}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Terminal {flight.origin.terminal || '4'}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-slate-500 mb-1">
                    {flight.duration} Non-stop
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 sm:w-16 h-0.5 bg-slate-300" />
                    <Plane className="w-5 h-5 text-amber-500 rotate-90" />
                    <div className="w-12 sm:w-16 h-0.5 bg-slate-300" />
                  </div>
                  <span className="text-[10px] text-amber-600 font-extrabold uppercase mt-1">
                    Flight {flight.flightNumber}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Space_Grotesk']">
                    {flight.destination.code}
                  </div>
                  <div className="text-xs font-bold text-slate-600 mt-0.5">
                    {flight.destination.city}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Terminal {flight.destination.terminal || '2'}
                  </div>
                </div>
              </div>

              {/* Passenger & Flight Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Passenger</span>
                  <span className="text-sm font-black text-slate-900 block truncate">
                    {traveler.lastName.toUpperCase()}/{traveler.firstName.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500">{traveler.title || 'Mr.'}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date</span>
                  <span className="text-sm font-black text-slate-900 block">
                    {flight.departureDate}
                  </span>
                  <span className="text-[10px] text-slate-500">Departure</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Boarding Time</span>
                  <span className="text-sm font-black text-amber-600 block">
                    {flight.departureTime}
                  </span>
                  <span className="text-[10px] text-slate-500">Gates close 15m prior</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Boarding Group</span>
                  <span className="text-sm font-black text-slate-900 block">
                    {booking.boardingGroup || 'Group 1'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Priority Zone</span>
                </div>
              </div>

              {/* Gate, Terminal, Seat Big Badges */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-3 gap-3 text-center">
                <div className="border-r border-slate-200 pr-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Gate</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-['Space_Grotesk']">
                    {flight.gate || 'B28'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Terminal {flight.terminal || '4'}</span>
                </div>

                <div className="border-r border-slate-200 pr-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Seat</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-600 font-['Space_Grotesk']">
                    {traveler.seatNumber || '2A'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Window / Suite</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Baggage Belt</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Space_Grotesk']">
                    {flight.baggageClaim || 'Belt 4'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Destination claim</span>
                </div>
              </div>

              {/* Perforated Divider Simulation */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="w-full border-b-2 border-dashed border-slate-300" />
                <div className="absolute -left-9 w-6 h-6 rounded-full bg-slate-900 border-r border-white/10" />
                <div className="absolute -right-9 w-6 h-6 rounded-full bg-slate-900 border-l border-white/10" />
              </div>

              {/* Barcode & Security Stamp */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                {/* 2D Aztec Barcode Visual */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-950 text-white rounded-xl p-2 flex items-center justify-center shadow-inner border border-white/10">
                    <QrCode className="w-16 h-16 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Electronic Security Token</span>
                    <span className="text-xs font-mono text-slate-700 block tracking-tight">
                      {booking.barcode.substring(0, 36)}...
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> TSA PreCheck Verified
                    </span>
                  </div>
                </div>

                {/* Mobile Wallet Badge */}
                <div className="text-center sm:text-right">
                  <button
                    onClick={handleAppleWallet}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
                  >
                    <span>Add to Apple Wallet</span>
                  </button>
                  <span className="text-[9px] text-slate-400 block mt-1">or Google Wallet</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.03] backdrop-blur-md p-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Show this pass on your phone or printed copy at security &amp; boarding gate.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
