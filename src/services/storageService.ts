import { Booking, SavedPaymentMethod, SkyRewardsUser, TravelNotification, Traveler } from '../types/airline';
import { POPULAR_AIRPORTS } from '../data/mockAirports';

const STORAGE_KEYS = {
  BOOKINGS: 'aerovoyage_bookings',
  REWARDS_USER: 'aerovoyage_rewards_user',
  TRAVELERS: 'aerovoyage_travelers',
  PAYMENTS: 'aerovoyage_payments',
  NOTIFICATIONS: 'aerovoyage_notifications',
  CURRENCY: 'aerovoyage_currency',
};

const INITIAL_REWARDS_USER: SkyRewardsUser = {
  id: 'usr-fatima-001',
  name: 'Fatima Irfan',
  email: 'fatima.irfan@skyvoyage.com',
  phone: '+1 (555) 234-8900',
  memberNumber: 'AV-982-140-GLD',
  tier: 'Gold',
  pointsBalance: 78500,
  tierPointsThisYear: 38200,
  tierGoal: 50000,
  lifetimePoints: 184500,
  pointsExpiringSoon: 4500,
  expiryDate: 'Dec 31, 2026',
  activities: [
    {
      id: 'act-1',
      date: '2026-08-18',
      title: 'Flight AV-304: SFO → HND',
      description: 'Business Class + 25% Gold Tier Bonus',
      points: 8400,
      type: 'earned',
      flightNumber: 'AV-304',
    },
    {
      id: 'act-2',
      date: '2026-07-04',
      title: 'SkyRewards Partner Hotel Stay',
      description: 'Park Hyatt Tokyo 3 nights',
      points: 2500,
      type: 'earned',
    },
    {
      id: 'act-3',
      date: '2026-05-12',
      title: 'Flight Redemption: JFK → CDG',
      description: 'Award travel ticket in Economy',
      points: -45000,
      type: 'redeemed',
      flightNumber: 'AV-512',
    },
    {
      id: 'act-4',
      date: '2026-03-20',
      title: 'Flight AV-104: JFK → LHR',
      description: 'Premium Economy ticket',
      points: 5200,
      type: 'earned',
      flightNumber: 'AV-104',
    },
  ],
};

const INITIAL_TRAVELERS: Traveler[] = [
  {
    id: 'trv-1',
    title: 'Ms',
    firstName: 'Fatima',
    lastName: 'Irfan',
    email: 'fatima.irfan@skyvoyage.com',
    phone: '+1 (555) 234-8900',
    dob: '1995-06-14',
    passportNumber: 'P892019482',
    nationality: 'United States',
    frequentFlyerNumber: 'AV-982-140-GLD',
    mealPreference: 'Chef Signature / Standard',
    seatNumber: '12A',
    isSaved: true,
  },
  {
    id: 'trv-2',
    title: 'Ms',
    firstName: 'Sophia',
    lastName: 'Irfan',
    email: 'sophia.irfan@skyvoyage.com',
    phone: '+1 (555) 234-8901',
    dob: '1992-11-22',
    passportNumber: 'P741029381',
    nationality: 'United States',
    frequentFlyerNumber: 'AV-982-141-SLV',
    mealPreference: 'Vegetarian Lacto-Ovo',
    seatNumber: '12B',
    isSaved: true,
  },
];

