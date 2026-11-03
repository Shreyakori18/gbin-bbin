import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isLiveSupabaseConfigured, localDB, initLocalStorageIfEmpty } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize storage seeds
  useEffect(() => {
    initLocalStorageIfEmpty();
  }, []);

  // Fetch current user and profile on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isLiveSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchSupabaseUserData(session.user.id);
          }
        } else {
          // Check local stored session
          const sessionUser = JSON.parse(localStorage.getItem('gbin_bbin_session') || 'null');
          if (sessionUser) {
            setUser(sessionUser);
            loadLocalUserData(sessionUser.id);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    if (isLiveSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchSupabaseUserData(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setHousehold(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const loadLocalUserData = (userId) => {
    const profiles = localDB.getProfiles();
    const households = localDB.getHouseholds();

    const currentProfile = profiles.find(p => p.id === userId);
    const currentHousehold = households.find(h => h.user_id === userId);

    setProfile(currentProfile || null);
    setHousehold(currentHousehold || null);
  };

  const fetchSupabaseUserData = async (userId) => {
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(prof || null);

      if (prof) {
        const { data: hh } = await supabase
          .from('households')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        setHousehold(hh || null);
      }
    } catch (err) {
      console.warn('Fallback to local storage data:', err.message);
      loadLocalUserData(userId);
    }
  };

  // Register Household
  const registerHousehold = async ({ fullName, email, password, phone, streetAddress, wardZone, pincode, residentsCount }) => {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone_number: phone }
        }
      });
      if (error) throw error;

      const newUserId = data.user.id;
      const hhId = localDB.generateHouseholdId();

      // Profile insert
      const { error: profErr } = await supabase.from('profiles').insert([
        { id: newUserId, full_name: fullName, email, phone_number: phone, role: 'household' }
      ]);
      if (profErr) console.warn('Profile insert:', profErr);

      // Household insert
      const { error: hhErr } = await supabase.from('households').insert([
        {
          user_id: newUserId,
          household_id: hhId,
          street_address: streetAddress,
          ward_zone: wardZone,
          pincode,
          residents_count: parseInt(residentsCount, 10) || 1,
          g_bin_count: 1,
          b_bin_count: 1
        }
      ]);
      if (hhErr) console.warn('Household insert:', hhErr);

      return { user: data.user, householdId: hhId };
    } else {
      // Local Database Registration
      const users = JSON.parse(localStorage.getItem('gbin_bbin_users') || '[]');
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('A household with this email is already registered.');
      }

      const newUserId = 'hh-' + Date.now();
      const householdId = localDB.generateHouseholdId();

      const newUser = { id: newUserId, email, password };
      users.push(newUser);
      localStorage.setItem('gbin_bbin_users', JSON.stringify(users));

      const newProfile = {
        id: newUserId,
        full_name: fullName,
        email,
        phone_number: phone,
        role: 'household',
        created_at: new Date().toISOString()
      };
      localDB.saveProfile(newProfile);

      const newHousehold = {
        id: 'hh-rec-' + Date.now(),
        user_id: newUserId,
        household_id: householdId,
        street_address: streetAddress,
        ward_zone: wardZone,
        pincode,
        residents_count: parseInt(residentsCount, 10) || 1,
        g_bin_count: 1,
        b_bin_count: 1,
        notes: 'Newly registered household',
        created_at: new Date().toISOString()
      };
      localDB.saveHousehold(newHousehold);

      // Auto login newly registered user
      localStorage.setItem('gbin_bbin_session', JSON.stringify(newUser));
      setUser(newUser);
      setProfile(newProfile);
      setHousehold(newHousehold);

      return { user: newUser, householdId };
    }
  };

  // Login
  const login = async (email, password) => {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      await fetchSupabaseUserData(data.user.id);
      return data;
    } else {
      const users = JSON.parse(localStorage.getItem('gbin_bbin_users') || '[]');
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!found) {
        throw new Error('Invalid email or password. Please try again.');
      }
      localStorage.setItem('gbin_bbin_session', JSON.stringify(found));
      setUser(found);
      loadLocalUserData(found.id);
      return { user: found };
    }
  };

  // Quick Demo Login helper for convenience testing (admin or household)
  const quickDemoLogin = (role = 'admin') => {
    initLocalStorageIfEmpty();
    const users = JSON.parse(localStorage.getItem('gbin_bbin_users') || '[]');
    let target = null;
    if (role === 'admin') {
      target = users.find(u => u.email === 'admin@gbinbbin.org');
    } else {
      target = users.find(u => u.email === 'sarah.household@example.com');
    }

    if (target) {
      localStorage.setItem('gbin_bbin_session', JSON.stringify(target));
      setUser(target);
      loadLocalUserData(target.id);
    }
  };

  // Logout
  const logout = async () => {
    if (isLiveSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('gbin_bbin_session');
    setUser(null);
    setProfile(null);
    setHousehold(null);
  };

  // Update Profile & Household details
  const updateProfileAndHousehold = async ({ fullName, phone, streetAddress, wardZone, pincode, residentsCount }) => {
    if (!user) throw new Error('Not authenticated');

    const updatedProf = {
      ...profile,
      full_name: fullName,
      phone_number: phone
    };

    let updatedHh = null;
    if (household) {
      updatedHh = {
        ...household,
        street_address: streetAddress,
        ward_zone: wardZone,
        pincode,
        residents_count: parseInt(residentsCount, 10) || household.residents_count
      };
    }

    if (isLiveSupabaseConfigured()) {
      await supabase.from('profiles').update({
        full_name: fullName,
        phone_number: phone
      }).eq('id', user.id);

      if (household) {
        await supabase.from('households').update({
          street_address: streetAddress,
          ward_zone: wardZone,
          pincode,
          residents_count: parseInt(residentsCount, 10) || 1
        }).eq('user_id', user.id);
      }
    } else {
      localDB.saveProfile(updatedProf);
      if (updatedHh) {
        localDB.saveHousehold(updatedHh);
      }
    }

    setProfile(updatedProf);
    if (updatedHh) setHousehold(updatedHh);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        household,
        isAdmin,
        loading,
        login,
        registerHousehold,
        quickDemoLogin,
        logout,
        updateProfileAndHousehold,
        refreshUserData: () => {
          if (user) {
            if (isLiveSupabaseConfigured()) fetchSupabaseUserData(user.id);
            else loadLocalUserData(user.id);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
