import { UserProfile } from '../types';

const USERS_STORAGE_KEY = 'aman_users_db_v1';
const CURRENT_USER_STORAGE_KEY = 'aman_current_user_v1';

export const getAllUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: UserProfile[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
};

export const getCurrentUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: UserProfile | null) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
};

export const loginUser = (
  phone: string,
  pass: string
): { success: boolean; user?: UserProfile; error?: string } => {
  const users = getAllUsers();
  const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
  const cleanPass = pass.trim();

  const found = users.find((u) => u.phone === cleanPhone);
  if (!found) {
    // If not found in local db, create and log in seamlessly
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: 'Customer',
      phone: cleanPhone,
      password: cleanPass,
      createdAt: new Date().toLocaleDateString(),
    };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  if (found.password && found.password !== cleanPass) {
    return { success: false, error: 'Incorrect 5-digit password. Please try again.' };
  }

  setCurrentUser(found);
  return { success: true, user: found };
};

export const registerUser = (data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  password?: string;
}): { success: boolean; user?: UserProfile; error?: string } => {
  const users = getAllUsers();
  const cleanPhone = data.phone.trim().replace(/[^0-9]/g, '');

  const existing = users.find((u) => u.phone === cleanPhone);
  if (existing) {
    // Update existing user details
    existing.name = data.name.trim();
    if (data.email) existing.email = data.email.trim();
    if (data.address) existing.address = data.address.trim();
    if (data.password) existing.password = data.password.trim();
    saveUsers(users);
    setCurrentUser(existing);
    return { success: true, user: existing };
  }

  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: data.name.trim(),
    phone: cleanPhone,
    email: data.email?.trim(),
    address: data.address?.trim(),
    password: data.password?.trim(),
    createdAt: new Date().toLocaleDateString(),
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
};

export const updateUserProfile = (
  id: string,
  updates: Partial<UserProfile>
): { success: boolean; user?: UserProfile; error?: string } => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === id || u.phone === updates.phone);

  if (index === -1) {
    const newUser: UserProfile = {
      id: id || `user-${Date.now()}`,
      name: updates.name || 'Customer',
      phone: updates.phone || '9876543210',
      ...updates,
    };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  const updated: UserProfile = {
    ...users[index],
    ...updates,
  };
  users[index] = updated;
  saveUsers(users);
  setCurrentUser(updated);
  return { success: true, user: updated };
};