const INITIAL_PAYMENTS: SavedPaymentMethod[] = [
  {
    id: 'card-1',
    cardType: 'amex',
    last4: '1004',
    cardholderName: 'Fatima Irfan',
    expiryDate: '09/28',
    isDefault: true,
  },
  {
    id: 'card-2',
    cardType: 'visa',
    last4: '4821',
    cardholderName: 'Fatima Irfan',
    expiryDate: '12/27',
    isDefault: false,
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'AV-89241K',
    flightId: 'FL-JFK-LHR-AV-104-0',
    flight: {
      id: 'FL-JFK-LHR-AV-104-0',
      flightNumber: 'AV-104',
      airline: 'AeroVoyage Flagship',
      airlineCode: 'AV',
      aircraft: 'Boeing 787-9 Dreamliner',
      origin: POPULAR_AIRPORTS[0], // JFK
      destination: POPULAR_AIRPORTS[1], // LHR
      departureDate: '2026-09-12',
      departureTime: '08:30 AM',
      arrivalTime: '08:40 PM',
      duration: '7h 10m',
      durationMinutes: 430,
      stops: 0,
      cabinClasses: {
        economy: { available: true, cashPrice: 620, pointsPrice: 42000, seatsLeft: 8 },
        premium_economy: { available: true, cashPrice: 960, pointsPrice: 62000, seatsLeft: 4 },
        business: { available: true, cashPrice: 2200, pointsPrice: 135000, seatsLeft: 2 },
      },
      baggage: { carryOn: '1 Personal + 1 Carry-on (10kg)', checked: '2 Checked Bags (23kg)' },
      amenities: { wifi: true, power: true, meal: true, entertainment: true, lieFlatSeats: true },
      status: 'On Time',
      terminal: '4',
      gate: 'B28',
      baggageClaim: 'Belt 4',
      weather: { temp: '20°C / 68°F', condition: 'Partly Cloudy in London' },
    },
    cabinClass: 'business',
    tripType: 'one-way',
    travelers: [
      {
        id: 'trv-1',
        title: 'Ms',
        firstName: 'Fatima',
        lastName: 'Irfan',
        email: 'fatima.irfan@skyvoyage.com',
        passportNumber: 'P892019482',
        seatNumber: '2A',
        mealPreference: 'Signature Beef Tenderloin',
      },
    ],
    bookingDate: '2026-08-25',
    paymentMethod: 'points_plus_cash',
    fareBreakdown: {
      baseFare: 1800,
      taxesAndFees: 145,
      seatFees: 0,
      baggageFees: 0,
      discountAmount: 1200,
      pointsUsed: 75000,
      cashPaid: 745,
      totalUsd: 745,
    },
    baggageAddons: { extraBags: 0, cost: 0 },
    status: 'confirmed',
    barcode: 'M1IRFAN/FATIMA       EAV89241K JFKLHRAV 0104 255Y002A0012 147',
    boardingGroup: 'Group 1 (Priority SkyPriority)',
    eTicketIssued: true,
  },
  {
    id: 'AV-71402P',
    flightId: 'FL-SFO-HND-AV-304-PAST',
    flight: {
      id: 'FL-SFO-HND-AV-304-PAST',
      flightNumber: 'AV-304',
      airline: 'AeroVoyage Flagship',
      airlineCode: 'AV',
      aircraft: 'Airbus A350-1000',
      origin: POPULAR_AIRPORTS[6], // SFO
      destination: POPULAR_AIRPORTS[2], // HND
      departureDate: '2026-08-18',
      departureTime: '11:40 AM',
      arrivalTime: '03:15 PM (+1)',
      duration: '11h 35m',
      durationMinutes: 695,
      stops: 0,
      cabinClasses: {
        economy: { available: true, cashPrice: 890, pointsPrice: 58000, seatsLeft: 0 },
      },
      baggage: { carryOn: '1 Carry-on', checked: '2 Checked Bags' },
      amenities: { wifi: true, power: true, meal: true, entertainment: true, lieFlatSeats: true },
      status: 'Landed',
      terminal: 'Intl G',
      gate: 'G98',
      baggageClaim: 'Carousel 2',
    },
    cabinClass: 'business',
    tripType: 'one-way',
    travelers: [
      {
        id: 'trv-1',
        title: 'Ms',
        firstName: 'Fatima',
        lastName: 'Irfan',
        email: 'fatima.irfan@skyvoyage.com',
        passportNumber: 'P892019482',
        seatNumber: '4K',
        mealPreference: 'Japanese Kaiseki Selection',
      },
    ],
    bookingDate: '2026-07-20',
    paymentMethod: 'cash',
    fareBreakdown: {
      baseFare: 3100,
      taxesAndFees: 240,
      seatFees: 0,
      baggageFees: 0,
      discountAmount: 0,
      pointsUsed: 0,
      cashPaid: 3340,
      totalUsd: 3340,
    },
    baggageAddons: { extraBags: 0, cost: 0 },
    status: 'completed',
    checkedInAt: '2026-08-17T18:30:00Z',
    barcode: 'M1IRFAN/FATIMA       EAV71402P SFOHNDAV 0304 230Y004K0008 100',
    boardingGroup: 'Group 1',
    eTicketIssued: true,
  },
];

