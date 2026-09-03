import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FlightSearchHero } from './components/FlightSearchHero';
import { FlightSearchResults } from './components/FlightSearchResults';
import { BookingCheckoutModal } from './components/BookingCheckoutModal';
import { BoardingPassModal } from './components/BoardingPassModal';
import { ManageBookingModal } from './components/ManageBookingModal';
import { FlightStatusTracker } from './components/FlightStatusTracker';
import { UserDashboard } from './components/UserDashboard';
import { storageService } from './services/storageService';
import { generateMockFlights } from './data/mockFlights';
import { POPULAR_AIRPORTS } from './data/mockAirports';
import { 
  Booking, 
  CabinClass,
  Flight, 
  SavedPaymentMethod, 
  SearchParams,
  SkyRewardsUser, 
  Traveler, 
  TravelNotification 
} from './types/airline';
import { 
  Plane, 
  ShieldCheck, 
  Award, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'search' | 'status' | 'dashboard' | 'rewards'>('search');

  // Persistence State
  const [bookings, setBookings] = useState<Booking[]>(() => storageService.getBookings());
  const [rewardsUser, setRewardsUser] = useState<SkyRewardsUser>(() => storageService.getRewardsUser());
  const [savedTravelers, setSavedTravelers] = useState<Traveler[]>(() => storageService.getSavedTravelers());
  const [savedPayments, setSavedPayments] = useState<SavedPaymentMethod[]>(() => storageService.getSavedPayments());
  const [notifications, setNotifications] = useState<TravelNotification[]>(() => storageService.getNotifications());

  // Search State
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: POPULAR_AIRPORTS[0],
    destination: POPULAR_AIRPORTS[1],
    departureDate: '2026-09-18',
    returnDate: '2026-09-25',
    tripType: 'round-trip',
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: 'economy',
    paymentMode: 'all',
  });
  const [selectedCabinClass, setSelectedCabinClass] = useState<CabinClass>('economy');

  const [searchResults, setSearchResults] = useState<Flight[]>(() =>
    generateMockFlights('JFK', 'LHR', '2026-09-18', 'economy')
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Modals
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState<Flight | null>(null);
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);
  const [selectedBookingForManage, setSelectedBookingForManage] = useState<Booking | null>(null);

  // Load Initial Storage Data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setBookings(storageService.getBookings());
    setRewardsUser(storageService.getRewardsUser());
    setSavedTravelers(storageService.getSavedTravelers());
    setSavedPayments(storageService.getSavedPayments());
    setNotifications(storageService.getNotifications());
  };

  // Search Action
  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setSelectedCabinClass(params.cabinClass);
    setIsSearching(true);
    setActiveTab('search');

    setTimeout(() => {
      const results = generateMockFlights(
        params.origin.code,
        params.destination.code,
        params.departureDate,
        params.cabinClass
      );
      setSearchResults(results);
      setHasSearched(true);
      setIsSearching(false);

      // Scroll smoothly down to results container
      const resultsEl = document.getElementById('search-results-section');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 450);
  };

  // Flight Selection -> Open Checkout Modal
  const handleSelectFlight = (flight: Flight, cabin?: CabinClass) => {
    if (cabin) {
      setSelectedCabinClass(cabin);
    }
    setSelectedFlightForBooking(flight);
  };

  // Booking Confirmation Handler
  const handleConfirmBooking = (newBooking: Booking) => {
    storageService.saveBooking(newBooking);

    // If points used, deduct from user balance; if cash paid, add 5x miles
    const currentUser = storageService.getRewardsUser();
    let newBalance = currentUser.pointsBalance;
    if (newBooking.fareBreakdown.pointsUsed > 0) {
      newBalance = Math.max(0, newBalance - newBooking.fareBreakdown.pointsUsed);
    } else {
      const earned = Math.round(newBooking.fareBreakdown.cashPaid * 5);
      newBalance += earned;
    }

    const updatedUser: SkyRewardsUser = {
      ...currentUser,
      pointsBalance: newBalance,
      lifetimePoints: currentUser.lifetimePoints + Math.round(newBooking.fareBreakdown.cashPaid * 2),
      tierPointsThisYear: currentUser.tierPointsThisYear + Math.round(newBooking.fareBreakdown.cashPaid * 2),
      activities: [
        {
          id: `act-${Date.now()}`,
          title: `Flight Reservation ${newBooking.id}`,
          date: 'Today',
          points: newBooking.fareBreakdown.pointsUsed > 0 ? -newBooking.fareBreakdown.pointsUsed : Math.round(newBooking.fareBreakdown.cashPaid * 5),
          type: newBooking.fareBreakdown.pointsUsed > 0 ? 'redeemed' : 'earned',
          description: `${newBooking.flight.origin.code} to ${newBooking.flight.destination.code} (${newBooking.flight.airline})`,
        },
        ...currentUser.activities,
      ],
    };
    storageService.updateRewardsUser(updatedUser);

    // Add Travel Notification
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      type: 'checkin',
      title: 'Booking Confirmed!',
      message: `Reservation ${newBooking.id} (${newBooking.flight.origin.code} ➔ ${newBooking.flight.destination.code}) confirmed. E-ticket issued.`,
      timestamp: 'Just now',
      read: false,
    });

    refreshData();
    setSelectedFlightForBooking(null);

    // Open boarding pass immediately or switch to dashboard
    setSelectedBookingForPass(newBooking);
  };

  // Online Check-in
  const handleCheckIn = (bookingId: string) => {
    const updated = storageService.checkInBooking(bookingId);
    if (updated) {
      storageService.addNotification({
        id: `notif-${Date.now()}`,
        type: 'boarding',
        title: 'Check-In Complete',
        message: `Boarding pass for flight ${updated.flight.flightNumber} is ready. Gate ${updated.flight.gate}, Terminal ${updated.flight.terminal}.`,
        timestamp: 'Just now',
        read: false,
      });
      refreshData();
      setSelectedBookingForPass(updated);
    }
  };

  // Update Booking (Seat, Meal, Baggage)
  const handleUpdateBooking = (updated: Booking) => {
    storageService.updateBooking(updated);
    refreshData();
    if (selectedBookingForManage?.id === updated.id) {
      setSelectedBookingForManage(updated);
    }
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: string, refundMethod: 'points' | 'cash' | 'voucher') => {
    storageService.cancelBooking(bookingId, refundMethod);
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      type: 'delay',
      title: 'Flight Cancelled & Refunded',
      message: `Reservation ${bookingId} was successfully cancelled. Refund processed via ${refundMethod}.`,
      timestamp: 'Just now',
      read: false,
    });
    refreshData();
  };

  // Subscribe to Flight Status
  const handleSubscribeAlerts = (flightNumber: string) => {
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      type: 'gate_change',
      title: `Subscribed to ${flightNumber}`,
      message: `You will now receive instant push & SMS gate, baggage, and departure notices for ${flightNumber}.`,
      timestamp: 'Just now',
      read: false,
    });
    refreshData();
  };

  // Traveler and Payment Management
  const handleSaveTraveler = (traveler: Traveler) => {
    storageService.saveTraveler(traveler);
    refreshData();
  };

  const handleDeleteTraveler = (id: string) => {
    storageService.deleteTraveler(id);
    refreshData();
  };

  const handleSavePayment = (payment: SavedPaymentMethod) => {
    storageService.savePayment(payment);
    refreshData();
  };

  const handleDeletePayment = (id: string) => {
    storageService.deletePayment(id);
    refreshData();
  };

  // Notification Handling
  const handleDismissNotification = (id: string) => {
    storageService.dismissNotification(id);
    refreshData();
  };

  const handleNotificationClick = (notif: TravelNotification) => {
    if (notif.flightNumber) {
      setActiveTab('status');
    } else {
      setActiveTab('dashboard');
    }
  };

  if (!rewardsUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-emerald-900/30"></div>
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 text-center space-y-3">
          <Plane className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
          <p className="font-bold text-sm text-slate-300">Preparing AeroVoyage SkySuite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-indigo-500 selection:text-white">
      {/* Frosted Glass Atmospheric Ambient Background Meshes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-emerald-900/30" />
        <div className="absolute top-[-100px] right-[-100px] w-96 sm:w-[500px] h-96 sm:h-[500px] bg-indigo-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-96 sm:w-[500px] h-96 sm:h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rewardsUser={rewardsUser}
        notifications={notifications}
        onMarkNotificationRead={handleDismissNotification}
      />

      {/* Main App Content Views */}
      <main className="relative z-10 flex-1 pb-16">
        {/* VIEW 1: SEARCH & FLIGHT RESULTS */}
        {activeTab === 'search' && (
          <div>
            {/* Search Hero */}
            <FlightSearchHero
              onSearch={handleSearch}
              currentParams={searchParams}
              initialCriteria={searchParams}
              rewardsBalance={rewardsUser?.pointsBalance || 0}
              rewardsUser={rewardsUser}
              userName={rewardsUser?.name || 'Fatima Irfan'}
              onNavigateTab={setActiveTab}
            />

            {/* Feature Highlights Strip */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white">Zero Hidden Fees</h5>
                    <p className="text-[11px] text-slate-400">Taxes &amp; bag allowance upfront</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white">Cash + Points Slider</h5>
                    <p className="text-[11px] text-slate-400">Flexible hybrid redemption</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white">24-Hr Free Cancel</h5>
                    <p className="text-[11px] text-slate-400">100% instant full refunds</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white">SkyRewards 5x Miles</h5>
                    <p className="text-[11px] text-slate-400">Earn tier points on every leg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div id="search-results-section">
              {isSearching ? (
                <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-indigo-600/30">
                    <Plane className="w-6 h-6 rotate-45" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Scanning 48 Airlines &amp; Global Alliances...</h4>
                  <p className="text-xs text-slate-400">Finding the lowest fares, shortest layovers, and best SkyPoint rates</p>
                </div>
              ) : (
                <FlightSearchResults
                  flights={searchResults}
                  searchParams={searchParams}
                  criteria={searchParams}
                  userPointsBalance={rewardsUser?.pointsBalance || 0}
                  onSelectFlight={handleSelectFlight}
                  onModifySearch={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE FLIGHT STATUS */}
        {activeTab === 'status' && (
          <FlightStatusTracker onSubscribeAlerts={handleSubscribeAlerts} />
        )}

        {/* VIEW 3 & 4: USER DASHBOARD & SKYREWARDS */}
        {(activeTab === 'dashboard' || activeTab === 'rewards') && (
          <UserDashboard
            bookings={bookings}
            rewardsUser={rewardsUser}
            travelers={savedTravelers}
            payments={savedPayments}
            onCheckIn={handleCheckIn}
            onOpenManageBooking={(booking) => setSelectedBookingForManage(booking)}
            onOpenBoardingPass={(booking) => setSelectedBookingForPass(booking)}
            onSaveTraveler={handleSaveTraveler}
            onDeleteTraveler={handleDeleteTraveler}
            onSavePayment={handleSavePayment}
            onDeletePayment={handleDeletePayment}
          />
        )}
      </main>

      {/* Booking Checkout Modal Flow */}
      {selectedFlightForBooking && (
        <BookingCheckoutModal
          flight={selectedFlightForBooking}
          cabinClass={selectedCabinClass}
          passengerCount={searchParams.passengers}
          criteria={searchParams}
          rewardsUser={rewardsUser}
          savedTravelers={savedTravelers}
          savedPayments={savedPayments}
          onBookingComplete={handleConfirmBooking}
          onConfirmBooking={handleConfirmBooking}
          onClose={() => setSelectedFlightForBooking(null)}
          onOpenBoardingPass={(booking) => {
            setSelectedFlightForBooking(null);
            setSelectedBookingForPass(booking);
          }}
        />
      )}

      {/* Boarding Pass Modal */}
      {selectedBookingForPass && (
        <BoardingPassModal
          booking={selectedBookingForPass}
          onClose={() => setSelectedBookingForPass(null)}
        />
      )}

      {/* Manage Booking Modal */}
      {selectedBookingForManage && (
        <ManageBookingModal
          booking={selectedBookingForManage}
          onUpdateBooking={handleUpdateBooking}
          onCancelBooking={handleCancelBooking}
          onOpenBoardingPass={(booking) => {
            setSelectedBookingForManage(null);
            setSelectedBookingForPass(booking);
          }}
          onClose={() => setSelectedBookingForManage(null)}
        />
      )}

      {/* Global Footer */}
      <footer className="relative z-10 bg-slate-950/80 backdrop-blur-md text-slate-400 border-t border-white/10 text-xs py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-600/30">
                <Plane className="w-5 h-5 rotate-45" />
              </div>
              <span className="text-white font-extrabold text-base tracking-wider font-['Space_Grotesk'] bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                AEROVOYAGE <span className="text-indigo-400">SKYSUITE</span>
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                IATA &amp; FAA Certified
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-indigo-400" />
                Global Alliance Partner
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                256-Bit SSL Encrypted Checkout
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} AeroVoyage Airlines Global Reservation &amp; SkyRewards Network. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('search')} className="hover:text-white transition-colors">
                Search Flights
              </button>
              <button onClick={() => setActiveTab('status')} className="hover:text-white transition-colors">
                Flight Radar
              </button>
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                Manage Booking
              </button>
              <button onClick={() => setActiveTab('rewards')} className="hover:text-white transition-colors">
                SkyRewards
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
