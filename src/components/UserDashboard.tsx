import React, { useState } from 'react';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  Plane, 
  Award, 
  User, 
  CreditCard, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  Luggage, 
  FileText,
  Check,
  ChevronRight
} from 'lucide-react';
import { Booking, SavedPaymentMethod, SkyRewardsUser, Traveler } from '../types/airline';
import { POPULAR_AIRPORTS } from '../data/mockAirports';

interface UserDashboardProps {
  bookings: Booking[];
  rewardsUser: SkyRewardsUser;
  travelers: Traveler[];
  payments: SavedPaymentMethod[];
  onCheckIn: (bookingId: string) => void;
  onOpenManageBooking: (booking: Booking) => void;
  onOpenBoardingPass: (booking: Booking) => void;
  onSaveTraveler: (traveler: Traveler) => void;
  onDeleteTraveler: (id: string) => void;
  onSavePayment: (payment: SavedPaymentMethod) => void;
  onDeletePayment: (id: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  bookings,
  rewardsUser,
  travelers,
  payments,
  onCheckIn,
  onOpenManageBooking,
  onOpenBoardingPass,
  onSaveTraveler,
  onDeleteTraveler,
  onSavePayment,
  onDeletePayment,
}) => {
  const [activeTab, setActiveTab] = useState<
    'upcoming' | 'past' | 'cancellations' | 'rewards' | 'travelers' | 'payments' | 'settings'
  >('upcoming');

  // New traveler modal form state
  const [showAddTravelerModal, setShowAddTravelerModal] = useState(false);
  const [newTraveler, setNewTraveler] = useState<Partial<Traveler>>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    passportNumber: '',
    nationality: 'United States',
    frequentFlyerNumber: '',
    mealPreference: 'Chef Signature / Standard',
  });

  // New card modal form state
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState({
    cardType: 'visa' as const,
    last4: '',
    cardholderName: '',
    expiryDate: '',
  });

  // Filter bookings
  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'checked-in');
  const pastBookings = bookings.filter((b) => b.status === 'completed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const handleCreateTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraveler.firstName || !newTraveler.lastName) return;
    const travelerToSave: Traveler = {
      id: `trv-${Date.now()}`,
      title: newTraveler.title as any || 'Mr',
      firstName: newTraveler.firstName,
      lastName: newTraveler.lastName,
      email: newTraveler.email || '',
      phone: newTraveler.phone || '',
      dob: newTraveler.dob,
      passportNumber: newTraveler.passportNumber,
      nationality: newTraveler.nationality,
      frequentFlyerNumber: newTraveler.frequentFlyerNumber,
      mealPreference: newTraveler.mealPreference,
      isSaved: true,
    };
    onSaveTraveler(travelerToSave);
    setShowAddTravelerModal(false);
    setNewTraveler({
      title: 'Mr',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      passportNumber: '',
      nationality: 'United States',
      mealPreference: 'Chef Signature / Standard',
    });
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.last4 || !newCard.cardholderName) return;
    const cardToSave: SavedPaymentMethod = {
      id: `card-${Date.now()}`,
      cardType: newCard.cardType,
      last4: newCard.last4,
      cardholderName: newCard.cardholderName,
      expiryDate: newCard.expiryDate || '12/28',
      isDefault: false,
    };
    onSavePayment(cardToSave);
    setShowAddCardModal(false);
    setNewCard({
      cardType: 'visa',
      last4: '',
      cardholderName: '',
      expiryDate: '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-white/5 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            {rewardsUser?.name
              ? rewardsUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
              : 'FI'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
                {rewardsUser.name}
              </h2>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                {rewardsUser.tier} Tier Member
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Member ID: <span className="font-mono text-slate-300">{rewardsUser.memberNumber}</span> • {rewardsUser.email}
            </p>
          </div>
        </div>

        {/* Quick Points Stat Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center gap-6">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Available SkyPoints</div>
            <div className="text-2xl font-black text-amber-400 font-['Space_Grotesk']">
              {rewardsUser.pointsBalance.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-white/10 pl-6">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Tier Progress</div>
            <div className="text-sm font-bold text-white">
              {rewardsUser.tierPointsThisYear.toLocaleString()} / {rewardsUser.tierGoal.toLocaleString()}
            </div>
            <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full"
                style={{ width: `${(rewardsUser.tierPointsThisYear / rewardsUser.tierGoal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upcoming' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Upcoming Flights ({upcomingBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'past' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Past Flights ({pastBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('cancellations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cancellations' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Cancellations &amp; Refunds ({cancelledBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rewards' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" />
          SkyRewards Hub
        </button>

        <button
          onClick={() => setActiveTab('travelers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'travelers' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          Saved Travelers ({travelers.length})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payments' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payment Methods ({payments.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          Profile Settings
        </button>
      </div>

      {/* TAB 1: UPCOMING FLIGHTS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white">
              Active &amp; Upcoming Reservations
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Check-in opens 24 hours prior to departure
            </span>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center shadow-xl">
              <Plane className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No upcoming flights found</h4>
              <p className="text-xs text-slate-400 mt-1">Ready for your next getaway? Search flights to get started.</p>
            </div>
          ) : (
            upcomingBookings.map((booking) => {
              const flight = booking.flight;
              const traveler = booking.travelers[0];
              const isCheckedIn = booking.status === 'checked-in';

              return (
                <div
                  key={booking.id}
                  id={`booking-card-${booking.id}`}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl hover:border-white/20 transition-all overflow-hidden"
                >
                  <div className="p-5 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-indigo-400 flex items-center justify-center font-black">
                        {flight.airlineCode}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-white">
                            {flight.airline} {flight.flightNumber}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            • PNR: <strong className="text-white">{booking.id}</strong>
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 capitalize">
                          {booking.cabinClass.replace('_', ' ')} • Booked on {booking.bookingDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          isCheckedIn
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isCheckedIn ? 'Checked-In • Ready to Fly' : 'Confirmed • Check-In Open'}
                      </span>
                    </div>
                  </div>

                  {/* Body Schedule */}
                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      <div className="sm:col-span-8 flex items-center justify-between sm:justify-start gap-4 sm:gap-8">
                        <div>
                          <div className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                            {flight.origin.code}
                          </div>
                          <div className="text-xs font-bold text-slate-200">{flight.origin.city}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            {flight.departureDate} at <strong className="text-white">{flight.departureTime}</strong>
                          </div>
                          <div className="text-[11px] text-slate-400">Terminal {flight.terminal || '4'} • Gate {flight.gate || 'B28'}</div>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-bold text-slate-400 mb-1">{flight.duration}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-0.5 bg-white/15" />
                            <Plane className="w-4 h-4 text-indigo-400 rotate-90" />
                            <div className="w-12 h-0.5 bg-white/15" />
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold mt-1">Non-stop</span>
                        </div>

                        <div>
                          <div className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                            {flight.destination.code}
                          </div>
                          <div className="text-xs font-bold text-slate-200">{flight.destination.city}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            Arrival at <strong className="text-white">{flight.arrivalTime}</strong>
                          </div>
                          <div className="text-[11px] text-slate-400">Claim: {flight.baggageClaim || 'Carousel 4'}</div>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="sm:col-span-4 flex flex-col gap-2">
                        {!isCheckedIn ? (
                          <button
                            type="button"
                            id={`checkin-btn-${booking.id}`}
                            onClick={() => {
                              onCheckIn(booking.id);
                              onOpenBoardingPass(booking);
                            }}
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Online Check-In (Open)
                          </button>
                        ) : (
                          <button
                            type="button"
                            id={`view-pass-btn-${booking.id}`}
                            onClick={() => onOpenBoardingPass(booking)}
                            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/15 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                          >
                            <Ticket className="w-4 h-4" />
                            View Boarding Pass ({traveler?.seatNumber || '2A'})
                          </button>
                        )}

                        <button
                          type="button"
                          id={`manage-booking-btn-${booking.id}`}
                          onClick={() => onOpenManageBooking(booking)}
                          className="w-full py-2 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          Manage Booking &amp; Seats
                        </button>
                      </div>
                    </div>

                    {/* Passenger & Seat footer info */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400">
                      <div>
                        Traveler: <strong className="text-white">{traveler?.firstName} {traveler?.lastName}</strong> • Seat: <strong className="text-amber-400">{traveler?.seatNumber || '2A'}</strong> • Meal: {traveler?.mealPreference || 'Chef Signature'}
                      </div>
                      <div className="text-slate-400">
                        Paid: <strong className="text-white">${booking.fareBreakdown.cashPaid}</strong> {booking.fareBreakdown.pointsUsed > 0 ? `+ ${booking.fareBreakdown.pointsUsed.toLocaleString()} pts` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: PAST FLIGHTS */}
      {activeTab === 'past' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <h3 className="text-lg font-extrabold text-white">
            Past Flight History &amp; Receipts
          </h3>

          {pastBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Completed • {booking.flight.departureDate}
                  </span>
                  <span className="bg-white/10 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                    PNR: {booking.id}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white mt-1">
                  {booking.flight.origin.city} ({booking.flight.origin.code}) ➔ {booking.flight.destination.city} ({booking.flight.destination.code})
                </h4>
                <p className="text-xs text-slate-400">
                  {booking.flight.airline} {booking.flight.flightNumber} • Seat {booking.travelers[0]?.seatNumber} • {booking.cabinClass}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right mr-2 hidden sm:block">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Paid</span>
                  <span className="text-sm font-black text-white">${booking.fareBreakdown.cashPaid} USD</span>
                </div>
                <button
                  onClick={() => onOpenManageBooking(booking)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Tax Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CANCELLATIONS & REFUNDS */}
      {activeTab === 'cancellations' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <h3 className="text-lg font-extrabold text-white">
            Cancelled Flights &amp; Travel Credit Vouchers
          </h3>

          {cancelledBookings.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center shadow-xl">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No cancellations on file</h4>
              <p className="text-xs text-slate-400 mt-1">All your bookings are in active or completed standing.</p>
            </div>
          ) : (
            cancelledBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-rose-500/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500/10 text-rose-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                      Cancelled &amp; Refunded
                    </span>
                    <span className="text-xs font-mono text-slate-400">PNR: {b.id}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">
                    {b.flight.origin.code} ➔ {b.flight.destination.code} ({b.flight.flightNumber})
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Refund method: <strong className="capitalize text-slate-200">{b.cancellationDetails?.refundType || 'original payment'}</strong>
                  </p>
                  {b.cancellationDetails?.voucherCode && (
                    <div className="mt-2 inline-block bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-lg text-xs font-mono font-bold">
                      Voucher Code: {b.cancellationDetails.voucherCode} (110% Value)
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Refund Amount</span>
                  <span className="text-lg font-black text-emerald-400">${b.fareBreakdown.cashPaid} USD</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SKYREWARDS HUB */}
      {activeTab === 'rewards' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Rewards Tier Hero */}
          <div className="bg-white/5 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  SkyRewards {rewardsUser.tier} Status
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  {rewardsUser.pointsBalance.toLocaleString()} SkyPoints Balance
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Lifetime earned: {rewardsUser.lifetimePoints.toLocaleString()} pts • {rewardsUser.pointsExpiringSoon} pts expiring {rewardsUser.expiryDate}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[200px] backdrop-blur-md">
                <div className="text-[11px] text-slate-400 uppercase font-bold">Next Tier: Platinum</div>
                <div className="text-sm font-bold text-white mt-1">
                  {(rewardsUser.tierGoal - rewardsUser.tierPointsThisYear).toLocaleString()} Tier Points Needed
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full"
                    style={{ width: `${(rewardsUser.tierPointsThisYear / rewardsUser.tierGoal) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Member Perks */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Complimentary SkyClub Lounge Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">2 Free Checked Bags (23kg each)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">25% Bonus Points on All Flights</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Group 1 Priority Boarding</span>
              </div>
            </div>
          </div>

          {/* Redemption Dream Trip Calculator */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
            <h4 className="font-extrabold text-base text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              What Can You Redeem Today With {rewardsUser.pointsBalance.toLocaleString()} Points?
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs font-bold text-indigo-300 uppercase">Domestic Escape</div>
                <div className="text-lg font-black text-white mt-1">New York ✈ Miami</div>
                <div className="text-xs text-slate-400 mt-0.5">25,000 SkyPoints Roundtrip</div>
                <span className="inline-block mt-3 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Ready to Book (Enough Points!)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs font-bold text-indigo-300 uppercase">Transatlantic Luxury</div>
                <div className="text-lg font-black text-white mt-1">JFK ✈ London Heathrow</div>
                <div className="text-xs text-slate-400 mt-0.5">42,000 SkyPoints Economy</div>
                <span className="inline-block mt-3 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Ready to Book (Enough Points!)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-xs font-bold text-indigo-300 uppercase">Pacific Premier Suite</div>
                <div className="text-lg font-black text-white mt-1">San Francisco ✈ Tokyo</div>
                <div className="text-xs text-slate-400 mt-0.5">125,000 SkyPoints Business Suite</div>
                <span className="inline-block mt-3 text-xs font-extrabold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  Need 46,500 more points
                </span>
              </div>
            </div>
          </div>

          {/* Activity Ledger */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl">
            <h4 className="font-extrabold text-base text-white mb-4">
              Points Activity &amp; Transaction History
            </h4>

            <div className="divide-y divide-white/10">
              {rewardsUser.activities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-white">{act.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{act.description} • {act.date}</div>
                  </div>
                  <span className={`text-sm font-black font-['Space_Grotesk'] ${
                    act.points > 0 ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {act.points > 0 ? `+${act.points.toLocaleString()}` : act.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SAVED TRAVELERS */}
      {activeTab === 'travelers' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Saved Travelers &amp; Companions
              </h3>
              <p className="text-xs text-slate-400">
                Save passport and frequent flyer details for instant 1-click booking checkout.
              </p>
            </div>

            <button
              type="button"
              id="add-traveler-btn"
              onClick={() => setShowAddTravelerModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Traveler
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {travelers.map((t) => (
              <div
                key={t.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center font-bold text-xs">
                      {t.firstName[0]}{t.lastName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        {t.title} {t.firstName} {t.lastName}
                      </h4>
                      <span className="text-[11px] text-slate-400">{t.email || 'No email stored'}</span>
                    </div>
                  </div>

                  {travelers.length > 1 && (
                    <button
                      onClick={() => onDeleteTraveler(t.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                      title="Delete Traveler"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10 text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Passport Number</span>
                    <span className="font-semibold">{t.passportNumber || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">SkyRewards / Frequent Flyer</span>
                    <span className="font-semibold text-indigo-400">{t.frequentFlyerNumber || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Meal Preference</span>
                    <span className="font-semibold truncate block">{t.mealPreference || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Nationality</span>
                    <span className="font-semibold">{t.nationality || 'United States'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PAYMENT METHODS */}
      {activeTab === 'payments' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Saved Payment Methods
              </h3>
              <p className="text-xs text-slate-400">
                Encrypted with 256-bit PCI-DSS compliant vaulting.
              </p>
            </div>

            <button
              type="button"
              id="add-card-btn"
              onClick={() => setShowAddCardModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Payment Card
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {payments.map((p) => (
              <div
                key={p.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-indigo-400" />
                  <div>
                    <div className="font-bold text-sm text-white">
                      {p.cardType.toUpperCase()} ending in •••• {p.last4}
                    </div>
                    <div className="text-xs text-slate-400">
                      Exp: {p.expiryDate} • {p.cardholderName}
                    </div>
                    {p.isDefault && (
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 inline-block mt-1">
                        Default Payment Card
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeletePayment(p.id)}
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                  title="Remove Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: PROFILE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-150">
          <h3 className="text-lg font-extrabold text-white">
            Travel Preferences &amp; Profile Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Home Airport</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-md">
                <option value="JFK" className="bg-slate-900 text-white">New York (JFK) - John F. Kennedy</option>
                <option value="SFO" className="bg-slate-900 text-white">San Francisco (SFO)</option>
                <option value="LHR" className="bg-slate-900 text-white">London Heathrow (LHR)</option>
                <option value="DXB" className="bg-slate-900 text-white">Dubai International (DXB)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Display Currency</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-md">
                <option value="USD" className="bg-slate-900 text-white">USD ($ - US Dollar)</option>
                <option value="EUR" className="bg-slate-900 text-white">EUR (€ - Euro)</option>
                <option value="GBP" className="bg-slate-900 text-white">GBP (£ - British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Default Seating Preference</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-md">
                <option value="window" className="bg-slate-900 text-white">Window Seat Always</option>
                <option value="aisle" className="bg-slate-900 text-white">Aisle Seat (Direct Access)</option>
                <option value="exit" className="bg-slate-900 text-white">Emergency Exit Row (Extra Legroom)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Live Travel Notifications</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-md">
                <option value="all" className="bg-slate-900 text-white">SMS + Push + Email (Recommended)</option>
                <option value="sms_only" className="bg-slate-900 text-white">SMS Gate &amp; Delay Alerts Only</option>
                <option value="email_only" className="bg-slate-900 text-white">Email Receipts Only</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => alert('Preferences saved successfully!')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              Save Account Preferences
            </button>
          </div>
        </div>
      )}

      {/* Add Traveler Modal */}
      {showAddTravelerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/10 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-extrabold text-base text-white">Add New Saved Traveler</h4>
              <button onClick={() => setShowAddTravelerModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTraveler} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Title</label>
                  <select
                    value={newTraveler.title}
                    onChange={(e) => setNewTraveler({ ...newTraveler, title: e.target.value as any })}
                    className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md"
                  >
                    <option value="Mr" className="bg-slate-900 text-white">Mr.</option>
                    <option value="Ms" className="bg-slate-900 text-white">Ms.</option>
                    <option value="Mrs" className="bg-slate-900 text-white">Mrs.</option>
                    <option value="Dr" className="bg-slate-900 text-white">Dr.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-bold text-slate-300 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={newTraveler.firstName}
                    onChange={(e) => setNewTraveler({ ...newTraveler, firstName: e.target.value })}
                    className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Last Name"
                  value={newTraveler.lastName}
                  onChange={(e) => setNewTraveler({ ...newTraveler, lastName: e.target.value })}
                  className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newTraveler.email}
                    onChange={(e) => setNewTraveler({ ...newTraveler, email: e.target.value })}
                    className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Passport Number</label>
                  <input
                    type="text"
                    placeholder="P12345678"
                    value={newTraveler.passportNumber}
                    onChange={(e) => setNewTraveler({ ...newTraveler, passportNumber: e.target.value })}
                    className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddTravelerModal(false)}
                  className="px-4 py-2 border border-white/10 rounded-xl font-bold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Save Traveler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/10 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-extrabold text-base text-white">Add Payment Card</h4>
              <button onClick={() => setShowAddCardModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Card Type</label>
                <select
                  value={newCard.cardType}
                  onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value as any })}
                  className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md"
                >
                  <option value="visa" className="bg-slate-900 text-white">Visa</option>
                  <option value="mastercard" className="bg-slate-900 text-white">Mastercard</option>
                  <option value="amex" className="bg-slate-900 text-white">American Express</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Cardholder Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Fatima Irfan"
                  value={newCard.cardholderName}
                  onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                  className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="4242"
                    value={newCard.last4}
                    onChange={(e) => setNewCard({ ...newCard, last4: e.target.value })}
                    className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md placeholder:text-slate-500 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="08/29"
                    value={newCard.expiryDate}
                    onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                    className="w-full border border-white/10 rounded-xl p-2 bg-white/5 text-white backdrop-blur-md placeholder:text-slate-500 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2 border border-white/10 rounded-xl font-bold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