const INITIAL_NOTIFICATIONS: TravelNotification[] = [
  {
    id: 'notif-1',
    type: 'checkin',
    title: 'Check-in is Ready for AV-104',
    message: 'Online check-in is now open for your flight to London Heathrow (LHR). Select seats & get boarding passes.',
    timestamp: '10m ago',
    read: false,
    flightNumber: 'AV-104',
    badge: 'Action Required',
  },
  {
    id: 'notif-2',
    type: 'reward',
    title: 'SkyRewards Bonus Credited',
    message: '8,400 SkyPoints have been added to your account for your Tokyo flight.',
    timestamp: '2d ago',
    read: true,
    badge: '+8,400 pts',
  },
  {
    id: 'notif-3',
    type: 'gate_change',
    title: 'Gate Update: AV-104',
    message: 'Flight AV-104 departs from JFK Terminal 4, Gate B28. Baggage drops open 3 hours prior.',
    timestamp: '1d ago',
    read: true,
    flightNumber: 'AV-104',
  },
];

export const storageService = {
  // Bookings
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) return INITIAL_BOOKINGS;
      const parsed: Booking[] = JSON.parse(data);
      let changed = false;
      parsed.forEach((b) => {
        if (b.travelers && b.travelers.length > 0) {
          if (b.travelers[0].firstName !== 'Fatima' || b.travelers[0].lastName !== 'Irfan') {
            b.travelers[0].firstName = 'Fatima';
            b.travelers[0].lastName = 'Irfan';
            b.travelers[0].email = 'fatima.irfan@skyvoyage.com';
            changed = true;
          }
        }
        if (b.barcode && b.barcode.includes('WRIGHT/ALEXANDER')) {
          b.barcode = b.barcode.replace('WRIGHT/ALEXANDER', 'IRFAN/FATIMA');
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  saveBooking(booking: Booking): void {
    const list = this.getBookings();
    list.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));

    // Also deduct points if points were used
    if (booking.fareBreakdown.pointsUsed > 0) {
      this.deductPoints(booking.fareBreakdown.pointsUsed, `Redemption: Flight ${booking.flight.flightNumber}`);
    } else {
      // Award 5x points for cash bookings!
      const earned = Math.round(booking.fareBreakdown.cashPaid * 5);
      this.awardPoints(earned, `Earned on Flight ${booking.flight.flightNumber}`);
    }

    // Add confirmation notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      type: 'checkin',
      title: `Booking Confirmed: ${booking.id}`,
      message: `Your flight ${booking.flight.flightNumber} from ${booking.flight.origin.code} to ${booking.flight.destination.code} is confirmed!`,
      timestamp: 'Just now',
      read: false,
      flightNumber: booking.flight.flightNumber,
      badge: 'Confirmed',
    });
  },

  updateBooking(updated: Booking): void {
    const list = this.getBookings().map((b) => (b.id === updated.id ? updated : b));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
  },

  checkInBooking(bookingId: string): Booking | null {
    const list = this.getBookings();
    const idx = list.findIndex((b) => b.id === bookingId);
    if (idx === -1) return null;

    list[idx].status = 'checked-in';
    list[idx].checkedInAt = new Date().toISOString();
    list[idx].boardingGroup = list[idx].boardingGroup || 'Group 2';
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));

    this.addNotification({
      id: `notif-${Date.now()}`,
      type: 'boarding',
      title: `Checked In: ${list[idx].flight.flightNumber}`,
      message: `You are checked in! Boarding pass ready for Gate ${list[idx].flight.gate || 'B28'}.`,
      timestamp: 'Just now',
      read: false,
      flightNumber: list[idx].flight.flightNumber,
      badge: 'Boarding Ready',
    });

    return list[idx];
  },

  cancelBooking(bookingId: string, refundMethod: 'points' | 'cash' | 'voucher'): Booking | null {
    const list = this.getBookings();
    const idx = list.findIndex((b) => b.id === bookingId);
    if (idx === -1) return null;

    const b = list[idx];
    const refundAmount = b.fareBreakdown.cashPaid || b.fareBreakdown.pointsUsed;

    b.status = 'cancelled';
    b.cancellationDetails = {
      cancelledAt: new Date().toISOString(),
      refundType: refundMethod,
      refundAmount: refundAmount,
      voucherCode: refundMethod === 'voucher' ? `VOYAGE-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : undefined,
    };

    if (refundMethod === 'points' && b.fareBreakdown.pointsUsed > 0) {
      this.awardPoints(b.fareBreakdown.pointsUsed, `Refund for cancelled booking ${b.id}`);
    }

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));

    this.addNotification({
      id: `notif-${Date.now()}`,
      type: 'delay',
      title: `Booking Cancelled: ${b.id}`,
      message: `Your booking for ${b.flight.flightNumber} was successfully cancelled. Refund processed via ${refundMethod}.`,
      timestamp: 'Just now',
      read: false,
      badge: 'Refunded',
    });

    return b;
  },

  // Rewards
  getRewardsUser(): SkyRewardsUser {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REWARDS_USER);
      if (!data) return INITIAL_REWARDS_USER;
      const user: SkyRewardsUser = JSON.parse(data);
      if (user.name !== 'Fatima Irfan') {
        user.name = 'Fatima Irfan';
        user.email = 'fatima.irfan@skyvoyage.com';
        localStorage.setItem(STORAGE_KEYS.REWARDS_USER, JSON.stringify(user));
      }
      return user;
    } catch {
      return INITIAL_REWARDS_USER;
    }
  },

  deductPoints(points: number, reason: string): void {
    const user = this.getRewardsUser();
    user.pointsBalance = Math.max(0, user.pointsBalance - points);
    user.activities.unshift({
      id: `act-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: reason,
      description: 'Miles redemption for flight booking',
      points: -points,
      type: 'redeemed',
    });
    localStorage.setItem(STORAGE_KEYS.REWARDS_USER, JSON.stringify(user));
  },

  awardPoints(points: number, reason: string): void {
    const user = this.getRewardsUser();
    user.pointsBalance += points;
    user.tierPointsThisYear += points;
    user.lifetimePoints += points;
    user.activities.unshift({
      id: `act-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: reason,
      description: 'SkyRewards credited to your account',
      points: points,
      type: 'earned',
    });
    localStorage.setItem(STORAGE_KEYS.REWARDS_USER, JSON.stringify(user));
  },

  // Saved Travelers
  getTravelers(): Traveler[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRAVELERS);
      if (!data) return INITIAL_TRAVELERS;
      const list: Traveler[] = JSON.parse(data);
      if (list.length > 0) {
        if (list[0].firstName !== 'Fatima' || list[0].lastName !== 'Irfan') {
          list[0].firstName = 'Fatima';
          list[0].lastName = 'Irfan';
          list[0].email = 'fatima.irfan@skyvoyage.com';
          localStorage.setItem(STORAGE_KEYS.TRAVELERS, JSON.stringify(list));
        }
      }
      return list;
    } catch {
      return INITIAL_TRAVELERS;
    }
  },

  saveTraveler(traveler: Traveler): void {
    const list = this.getTravelers();
    const idx = list.findIndex((t) => t.id === traveler.id);
    if (idx >= 0) {
      list[idx] = traveler;
    } else {
      list.push(traveler);
    }
    localStorage.setItem(STORAGE_KEYS.TRAVELERS, JSON.stringify(list));
  },

  deleteTraveler(id: string): void {
    const list = this.getTravelers().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRAVELERS, JSON.stringify(list));
  },

  // Saved Payments
  getPayments(): SavedPaymentMethod[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (!data) return INITIAL_PAYMENTS;
      const list: SavedPaymentMethod[] = JSON.parse(data);
      let changed = false;
      list.forEach((p) => {
        if (p.cardholderName !== 'Fatima Irfan') {
          p.cardholderName = 'Fatima Irfan';
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
      }
      return list;
    } catch {
      return INITIAL_PAYMENTS;
    }
  },

  savePayment(payment: SavedPaymentMethod): void {
    const list = this.getPayments();
    if (payment.isDefault) {
      list.forEach((p) => (p.isDefault = false));
    }
    list.push(payment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
  },

  deletePayment(id: string): void {
    const list = this.getPayments().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
  },

  // Notifications
  getNotifications(): TravelNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  addNotification(notif: TravelNotification): void {
    const list = this.getNotifications();
    list.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  dismissNotification(id: string): void {
    const list = this.getNotifications().filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  updateRewardsUser(user: SkyRewardsUser): void {
    localStorage.setItem(STORAGE_KEYS.REWARDS_USER, JSON.stringify(user));
  },

  getSavedTravelers(): Traveler[] {
    return this.getTravelers();
  },

  getSavedPayments(): SavedPaymentMethod[] {
    return this.getPayments();
  },
};
