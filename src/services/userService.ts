import { UserProfile } from '../types';

const USERS_STORAGE_KEY = 'aman_traders_registered_users';
const CURRENT_USER_STORAGE_KEY = 'aman_traders_current_user';

export function getRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out any leftover demo user
    return parsed.filter(
      (u: any) => u && u.id !== 'user-demo-1' && u.phone !== '9876543210' && !String(u.email || '').includes('manish.aman@example.com')
    );
  } catch (e) {
    console.warn('Error reading registered users from localStorage:', e);
    return [];
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    // If it is the old demo user, purge it!
    if (!user || user.id === 'user-demo-1' || user.phone === '9876543210' || String(user.email || '').includes('manish.aman@example.com')) {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      return null;
    }
    return user;
  } catch (e) {
    console.warn('Error reading current user:', e);
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Error saving current user:', e);
  }
}

export function registerUser(data: {
  name: string;
  phone: string;
  email: string;
  address: string;
  password: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const cleanName = data.name.trim();
  const cleanPhone = data.phone.replace(/[^0-9]/g, '');
  const cleanEmail = data.email.trim();
  const cleanAddress = data.address.trim();
  const cleanPassword = data.password.trim();

  if (!cleanName) {
    return { success: false, error: 'Please enter your Name (नाम दर्ज करें)' };
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit Contact Number (10 अंकों का मोबाइल नंबर दर्ज करें)',
    };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Please enter a 5-digit password (5 अंकों का पासवर्ड दर्ज करें)' };
  }
  if (cleanPassword.length !== 5 || !/^\d{5}$/.test(cleanPassword)) {
    return {
      success: false,
      error: 'Password must be exactly 5 numeric digits (पासवर्ड ठीक 5 अंकों का होना चाहिए, e.g. 12345)',
    };
  }

  const users = getRegisteredUsers();
  const existing = users.find((u) => u.phone === cleanPhone);
  if (existing) {
    return {
      success: false,
      error: 'This Contact Number is already registered! Please Login. (यह नंबर पहले से रजिस्टर है, कृपया लॉगिन करें)',
    };
  }

  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    address: cleanAddress,
    password: cleanPassword,
    registeredAt: new Date().toISOString(),
  };

  users.push(newUser);
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setCurrentUser(newUser);
  } catch (e) {
    console.warn('Failed to save user:', e);
  }

  return { success: true, user: newUser };
}

export function loginUser(
  phone: string,
  password: string
): { success: boolean; user?: UserProfile; error?: string } {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanPassword = password.trim();

  if (!cleanPhone) {
    return { success: false, error: 'Please enter your Contact Number (मोबाइल नंबर दर्ज करें)' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Please enter your 5-digit password (5 अंकों का पासवर्ड दर्ज करें)' };
  }
  if (cleanPassword.length !== 5) {
    return {
      success: false,
      error: 'Password must be exactly 5 digits (पासवर्ड 5 अंकों का होना चाहिए)',
    };
  }

  const users = getRegisteredUsers();
  const user = users.find(
    (u) => u.phone === cleanPhone || u.phone.endsWith(cleanPhone) || cleanPhone.endsWith(u.phone)
  );

  if (!user) {
    return {
      success: false,
      error: 'No account found with this Contact Number. Please Sign Up! (इस नंबर से कोई खाता नहीं मिला, कृपया नया खाता बनाएं)',
    };
  }

  if (user.password !== cleanPassword) {
    return {
      success: false,
      error: 'Incorrect 5-digit password! (गलत पासवर्ड, कृपया सही 5 अंकों का पासवर्ड दर्ज करें)',
    };
  }

  setCurrentUser(user);
  return { success: true, user };
}

export function updateUserProfile(
  id: string,
  updates: Partial<Omit<UserProfile, 'id' | 'registeredAt'>>
): { success: boolean; user?: UserProfile; error?: string } {
  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return { success: false, error: 'User not found' };
  }

  if (updates.password && (!/^\d{5}$/.test(updates.password) || updates.password.length !== 5)) {
    return { success: false, error: 'Password must be exactly 5 digits (पासवर्ड 5 अंकों का होना चाहिए)' };
  }

  const updated: UserProfile = {
    ...users[index],
    ...updates,
    name: updates.name ? updates.name.trim() : users[index].name,
    phone: updates.phone ? updates.phone.replace(/[^0-9]/g, '') : users[index].phone,
    email: updates.email !== undefined ? updates.email.trim() : users[index].email,
    address: updates.address !== undefined ? updates.address.trim() : users[index].address,
  };

  users[index] = updated;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setCurrentUser(updated);
  } catch (e) {
    console.warn('Failed to update user:', e);
  }

  return { success: true, user: updated };
}

export function logoutUser(): void {
  setCurrentUser(null);
}
