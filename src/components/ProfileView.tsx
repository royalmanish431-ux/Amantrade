import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  LogOut,
  Edit2,
  Clock,
  ShieldCheck,
  Store,
  RotateCcw,
  ChevronRight,
  UserCheck,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { Order, UserProfile } from '../types';
import { loginUser, registerUser, updateUserProfile } from '../services/userService';

interface ProfileViewProps {
  orders: Order[];
  currentUser: UserProfile | null;
  onUserLogin: (user: UserProfile) => void;
  onUserLogout: () => void;
  onUpdateProfile: (user: UserProfile) => void;
  onOpenOwnerPortal: () => void;
  onOpenAddressModal: () => void;
  currentAddress: string;
  onReorder: (order: Order) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  currentUser,
  onUserLogin,
  onUserLogout,
  onUpdateProfile,
  onOpenOwnerPortal,
  onOpenAddressModal,
  currentAddress,
  onReorder,
}) => {
  // Auth Form State (Login / Sign Up)
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Login inputs (Login by Contact Number + 5-digit password)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up inputs (Name, Contact Number, Email, Address, 5-digit password)
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupAddress, setSignupAddress] = useState(currentAddress || '');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Edit Profile State (when logged in)
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editFeedback, setEditFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync edit form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone);
      setEditEmail(currentUser.email || '');
      setEditAddress(currentUser.address || currentAddress || '');
      setEditPassword(currentUser.password);
    }
  }, [currentUser, currentAddress]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanPhone = loginPhone.trim().replace(/[^0-9]/g, '');
    const cleanPass = loginPassword.trim();

    if (!cleanPhone) {
      setAuthError('Please enter your Contact Number (मोबाइल नंबर दर्ज करें)');
      return;
    }
    if (cleanPhone.length < 10) {
      setAuthError('Contact Number must be 10 digits (10 अंकों का मोबाइल नंबर होना चाहिए)');
      return;
    }
    if (!cleanPass) {
      setAuthError('Please enter your 5-digit password (5 अंकों का पासवर्ड दर्ज करें)');
      return;
    }
    if (cleanPass.length !== 5 || !/^\d{5}$/.test(cleanPass)) {
      setAuthError('Password must be exactly 5 numeric digits (पासवर्ड 5 अंकों का होना चाहिए, e.g. 12345)');
      return;
    }

    const result = loginUser(cleanPhone, cleanPass);
    if (!result.success || !result.user) {
      setAuthError(result.error || 'Login failed. Please check your credentials.');
      return;
    }

    setAuthSuccess('Login successful! Welcome back.');
    onUserLogin(result.user);
  };

  // Handle Sign Up submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanName = signupName.trim();
    const cleanPhone = signupPhone.trim().replace(/[^0-9]/g, '');
    const cleanEmail = signupEmail.trim();
    const cleanAddress = signupAddress.trim() || currentAddress;
    const cleanPass = signupPassword.trim();

    if (!cleanName) {
      setAuthError('Please enter your Name (अपना नाम दर्ज करें)');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setAuthError('Please enter a valid 10-digit Contact Number (10 अंकों का मोबाइल नंबर दर्ज करें)');
      return;
    }
    if (!cleanAddress) {
      setAuthError('Please enter your delivery Address (डिलीवरी पता दर्ज करें)');
      return;
    }
    if (!cleanPass) {
      setAuthError('Please set a 5-digit password (5 अंकों का पासवर्ड बनाएं)');
      return;
    }
    if (cleanPass.length !== 5 || !/^\d{5}$/.test(cleanPass)) {
      setAuthError('Password must be exactly 5 numeric digits (पासवर्ड ठीक 5 अंकों का होना चाहिए, e.g. 12345)');
      return;
    }

    const result = registerUser({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      address: cleanAddress,
      password: cleanPass,
    });

    if (!result.success || !result.user) {
      setAuthError(result.error || 'Sign Up failed. Please check your details.');
      return;
    }

    setAuthSuccess('Account created successfully! Logged in.');
    onUserLogin(result.user);
  };

  // Handle Quick Demo Fill
  const handleQuickDemoFill = () => {
    setLoginPhone('9876543210');
    setLoginPassword('12345');
    setAuthError(null);
  };

  // Handle Edit Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setEditFeedback(null);

    const cleanName = editName.trim();
    const cleanPhone = editPhone.trim().replace(/[^0-9]/g, '');
    const cleanEmail = editEmail.trim();
    const cleanAddress = editAddress.trim();
    const cleanPass = editPassword.trim();

    if (!cleanName) {
      setEditFeedback({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setEditFeedback({ type: 'error', message: 'Please enter a valid 10-digit Contact Number.' });
      return;
    }
    if (cleanPass && (cleanPass.length !== 5 || !/^\d{5}$/.test(cleanPass))) {
      setEditFeedback({ type: 'error', message: 'Password must be exactly 5 numeric digits.' });
      return;
    }

    const res = updateUserProfile(currentUser.id, {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      address: cleanAddress,
      password: cleanPass || currentUser.password,
    });

    if (!res.success || !res.user) {
      setEditFeedback({ type: 'error', message: res.error || 'Failed to update profile.' });
      return;
    }

    onUpdateProfile(res.user);
    setEditFeedback({ type: 'success', message: 'Profile updated successfully!' });
    setTimeout(() => {
      setIsEditing(false);
      setEditFeedback(null);
    }, 1200);
  };

  // ==========================================
  // VIEW 1: NOT LOGGED IN (LOGIN / SIGN UP)
  // ==========================================
  if (!currentUser) {
    return (
      <div className="pb-24 p-4 space-y-4 max-w-md mx-auto">
        {/* Brand Banner */}
        <div className="text-center py-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white font-black text-2xl shadow-md mb-2">
            AT
          </div>
          <h2 className="text-lg font-black text-stone-900">Aman Traders Account</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Login with your Contact Number & 5-digit password to track orders & save delivery address.
          </p>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="bg-stone-100 p-1 rounded-2xl flex items-center border border-stone-200">
          <button
            onClick={() => {
              setAuthTab('login');
              setAuthError(null);
              setAuthSuccess(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authTab === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Login (लॉगिन)
          </button>
          <button
            onClick={() => {
              setAuthTab('signup');
              setAuthError(null);
              setAuthSuccess(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authTab === 'signup'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign Up (नया खाता)
          </button>
        </div>

        {/* Feedback message banner */}
        {authError && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{authError}</span>
          </div>
        )}
        {authSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{authSuccess}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {authTab === 'login' && (
          <form
            onSubmit={handleLoginSubmit}
            className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3.5"
          >
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>Contact Number (मोबाइल नंबर से लॉगिन)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 10-digit number (e.g. 9876543210)"
                  className="w-full pl-12 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-stone-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-600" />
                  <span>5-Digit Password (5 अंकों का पासवर्ड)</span>
                </label>
                <span className="text-[10px] text-stone-400 font-mono">Exactly 5 digits</span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  maxLength={5}
                  inputMode="numeric"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••• (e.g. 12345)"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 tracking-widest font-mono bg-stone-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md hover:from-red-700 hover:to-rose-700 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Login with Contact Number</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick Demo Helper */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Quick test?</span>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-red-600 hover:underline font-bold cursor-pointer"
              >
                Auto-fill Demo (9876543210 / 12345)
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP FORM */}
        {authTab === 'signup' && (
          <form
            onSubmit={handleSignupSubmit}
            className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-600" />
                <span>Full Name (नाम)</span>
              </label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="e.g. Manish Sharma"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-stone-50/50"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>Contact Number (मोबाइल नंबर - लॉगिन के लिए)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full pl-12 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-stone-50/50"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-600" />
                <span>Email Address (ईमेल)</span>
              </label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="e.g. manish@example.com"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-stone-50/50"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Delivery Address (पता)</span>
              </label>
              <textarea
                rows={2}
                value={signupAddress}
                onChange={(e) => setSignupAddress(e.target.value)}
                placeholder="Complete address (House/Shop No., Street, City)"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-stone-50/50 resize-none"
                required
              />
            </div>

            {/* 5-Digit Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-red-600" />
                  <span>Create 5-Digit Password (5 अंकों का पासवर्ड)</span>
                </label>
                <span className="text-[10px] text-stone-400 font-mono">5 Digits</span>
              </div>
              <div className="relative">
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  maxLength={5}
                  inputMode="numeric"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 12345 (exactly 5 digits)"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 tracking-widest font-mono bg-stone-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showSignupPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Note: In future, you will log in using this <strong>Contact Number</strong> and <strong>5-digit Password</strong>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md hover:from-red-700 hover:to-rose-700 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Sign Up & Create Account</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Owner Portal Shortcut */}
        <div
          onClick={onOpenOwnerPortal}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shadow-sm cursor-pointer hover:bg-stone-800 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">Aman Traders Owner Portal</span>
              <span className="text-[11px] text-stone-400">Sync Google Sheet & manage live stock</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LOGGED IN USER PROFILE
  // ==========================================
  return (
    <div className="pb-24 p-4 space-y-4 max-w-md mx-auto">
      {/* User Header Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-white via-rose-50/30 to-amber-50/40 border border-stone-200/90 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md uppercase">
            {currentUser.name.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-stone-900">{currentUser.name}</h3>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-stone-400" />
              <span>+91 {currentUser.phone}</span>
            </p>
            {currentUser.email && (
              <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-stone-400" />
                <span className="truncate max-w-[180px]">{currentUser.email}</span>
              </p>
            )}
            <span className="inline-block px-2 py-0.5 mt-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
              Active Customer Account
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onUserLogout}
          className="p-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200 transition-colors shadow-2xs flex flex-col items-center gap-0.5 cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[9px] font-bold">Logout</span>
        </button>
      </div>

      {/* Switch to Owner Portal Banner */}
      <div
        onClick={onOpenOwnerPortal}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shadow-sm cursor-pointer hover:bg-stone-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold block text-white">Aman Traders Owner Portal</span>
            <span className="text-[11px] text-stone-400">Manage orders, update dishes & inventory</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-400" />
      </div>

      {/* User Profile Details & In-Place Editor */}
      <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-red-600" />
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Profile Details (व्यक्तिगत जानकारी)
            </h4>
          </div>

          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setEditFeedback(null);
            }}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>{isEditing ? 'Cancel' : 'Edit Details'}</span>
          </button>
        </div>

        {editFeedback && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              editFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {editFeedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{editFeedback.message}</span>
          </div>
        )}

        {isEditing ? (
          /* EDIT PROFILE FORM */
          <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Name (नाम)
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 bg-stone-50"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Contact Number (मोबाइल नंबर - लॉगिन ID)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-11 pr-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 bg-stone-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Email (ईमेल)
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Delivery Address (पता)
              </label>
              <textarea
                rows={2}
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 bg-stone-50 resize-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-stone-600">
                  5-Digit Password (5 अंकों का पासवर्ड)
                </label>
                <span className="text-[10px] text-stone-400 font-mono">5 Digits</span>
              </div>
              <div className="relative">
                <input
                  type={showEditPassword ? 'text' : 'password'}
                  maxLength={5}
                  inputMode="numeric"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 tracking-widest font-mono bg-stone-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-3 top-2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showEditPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Save Changes (अपडेट करें)
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* READ-ONLY PROFILE CARDS */
          <div className="grid grid-cols-1 gap-2 pt-1">
            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-500 font-medium">Name:</span>
                <span className="font-bold text-stone-800">{currentUser.name}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-500 font-medium">Contact Number:</span>
                <span className="font-bold text-stone-800">+91 {currentUser.phone}</span>
              </div>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                Login ID
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-500 font-medium">Email:</span>
                <span className="font-medium text-stone-800">
                  {currentUser.email || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 font-medium block">Address:</span>
                <span className="font-medium text-stone-800 leading-snug">
                  {currentUser.address || currentAddress}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-500 font-medium">5-Digit Password:</span>
                <span className="font-mono font-bold tracking-widest text-stone-800">
                  {showEditPassword ? currentUser.password : '•••••'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowEditPassword(!showEditPassword)}
                className="text-[11px] text-red-600 hover:text-red-700 font-bold cursor-pointer"
              >
                {showEditPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Primary Delivery Address */}
      <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-700">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Primary Delivery Address</span>
          </div>
          <button
            onClick={onOpenAddressModal}
            className="text-red-600 hover:text-red-700 cursor-pointer font-bold"
          >
            Change
          </button>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
          {currentUser.address || currentAddress}
        </p>
      </div>

      {/* Order History */}
      <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
          Order History ({orders.length})
        </h4>

        {orders.length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-xs">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900">Order #{ord.id}</span>
                  <span className="text-emerald-700 font-bold capitalize">{ord.status}</span>
                </div>

                <div className="text-stone-600 text-[11px]">
                  {ord.items.map((i) => `${i.dish.name} x${i.quantity}`).join(', ')}
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                  <span className="font-bold text-stone-900">Paid: ₹{ord.grandTotal}</span>
                  <button
                    onClick={() => onReorder(ord)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] shadow-2xs hover:bg-red-700 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Aman Traders */}
      <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700 space-y-2">
        <h4 className="font-bold text-stone-900 text-sm">About Aman Traders</h4>
        <p className="text-xs leading-relaxed text-stone-600">
          Serving authentic, handcrafted confectionery sweets, fresh bakery delicacies, and premium treats with trusted quality. 100% Pure Vegetarian kitchen.
        </p>

        <div className="pt-2 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-[11px] text-stone-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>8:00 AM - 10:30 PM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Pure Veg</span>
          </div>
        </div>

        <div className="pt-2">
          <a
            href="tel:+919876543210"
            className="w-full py-2 rounded-xl bg-white border border-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:bg-stone-50"
          >
            <Phone className="w-3.5 h-3.5 text-red-600" />
            <span>Call Support (+91 98765 43210)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
