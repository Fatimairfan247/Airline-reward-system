import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Coins, 
  Luggage, 
  Sparkles, 
  User, 
  Lock, 
  Ticket, 
  Plane, 
  ArrowRight, 
  Calendar, 
  Award,
  Download,
  AlertCircle
} from 'lucide-react';
import { Booking, CabinClass, Flight, SavedPaymentMethod, SkyRewardsUser, Traveler } from '../types/airline';
import { SeatMapModal } from './SeatMapModal';

interface BookingCheckoutModalProps {
  flight: Flight;
  cabinClass?: CabinClass;
  criteria?: any;
  passengerCount?: { adults: number; children: number; infants: number };
  rewardsUser: SkyRewardsUser;
  savedTravelers?: Traveler[];
  savedPayments?: SavedPaymentMethod[];
  onBookingComplete?: (booking: Booking) => void;
  onConfirmBooking?: (booking: Booking) => void;
  onClose: () => void;
  onOpenBoardingPass?: (booking: Booking) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  flight,
  cabinClass: passedCabinClass,
  criteria,
  passengerCount: passedPassengerCount,
  rewardsUser,
  savedTravelers = [],
  savedPayments = [],
  onBookingComplete,
  onConfirmBooking,
  onClose,
  onOpenBoardingPass,
}) => {
  const cabinClass = passedCabinClass || criteria?.cabinClass || 'economy';
  const passengerCount = passedPassengerCount || criteria?.passengers || { adults: 1, children: 0, infants: 0 };
  const totalTravelers = Math.max(1, (passengerCount.adults || 1) + (passengerCount.children || 0));

  // Step state: 1 = Passengers, 2 = Add-ons & Seats, 3 = Payment & Review, 4 = Confirmed
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Travelers state
  const [travelers, setTravelers] = useState<Traveler[]>(() => {
    return Array.from({ length: totalTravelers }).map((_, i) => {
      const saved = savedTravelers[i];
      if (saved) {
        return {
          ...saved,
          id: `trv-${i + 1}`,
          seatNumber: i === 0 ? '2A' : '2D',
        };
      }
      return {
        id: `trv-${i + 1}`,
        title: 'Mr',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        passportNumber: '',
        dob: '',
        seatNumber: i === 0 ? '14A' : '14B',
        mealPreference: 'Chef Signature / Standard',
      };
    });
  });

  // Baggage & Addons
  const [extraBags, setExtraBags] = useState<number>(0);
  const [travelInsurance, setTravelInsurance] = useState<boolean>(true);
  const [priorityPass, setPriorityPass] = useState<boolean>(false);

  // Seat map modal open
  const [isSeatMapOpen, setIsSeatMapOpen] = useState<boolean>(false);
  const [seatFeesTotal, setSeatFeesTotal] = useState<number>(0);

  // Payment mode: 'cash' | 'points' | 'points_plus_cash'
  const [paymentType, setPaymentType] = useState<'cash' | 'points' | 'points_plus_cash'>('cash');
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(() => {
    return Math.min(rewardsUser.pointsBalance, 50000);
  });
  const [selectedCardId, setSelectedCardId] = useState<string>(savedPayments[0]?.id || 'new');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Completed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Financial calculations
  const cabinPricing = flight.cabinClasses[cabinClass] || { cashPrice: 600, pointsPrice: 40000 };
  const baseCashFare = cabinPricing.cashPrice * totalTravelers;
  const taxesAndAirportFees = Math.round(baseCashFare * 0.12 + 25 * totalTravelers);
  const baggageCost = extraBags * 40;
  const insuranceCost = travelInsurance ? 29 * totalTravelers : 0;
  const priorityCost = priorityPass ? 25 * totalTravelers : 0;

  // Hybrid points conversion: 1,000 points = $10 discount
  const pointsCashValue = Math.floor(pointsToRedeem / 100);

  const subtotal = baseCashFare + taxesAndAirportFees + baggageCost + insuranceCost + priorityCost + seatFeesTotal;
  
  const calculatedTotalCashDue = useMemo(() => {
    if (paymentType === 'points') {
      return taxesAndAirportFees + baggageCost + insuranceCost + priorityCost + seatFeesTotal;
    }
    if (paymentType === 'points_plus_cash') {
      return Math.max(0, subtotal - pointsCashValue - promoDiscount);
    }
    return Math.max(0, subtotal - promoDiscount);
  }, [paymentType, subtotal, pointsCashValue, promoDiscount, taxesAndAirportFees, baggageCost, insuranceCost, priorityCost, seatFeesTotal]);

  const totalPointsDue = useMemo(() => {
    if (paymentType === 'points') {
      return cabinPricing.pointsPrice * totalTravelers;
    }
    if (paymentType === 'points_plus_cash') {
      return pointsToRedeem;
    }
    return 0;
  }, [paymentType, cabinPricing.pointsPrice, totalTravelers, pointsToRedeem]);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SKY2026' || promoCode.trim().toUpperCase() === 'VOYAGE') {
      setPromoApplied(true);
      setPromoDiscount(50);
    } else {
      alert('Invalid promo code. Try SKY2026 or VOYAGE for $50 off!');
    }
  };

  const handleAutofillTravelers = () => {
    if (savedTravelers.length === 0) return;
    setTravelers((prev) =>
      prev.map((t, i) => {
        const saved = savedTravelers[i] || savedTravelers[0];
        return {
          ...t,
          ...saved,
          id: t.id,
          seatNumber: t.seatNumber || (i === 0 ? '2A' : '2D'),
        };
      })
    );
  };

  const handleUpdateTraveler = (index: number, field: keyof Traveler, value: string) => {
    setTravelers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleConfirmSeats = (seatAssignments: { [travelerId: string]: { seatNumber: string; fee: number } }) => {
    let newTotalSeatFees = 0;
    setTravelers((prev) =>
      prev.map((t) => {
        if (seatAssignments[t.id]) {
          newTotalSeatFees += seatAssignments[t.id].fee;
          return { ...t, seatNumber: seatAssignments[t.id].seatNumber };
        }
        return t;
      })
    );
    setSeatFeesTotal(newTotalSeatFees);
  };

  const handleFinalizeBooking = () => {
    // Generate Booking
    const pnr = `AV-${Math.floor(10000 + Math.random() * 90000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const newBooking: Booking = {
      id: pnr,
      flightId: flight.id,
      flight,
      cabinClass,
      tripType: 'one-way',
      travelers,
      bookingDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentType,
      fareBreakdown: {
        baseFare: baseCashFare,
        taxesAndFees: taxesAndAirportFees,
        seatFees: seatFeesTotal,
        baggageFees: baggageCost,
        discountAmount: promoDiscount + (paymentType === 'points_plus_cash' ? pointsCashValue : 0),
        pointsUsed: totalPointsDue,
        cashPaid: calculatedTotalCashDue,
        totalUsd: subtotal - promoDiscount,
      },
      baggageAddons: {
        extraBags,
        cost: baggageCost,
      },
      status: 'confirmed',
      barcode: `M1${travelers[0]?.lastName?.toUpperCase() || 'TRAVELER'}/${travelers[0]?.firstName?.toUpperCase() || 'PASSENGER'} E${pnr} ${flight.origin.code}${flight.destination.code}AV 0104 255Y002A0012 147`,
      boardingGroup: cabinClass === 'business' || cabinClass === 'first' ? 'Group 1 Priority' : 'Group 3',
      eTicketIssued: true,
    };

    setConfirmedBooking(newBooking);
    setCurrentStep(4);
    if (onBookingComplete) onBookingComplete(newBooking);
    if (onConfirmBooking) onConfirmBooking(newBooking);

    // Confetti celebration!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#38bdf8', '#10b981', '#6366f1'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        id="checkout-modal-container"
        className="bg-slate-900/90 backdrop-blur-2xl text-slate-100 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl shadow-black/80 border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white/[0.03] backdrop-blur-md text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded border border-amber-500/30">
                Secure Checkout &amp; Reservation
              </span>
              <span className="text-xs text-slate-400">• {flight.airline} {flight.flightNumber}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Space_Grotesk'] mt-1 text-white">
              {flight.origin.city} ({flight.origin.code}) ➔ {flight.destination.city} ({flight.destination.code})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar (if not confirmed) */}
        {currentStep < 4 && (
          <div className="bg-white/[0.02] px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2 sm:gap-6">
              <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-white font-extrabold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 1 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-slate-400'}`}>
                  1
                </span>
                <span>Passengers</span>
              </div>

              <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-white font-extrabold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 2 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-slate-400'}`}>
                  2
                </span>
                <span>Seats &amp; Baggage</span>
              </div>

              <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-white font-extrabold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 3 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-slate-400'}`}>
                  3
                </span>
                <span>Payment &amp; Review</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Secured</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: Traveler Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 backdrop-blur-md p-4 rounded-2xl border border-amber-500/20">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-200">Traveler Identification</h4>
                    <p className="text-xs text-amber-300/80">Ensure names match passport or government issued photo ID.</p>
                  </div>
                </div>

                <button
                  type="button"
                  id="autofill-saved-travelers-btn"
                  onClick={handleAutofillTravelers}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Autofill from Saved Profile
                </button>
              </div>

              {travelers.map((traveler, idx) => (
                <div key={traveler.id} className="bg-white/[0.04] backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-extrabold text-sm text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs flex items-center justify-center font-black">
                        {idx + 1}
                      </span>
                      Passenger {idx + 1} ({idx === 0 ? 'Primary Contact' : 'Companion'})
                    </span>
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      Seat: <strong className="text-amber-400">{traveler.seatNumber || 'Assigned in Next Step'}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Title</label>
                      <select
                        value={traveler.title}
                        onChange={(e) => handleUpdateTraveler(idx, 'title', e.target.value)}
                        className="w-full bg-white/[0.07] border border-white/15 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                      >
                        <option value="Mr" className="bg-slate-900 text-white">Mr.</option>
                        <option value="Ms" className="bg-slate-900 text-white">Ms.</option>
                        <option value="Mrs" className="bg-slate-900 text-white">Mrs.</option>
                        <option value="Dr" className="bg-slate-900 text-white">Dr.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">First &amp; Middle Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Fatima"
                        value={traveler.firstName}
                        onChange={(e) => handleUpdateTraveler(idx, 'firstName', e.target.value)}
                        className="w-full bg-white/[0.07] border border-white/15 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Last Name (Surname)</label>
                      <input
                        type="text"
                        placeholder="e.g. Irfan"
                        value={traveler.lastName}
                        onChange={(e) => handleUpdateTraveler(idx, 'lastName', e.target.value)}
                        className="w-full bg-white/[0.07] border border-white/15 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={traveler.dob || '1990-01-01'}
                        onChange={(e) => handleUpdateTraveler(idx, 'dob', e.target.value)}
                        className="w-full bg-white/[0.07] border border-white/15 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="alexander@example.com"
                        value={traveler.email}
                        onChange={(e) => handleUpdateTraveler(idx, 'email', e.target.value)}
                        className="w-full bg-white/[0.07] border border-white/15 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Passport Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="P892019482"
                        value={traveler.passportNumber || ''}
                        onChange={(e) => handleUpdateTraveler(idx, 'passportNumber', e.target.value)}
                        className="w-full bg-white/[0.07] border border-white/15 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">In-Flight Dining Preference</label>
                      <select
                        value={traveler.mealPreference}
                        onChange={(e) => handleUpdateTraveler(idx, 'mealPreference', e.target.value)}
                        className="w-full bg-white/[0.07] border border-white/15 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                      >
                        <option value="Chef Signature / Standard" className="bg-slate-900 text-white">Chef Signature / Standard</option>
                        <option value="Vegetarian Lacto-Ovo" className="bg-slate-900 text-white">Vegetarian Lacto-Ovo</option>
                        <option value="Vegan Strict" className="bg-slate-900 text-white">Vegan Strict</option>
                        <option value="Gluten Intolerant" className="bg-slate-900 text-white">Gluten Intolerant</option>
                        <option value="Halal Certified" className="bg-slate-900 text-white">Halal Certified</option>
                        <option value="Kosher Meal" className="bg-slate-900 text-white">Kosher Meal</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: Seats, Baggage & Extras */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Interactive Seat Picker Trigger */}
              <div className="bg-white/[0.04] backdrop-blur-md text-white p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <h4 className="font-extrabold text-sm text-white">Interactive Aircraft Seat Selection</h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Select your preferred window, aisle, or exit row seats directly on the interactive fuselage map.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {travelers.map((t, idx) => (
                      <span key={t.id} className="bg-white/10 text-amber-300 px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
                        {t.firstName || `Passenger ${idx + 1}`}: <strong className="text-white">{t.seatNumber || 'Auto-assigned'}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  id="open-seatmap-modal-btn"
                  onClick={() => setIsSeatMapOpen(true)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all whitespace-nowrap active:scale-[0.98]"
                >
                  Open Interactive Seat Map
                </button>
              </div>

              {/* Baggage Selection */}
              <div className="bg-white/[0.04] backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Luggage className="w-5 h-5 text-amber-400" />
                    <h4 className="font-extrabold text-sm text-white">Baggage Allowances &amp; Add-ons</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    Included: {flight.baggage.checked}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExtraBags(0)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      extraBags === 0 ? 'bg-amber-500/15 border-amber-400/60 shadow-xs' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">Standard Allowance</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Included with ticket</div>
                    <div className="text-xs font-black text-amber-400 mt-2">$0 Free</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExtraBags(1)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      extraBags === 1 ? 'bg-amber-500/15 border-amber-400/60 shadow-xs' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">+1 Additional Bag</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Extra 23kg checked bag</div>
                    <div className="text-xs font-black text-amber-400 mt-2">+$40 USD</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExtraBags(2)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      extraBags === 2 ? 'bg-amber-500/15 border-amber-400/60 shadow-xs' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">+2 Additional Bags</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Best for heavy packers</div>
                    <div className="text-xs font-black text-amber-400 mt-2">+$75 USD</div>
                  </button>
                </div>
              </div>

              {/* Extra Perks & Protection */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={travelInsurance}
                    onChange={(e) => setTravelInsurance(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-amber-400 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Comprehensive Travel &amp; Medical Protection
                      </span>
                      <span className="text-xs font-extrabold text-amber-400">+${29 * totalTravelers} USD</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      100% trip cancellation reimbursement for illness, baggage loss coverage up to $2,500, and $50,000 emergency medical care.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={priorityPass}
                    onChange={(e) => setPriorityPass(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-amber-400 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Priority Security Fast-Track &amp; Lounge Pass
                      </span>
                      <span className="text-xs font-extrabold text-amber-400">+${25 * totalTravelers} USD</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Skip standard security lines and enjoy gourmet dining and quiet work pods in the AeroVoyage SkyClub lounge.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Points Slider */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType('cash')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentType === 'cash' ? 'bg-amber-500/15 text-white border-amber-400/60 shadow-md' : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className={`w-5 h-5 ${paymentType === 'cash' ? 'text-amber-400' : 'text-slate-400'}`} />
                      {paymentType === 'cash' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="font-bold text-xs mt-2 text-white">100% Cash / Card</div>
                    <div className={`text-[11px] mt-0.5 ${paymentType === 'cash' ? 'text-amber-200/80' : 'text-slate-400'}`}>
                      Earns +{Math.round(subtotal * 5)} SkyPoints
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('points_plus_cash')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentType === 'points_plus_cash' ? 'bg-amber-500/15 text-white border-amber-400/60 shadow-md' : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Coins className={`w-5 h-5 ${paymentType === 'points_plus_cash' ? 'text-amber-400' : 'text-amber-500'}`} />
                      {paymentType === 'points_plus_cash' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="font-bold text-xs mt-2 text-white">Points + Cash Slider</div>
                    <div className={`text-[11px] mt-0.5 ${paymentType === 'points_plus_cash' ? 'text-amber-200/80' : 'text-slate-400'}`}>
                      Use your SkyRewards points
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={rewardsUser.pointsBalance < cabinPricing.pointsPrice * totalTravelers}
                    onClick={() => setPaymentType('points')}
                    className={`p-4 rounded-2xl border text-left transition-all disabled:opacity-50 ${
                      paymentType === 'points' ? 'bg-amber-500/15 text-white border-amber-400/60 shadow-md' : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Award className={`w-5 h-5 ${paymentType === 'points' ? 'text-amber-400' : 'text-indigo-400'}`} />
                      {paymentType === 'points' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="font-bold text-xs mt-2 text-white">100% SkyPoints Award</div>
                    <div className={`text-[11px] mt-0.5 ${paymentType === 'points' ? 'text-amber-200/80' : 'text-slate-400'}`}>
                      {(cabinPricing.pointsPrice * totalTravelers).toLocaleString()} pts + taxes
                    </div>
                  </button>
                </div>
              </div>

              {/* Points + Cash Interactive Slider */}
              {paymentType === 'points_plus_cash' && (
                <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-amber-200 flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-400" />
                        Custom Points Redemption Slider
                      </h4>
                      <p className="text-xs text-amber-300/80">
                        Available Balance: <strong>{rewardsUser.pointsBalance.toLocaleString()} SkyPoints</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-300">Discount Applied</span>
                      <div className="text-base font-black text-emerald-400">-${pointsCashValue} USD</div>
                    </div>
                  </div>

                  <div>
                    <input
                      type="range"
                      min={0}
                      max={Math.min(rewardsUser.pointsBalance, baseCashFare * 100)}
                      step={5000}
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                      className="w-full accent-amber-400 h-2 bg-white/15 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-amber-200 font-semibold mt-1">
                      <span>0 pts ($0 off)</span>
                      <span className="font-bold text-slate-950 bg-amber-400 px-2 py-0.5 rounded shadow-xs">
                        {pointsToRedeem.toLocaleString()} Points Selected
                      </span>
                      <span>{Math.min(rewardsUser.pointsBalance, baseCashFare * 100).toLocaleString()} pts</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Cards Selection */}
              {calculatedTotalCashDue > 0 && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Payment Card (1-Click or New)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedPayments.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedCardId(p.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedCardId === p.id ? 'bg-amber-500/15 text-white border-amber-400/60' : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-amber-400" />
                          <div>
                            <div className="font-bold text-xs text-white">{p.cardType.toUpperCase()} ending in •••• {p.last4}</div>
                            <div className={`text-[10px] ${selectedCardId === p.id ? 'text-amber-200/80' : 'text-slate-400'}`}>
                              Exp: {p.expiryDate} • {p.cardholderName}
                            </div>
                          </div>
                        </div>
                        {selectedCardId === p.id && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Promo Code Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. SKY2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-white/[0.06] border border-white/15 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/10"
                >
                  Apply Code
                </button>
                {promoApplied && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> -$50 Promo Applied!
                  </span>
                )}
              </div>

              {/* Itemized Fare Breakdown Card */}
              <div className="bg-white/[0.04] backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2 text-xs text-slate-300">
                <h5 className="font-extrabold text-sm text-white border-b border-white/10 pb-2">
                  Itemized Cost Breakdown
                </h5>
                <div className="flex justify-between text-slate-300">
                  <span>Base Airfare ({totalTravelers} passenger{totalTravelers > 1 ? 's' : ''}):</span>
                  <span className="font-semibold text-white">${baseCashFare}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Government Taxes &amp; Aviation Security:</span>
                  <span className="font-semibold text-white">${taxesAndAirportFees}</span>
                </div>
                {seatFeesTotal > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Seat Selection Fees:</span>
                    <span className="font-semibold text-white">+${seatFeesTotal}</span>
                  </div>
                )}
                {baggageCost > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Extra Baggage ({extraBags} bags):</span>
                    <span className="font-semibold text-white">+${baggageCost}</span>
                  </div>
                )}
                {insuranceCost > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Comprehensive Flight Protection:</span>
                    <span className="font-semibold text-white">+${insuranceCost}</span>
                  </div>
                )}
                {priorityCost > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Priority Fast-Track &amp; Lounge:</span>
                    <span className="font-semibold text-white">+${priorityCost}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Promotional Discount:</span>
                    <span>-${promoDiscount}</span>
                  </div>
                )}
                {paymentType === 'points_plus_cash' && pointsCashValue > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>SkyRewards Points Discount ({pointsToRedeem.toLocaleString()} pts):</span>
                    <span>-${pointsCashValue}</span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 mt-2 flex items-baseline justify-between">
                  <div>
                    <span className="font-black text-sm text-white">Total Amount Due:</span>
                    {totalPointsDue > 0 && (
                      <div className="text-xs font-bold text-amber-400">
                        {totalPointsDue.toLocaleString()} SkyPoints
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white font-['Space_Grotesk']">
                      ${calculatedTotalCashDue}
                    </span>
                    <span className="text-xs text-slate-400 font-normal"> USD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation & E-Ticket Generated */}
          {currentStep === 4 && confirmedBooking && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                  Reservation Confirmed • E-Ticket Issued
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-['Space_Grotesk']">
                  You&apos;re ready to fly to {flight.destination.city}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1">
                  Confirmation and receipt sent to <strong className="text-amber-400">{travelers[0]?.email || 'your email'}</strong>.
                </p>
              </div>

              {/* Booking Reference Card */}
              <div className="bg-white/[0.05] backdrop-blur-xl text-white p-6 rounded-3xl max-w-md mx-auto text-left shadow-xl border border-white/10 relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Booking Reference (PNR)</span>
                    <div className="text-xl font-black text-amber-400 font-mono tracking-wider">
                      {confirmedBooking.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Cabin Class</span>
                    <div className="text-xs font-bold text-white capitalize">
                      {confirmedBooking.cabinClass.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-black text-white">{flight.origin.code}</div>
                      <div className="text-xs text-slate-400">{flight.departureTime}</div>
                    </div>
                    <Plane className="w-5 h-5 text-amber-400 rotate-90" />
                    <div className="text-right">
                      <div className="text-xl font-black text-white">{flight.destination.code}</div>
                      <div className="text-xs text-slate-400">{flight.arrivalTime}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex justify-between pt-1">
                    <span>Flight: {flight.flightNumber}</span>
                    <span>Date: {flight.departureDate}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Traveler: <strong className="text-white">{travelers[0]?.firstName} {travelers[0]?.lastName}</strong>
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                    Seat {travelers[0]?.seatNumber || 'Assigned'}
                  </span>
                </div>
              </div>

              {/* Next Steps CTA */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  id="view-boarding-pass-now-btn"
                  onClick={() => {
                    onClose();
                    if (onOpenBoardingPass && confirmedBooking) {
                      onOpenBoardingPass(confirmedBooking);
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                >
                  <Ticket className="w-4 h-4" />
                  View &amp; Print Boarding Pass
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition-colors border border-white/10"
                >
                  Close &amp; Return to Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1-3) */}
        {currentStep < 4 && (
          <div className="bg-white/[0.03] backdrop-blur-md p-4 sm:p-5 border-t border-white/10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="px-4 py-2 border border-white/20 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-white/20 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-slate-400 font-medium">Due at checkout</div>
                <div className="text-sm font-black text-white">
                  ${calculatedTotalCashDue} {totalPointsDue > 0 ? `+ ${totalPointsDue.toLocaleString()} pts` : ''}
                </div>
              </div>

              {currentStep < 3 ? (
                <button
                  type="button"
                  id={`continue-to-step-${currentStep + 1}-btn`}
                  onClick={() => setCurrentStep((currentStep + 1) as any)}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md active:scale-[0.98]"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  id="confirm-and-pay-btn"
                  onClick={handleFinalizeBooking}
                  className="px-7 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4" />
                  Confirm &amp; Pay ${calculatedTotalCashDue}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Seat Map Sub-Modal */}
        {isSeatMapOpen && (
          <SeatMapModal
            cabinClass={cabinClass}
            flightNumber={flight.flightNumber}
            aircraft={flight.aircraft}
            travelers={travelers}
            onConfirmSeats={handleConfirmSeats}
            onClose={() => setIsSeatMapOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
