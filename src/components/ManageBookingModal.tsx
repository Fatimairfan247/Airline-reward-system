import React, { useState } from 'react';
import { 
  X, 
  Ticket, 
  Plane, 
  Luggage, 
  Utensils, 
  AlertTriangle, 
  Check, 
  FileText, 
  DollarSign, 
  Coins, 
  ShieldCheck, 
  ArrowRight,
  Armchair
} from 'lucide-react';
import { Booking, CabinClass } from '../types/airline';
import { SeatMapModal } from './SeatMapModal';

interface ManageBookingModalProps {
  booking: Booking;
  onUpdateBooking: (updated: Booking) => void;
  onCancelBooking: (bookingId: string, refundMethod: 'points' | 'cash' | 'voucher') => void;
  onOpenBoardingPass: (booking: Booking) => void;
  onClose: () => void;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  booking,
  onUpdateBooking,
  onCancelBooking,
  onOpenBoardingPass,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'seats' | 'meals' | 'baggage' | 'cancel'>('details');
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(booking.travelers[0]?.mealPreference || 'Chef Signature / Standard');
  const [mealSaved, setMealSaved] = useState(false);
  const [addedBags, setAddedBags] = useState(booking.baggageAddons.extraBags);
  const [baggageSaved, setBaggageSaved] = useState(false);
  const [refundMethod, setRefundMethod] = useState<'cash' | 'points' | 'voucher'>('cash');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const traveler = booking.travelers[0];
  const flight = booking.flight;

  const handleSaveMeal = () => {
    const updated = { ...booking };
    updated.travelers[0].mealPreference = selectedMeal;
    onUpdateBooking(updated);
    setMealSaved(true);
    setTimeout(() => setMealSaved(false), 2500);
  };

  const handleSaveBaggage = () => {
    const updated = { ...booking };
    const diff = addedBags - updated.baggageAddons.extraBags;
    updated.baggageAddons.extraBags = addedBags;
    updated.baggageAddons.cost += diff * 40;
    updated.fareBreakdown.baggageFees += diff * 40;
    updated.fareBreakdown.cashPaid += diff * 40;
    onUpdateBooking(updated);
    setBaggageSaved(true);
    setTimeout(() => setBaggageSaved(false), 2500);
  };

  const handleSeatChangeConfirm = (seatAssignments: { [travelerId: string]: { seatNumber: string; fee: number } }) => {
    const updated = { ...booking };
    updated.travelers = updated.travelers.map((t) => {
      if (seatAssignments[t.id]) {
        return { ...t, seatNumber: seatAssignments[t.id].seatNumber };
      }
      return t;
    });
    onUpdateBooking(updated);
  };

