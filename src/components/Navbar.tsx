import React, { useState } from 'react';
import { 
  Plane, 
  Search, 
  Compass, 
  Ticket, 
  Award, 
  Bell, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { SkyRewardsUser, TravelNotification } from '../types/airline';

interface NavbarProps {
  activeTab: 'search' | 'status' | 'dashboard' | 'rewards';
  setActiveTab: (tab: 'search' | 'status' | 'dashboard' | 'rewards') => void;
  rewardsUser: SkyRewardsUser;
  notifications: TravelNotification[];
  onMarkNotificationRead: (id: string) => void;
  onOpenCheckInModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  rewardsUser,
  notifications,
  onMarkNotificationRead,
  onOpenCheckInModal,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-md text-white border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-200">
              <Plane className="w-6 h-6 rotate-45 transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 font-['Space_Grotesk']">
                  AERO<span className="text-indigo-400">VOYAGE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Global
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                SkySuite &amp; SkyRewards
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <button
              id="nav-search-btn"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              Book Flights
            </button>

            <button
              id="nav-status-btn"
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'status'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              Flight Status
            </button>

            <button
              id="nav-dashboard-btn"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Ticket className="w-4 h-4" />
              My Trips &amp; Check-In
            </button>

            <button
              id="nav-rewards-btn"
              onClick={() => setActiveTab('rewards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'rewards'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" />
              SkyRewards
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick Rewards Status Pill */}
            <div 
              id="rewards-pill-header"
              onClick={() => setActiveTab('rewards')}
              className="hidden lg:flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full cursor-pointer transition-all group backdrop-blur-md"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                ★
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    {rewardsUser.tier}
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {rewardsUser.pointsBalance.toLocaleString()} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-white/10 backdrop-blur-md"
                aria-label="Travel alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifMenu && (
                <div 
                  id="notifications-dropdown-card"
                  className="absolute right-0 mt-3 w-84 sm:w-96 bg-slate-950/90 backdrop-blur-2xl text-slate-100 rounded-2xl shadow-2xl border border-white/15 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">Travel Alerts &amp; Updates</h4>
                      <p className="text-xs text-slate-400">Live gate notices &amp; flight status</p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className={`p-4 transition-colors cursor-pointer hover:bg-white/5 ${
                            !notif.read ? 'bg-white/[0.03]' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {notif.type === 'checkin' ? (
                                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              ) : notif.type === 'gate_change' ? (
                                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                  <AlertCircle className="w-4 h-4" />
                                </div>
                              ) : notif.type === 'reward' ? (
                                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                  <Award className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                                  <Clock className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-xs font-bold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                                  {notif.title}
                                </p>
                                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                  {notif.timestamp}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {notif.message}
                              </p>
                              {notif.badge && (
                                <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                                  {notif.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 bg-slate-950/80 border-t border-white/10 text-center">
                    <button
                      onClick={() => {
                        setShowNotifMenu(false);
                        setActiveTab('dashboard');
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View All Travel Alerts in Dashboard →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <button
              id="user-profile-header-btn"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 py-1 px-2.5 sm:px-3 rounded-full transition-all backdrop-blur-md"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 border border-white/20 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                {rewardsUser?.name
                  ? rewardsUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                  : 'FI'}
              </div>
              <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                <span>{rewardsUser?.name || 'Fatima Irfan'}</span>
                <span className="hidden md:inline-block px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  Gold
                </span>
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-150">
          {/* User profile card inside mobile menu */}
          <div 
            onClick={() => {
              setActiveTab('dashboard');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 p-3.5 mb-2 rounded-2xl bg-white/10 border border-white/15 cursor-pointer hover:bg-white/15 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white font-bold text-sm flex items-center justify-center shadow-md">
              FI
            </div>
            <div>
              <div className="text-sm font-bold text-white">{rewardsUser?.name || 'Fatima Irfan'}</div>
              <div className="text-xs text-slate-300 font-medium">Gold Member • {rewardsUser.pointsBalance.toLocaleString()} SkyPoints</div>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('search');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
              activeTab === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4" /> Book Flights
          </button>
          <button
            onClick={() => {
              setActiveTab('status');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
              activeTab === 'status' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" /> Real-Time Flight Status
          </button>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Ticket className="w-4 h-4" /> My Trips, Check-In &amp; Passes
          </button>
          <button
            onClick={() => {
              setActiveTab('rewards');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
              activeTab === 'rewards' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" /> SkyRewards Hub ({rewardsUser.pointsBalance.toLocaleString()} pts)
          </button>
        </div>
      )}
    </header>
  );
};
