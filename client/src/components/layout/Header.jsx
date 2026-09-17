import { Heart, LayoutDashboard, LogOut, Menu, ShoppingCart, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import nexarionLogo from '../../assets/nexarion_logo.png';
import { logout } from '../../store/slices/authSlice';
import CurrencySelector from '../CurrencySelector';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems: cartCount } = useSelector((state) => state.cart);
  const { totalItems: favoritesCount } = useSelector((state) => state.favorites);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
        setIsRotating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setIsRotating(!isRotating);
  };

  const handleLogoutClick = () => {
    setShowProfileDropdown(false);
    setIsRotating(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // Clear localStorage first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Then dispatch logout
    dispatch(logout());
    setShowLogoutModal(false);
    // Hard navigate to home to ensure clean state
    window.location.href = '/';
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  // Format account type
  const getAccountType = () => {
    if (!user || !user.role) return 'USER';
    return user.role.toUpperCase();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Catalogs', path: '/catalogs' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[999] bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 shadow-[0_2px_20px_rgba(0,0,0,0.4)] border-b-2 border-emerald-400/40" style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[60px] w-full">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
              <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-xl text-white">Nexarion</h1>
              <p className="text-[10px] text-emerald-400 font-semibold">Global Exports</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm text-slate-200 font-semibold hover:text-emerald-400 transition-colors py-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-gradient-to-r after:from-emerald-400 after:to-yellow-400 after:rounded-full hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Currency Selector */}
            <CurrencySelector compact />

            {isAuthenticated && (
              <>
                {/* Favorites Button */}
                <Link
                  to="/dashboard/favorites"
                  className="relative group p-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/50 rounded-xl transition-all duration-300"
                  title="Favorites"
                >
                  <Heart className="w-5 h-5 text-slate-300 group-hover:text-red-400 group-hover:fill-red-400/30 transition-all duration-300" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </span>
                  )}
                </Link>

                {/* Cart Button */}
                <Link
                  to="/cart"
                  className="relative group p-2.5 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/50 rounded-xl transition-all duration-300"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-all duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Avatar Button */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-emerald-400/40 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md transition-transform duration-500 ${
                      isRotating ? 'rotate-[360deg]' : 'rotate-0'
                    }`}
                  >
                    {getUserInitials()}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-xs leading-tight">{user?.name || 'User'}</p>
                    <p className="text-emerald-400 text-[10px] font-medium leading-tight">{getAccountType()}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 animate-fadeIn z-50">
                    {/* Notification Badge */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></div>

                    {/* User Info Header */}
                    <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-3 border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {getUserInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{user?.name || 'User'}</p>
                          <p className="text-emerald-400 text-[10px] font-semibold">{getAccountType()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setIsRotating(false);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LayoutDashboard className="text-emerald-400" size={16} />
                        </div>
                        <span className="text-white font-semibold text-xs">Dashboard</span>
                      </Link>

                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LogOut className="text-red-400" size={16} />
                        </div>
                        <span className="text-white font-semibold text-xs">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white rounded-xl hover:bg-white hover:text-slate-900 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions Section - Cart, Favorites, Currency & Hamburger Together */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            {/* Mobile Currency Selector */}
            <div className="flex items-center flex-shrink-0">
              <CurrencySelector compact />
            </div>

            {/* Mobile Sign In Button - When Not Authenticated */}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-4 py-2 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white hover:text-slate-900 transition-all text-xs font-bold flex-shrink-0"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Favorites Button */}
            {isAuthenticated && (
              <Link
                to="/dashboard/favorites"
                className="relative group w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-300 flex-shrink-0"
                title="Favorites"
              >
                <Heart className="w-5 h-5 text-slate-300 group-hover:text-red-400 group-hover:fill-red-400/30 transition-all duration-300" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Cart Button */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className="relative group w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-300 flex-shrink-0"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-all duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger Menu Button - Always Visible */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white flex-shrink-0 z-[1000]"
              style={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? 'max-h-[85vh] opacity-100 translate-y-0 border-t border-slate-700 py-4'
              : 'max-h-0 opacity-0 -translate-y-1 border-t border-slate-700/0 py-0 pointer-events-none'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div
            className={`flex flex-col gap-4 transition-transform duration-300 ease-out ${
              mobileMenuOpen ? 'translate-y-0' : '-translate-y-2'
            }`}
          >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 font-semibold transition-all duration-200 rounded-lg px-3 py-2 hover:bg-white/10 hover:text-emerald-300 active:bg-emerald-500/20 active:text-emerald-200 active:translate-x-1 active:scale-[0.98]"
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Currency Selector */}
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Currency</span>
                <CurrencySelector compact />
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-6 py-2.5 bg-white/10 border-2 border-white/40 text-white rounded-xl font-bold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-xl font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-6 py-2.5 bg-white/10 border-2 border-white/40 text-white rounded-xl font-bold"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
      </div>
    </nav>

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scaleIn">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Confirm Logout</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Header;