  const handleCancelFlight = () => {
    onCancelBooking(booking.id, refundMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        id="manage-booking-modal"
        className="bg-slate-900/90 backdrop-blur-2xl text-slate-100 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-black/80 border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white/[0.03] backdrop-blur-md text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded border border-amber-500/30">
                Manage Reservation
              </span>
              <span className="text-xs text-slate-400">• PNR: <strong className="text-white font-mono">{booking.id}</strong></span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Space_Grotesk'] mt-1 text-white">
              {flight.origin.code} ➔ {flight.destination.code} ({flight.airline} {flight.flightNumber})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/[0.02] px-6 py-2.5 border-b border-white/10 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'details' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Itinerary &amp; Receipt
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'seats' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Change Seat ({traveler?.seatNumber || '2A'})
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'meals' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Special Meals
          </button>
          <button
            onClick={() => setActiveTab('baggage')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'baggage' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Add Baggage
          </button>
          <button
            onClick={() => setActiveTab('cancel')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'cancel' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            Cancel &amp; Refund
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: DETAILS & RECEIPT */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Status Banner */}
              <div className="bg-white/[0.04] backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      booking.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : booking.status === 'checked-in'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      ● Status: {booking.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">Booked on {booking.bookingDate}</span>
                  </div>
                  <h4 className="text-lg font-black text-white mt-1">
                    {flight.origin.city} ({flight.origin.code}) to {flight.destination.city} ({flight.destination.code})
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Terminal {flight.terminal || '4'} • Gate {flight.gate || 'B28'} • Aircraft: {flight.aircraft}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenBoardingPass(booking)}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
                  >
                    <Ticket className="w-4 h-4" />
                    Open Boarding Pass
                  </button>
                </div>
              </div>

              {/* Itemized E-Ticket Receipt */}
              <div className="bg-white/[0.03] backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <h5 className="font-extrabold text-sm text-white">Official Electronic Ticket Receipt</h5>
                  </div>
                  <span className="text-xs font-mono text-slate-400">ETKT: 014-9842109841</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 py-2 border-b border-white/10">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Passenger</span>
                    <span className="font-bold text-white">{traveler?.firstName} {traveler?.lastName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Cabin Class</span>
                    <span className="font-bold text-white capitalize">{booking.cabinClass.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Seat</span>
                    <span className="font-bold text-amber-400">{traveler?.seatNumber || '2A'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Payment Type</span>
                    <span className="font-bold text-white uppercase">{booking.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Airfare:</span>
                    <span className="font-semibold text-white">${booking.fareBreakdown.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Government Aviation &amp; Security Fees:</span>
                    <span className="font-semibold text-white">${booking.fareBreakdown.taxesAndFees}</span>
                  </div>
                  {booking.fareBreakdown.seatFees > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Seat Selection:</span>
                      <span className="font-semibold text-emerald-400">+${booking.fareBreakdown.seatFees}</span>
                    </div>
                  )}
                  {booking.fareBreakdown.baggageFees > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Add-on Baggage:</span>
                      <span className="font-semibold text-emerald-400">+${booking.fareBreakdown.baggageFees}</span>
                    </div>
                  )}
                  {booking.fareBreakdown.pointsUsed > 0 && (
                    <div className="flex justify-between text-amber-400 font-bold">
                      <span>SkyRewards Points Applied:</span>
                      <span>{booking.fareBreakdown.pointsUsed.toLocaleString()} pts</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-2 font-black text-sm text-white">
                    <span>Total Cash Paid:</span>
                    <span className="text-amber-400">${booking.fareBreakdown.cashPaid} USD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEATS */}
          {activeTab === 'seats' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Armchair className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">
                  Current Assigned Seat: <span className="text-amber-400">{traveler?.seatNumber || '2A'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  You can change your seat anytime up to 1 hour before departure. Open the fuselage map to view available window, aisle, or extra legroom seats.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSeatMapOpen(true)}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Open Aircraft Seat Map
              </button>
            </div>
          )}

          {/* TAB 3: MEALS */}
          {activeTab === 'meals' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-extrabold text-sm text-white">Select In-Flight Dining Preference</h4>
                  <p className="text-xs text-slate-400">Chef-curated complimentary hot meals served on flight.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Chef Signature / Standard', title: 'Chef Signature / Standard', desc: 'Seasonal gourmet chicken or beef with organic greens & dessert' },
                  { id: 'Vegetarian Lacto-Ovo', title: 'Vegetarian Lacto-Ovo', desc: 'Plant-based with cheese, milk and egg ingredients' },
                  { id: 'Vegan Strict', title: 'Strict Vegan', desc: 'No animal products, dairy, or honey' },
                  { id: 'Gluten Intolerant', title: 'Gluten-Free Option', desc: 'Prepared with certified gluten-free grains' },
                  { id: 'Halal Certified', title: 'Halal Certified Meal', desc: 'Prepared according to Islamic dietary laws' },
                  { id: 'Kosher Meal', title: 'Kosher Meal', desc: 'Prepared under rabbinical supervision with double sealed packaging' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMeal(m.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedMeal === m.id
                        ? 'bg-amber-500/15 border-amber-400/80 ring-1 ring-amber-400/30 text-white'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{m.title}</span>
                      {selectedMeal === m.id && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveMeal}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  Save Meal Preference
                </button>
                {mealSaved && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                    <Check className="w-4 h-4" /> Preference updated!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: BAGGAGE */}
          {activeTab === 'baggage' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <Luggage className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-extrabold text-sm text-white">Manage Checked Baggage</h4>
                  <p className="text-xs text-slate-400">Each additional checked bag holds up to 23kg (50 lbs).</p>
                </div>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400">Current Extra Checked Bags:</span>
                  <div className="text-xl font-black text-white mt-0.5">{addedBags} bag{addedBags !== 1 ? 's' : ''}</div>
                  <span className="text-[11px] text-slate-400">Included standard: {flight.baggage.checked}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={addedBags <= 0}
                    onClick={() => setAddedBags(Math.max(0, addedBags - 1))}
                    className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 font-bold text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-black text-base w-4 text-center text-white">{addedBags}</span>
                  <button
                    type="button"
                    disabled={addedBags >= 4}
                    onClick={() => setAddedBags(addedBags + 1)}
                    className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 font-bold text-white hover:bg-white/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveBaggage}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  Update Baggage
                </button>
                {baggageSaved && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                    <Check className="w-4 h-4" /> Baggage allowance updated!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CANCEL & REFUND */}
          {activeTab === 'cancel' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-rose-950/40 border border-rose-500/30 p-5 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sm text-rose-200">Flight Cancellation &amp; Refund Request</h4>
                  <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                    Cancelling your flight will immediately release your seats ({traveler?.seatNumber || '2A'}) and void your boarding pass.
                    Refunds are calculated according to fare rules and processed instantly.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Refund Option
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer">
                    <input
                      type="radio"
                      name="refund"
                      checked={refundMethod === 'voucher'}
                      onChange={() => setRefundMethod('voucher')}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          110% AeroVoyage Travel Voucher (Best Value)
                        </span>
                        <span className="text-xs font-black text-emerald-400">+10% Bonus Credit</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Receive instant flight voucher valid for 24 months on any route with zero blackout dates.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer">
                    <input
                      type="radio"
                      name="refund"
                      checked={refundMethod === 'cash'}
                      onChange={() => setRefundMethod('cash')}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          Refund to Original Payment Method
                        </span>
                        <span className="text-xs font-semibold text-slate-300">3-5 business days</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Credit back to your credit card or SkyRewards points balance.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {!showCancelConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                >
                  Proceed to Cancel Flight
                </button>
              ) : (
                <div className="bg-rose-950/60 border border-rose-500/40 p-4 rounded-xl space-y-3 animate-in fade-in">
                  <div className="text-xs font-bold text-rose-200">
                    Are you sure you want to cancel booking <strong>{booking.id}</strong>? This action cannot be undone.
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCancelFlight}
                      className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-xl shadow-sm"
                    >
                      Yes, Cancel Flight &amp; Issue Refund
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-4 py-2.5 bg-white/10 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/20"
                    >
                      Keep My Flight
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white/[0.03] backdrop-blur-md p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors border border-white/10"
          >
            Close
          </button>
        </div>

        {/* Seat Map Submodal */}
        {isSeatMapOpen && (
          <SeatMapModal
            cabinClass={booking.cabinClass}
            flightNumber={flight.flightNumber}
            aircraft={flight.aircraft}
            travelers={booking.travelers}
            onConfirmSeats={handleSeatChangeConfirm}
            onClose={() => setIsSeatMapOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
