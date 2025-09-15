import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export interface UserSettings {
  emailNotifications: boolean;
  projectUpdates: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  profileVisibility: 'public' | 'professional' | 'private';
  language: 'en' | 'es' | 'fr' | 'de';
  timezone: string;
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  projectUpdates: true,
  marketingEmails: false,
  twoFactorAuth: false,
  profileVisibility: 'public',
  language: 'en',
  timezone: 'UTC',
};

export function useUserSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings from database
  const loadSettings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No settings found, use defaults
          setSettings(defaultSettings);
        } else {
          throw fetchError;
        }
      } else if (data) {
        // Map database fields to our settings interface
        setSettings({
          emailNotifications: data.email_notifications,
          projectUpdates: data.project_updates,
          marketingEmails: data.marketing_emails,
          twoFactorAuth: data.two_factor_auth,
          profileVisibility: data.profile_visibility as 'public' | 'professional' | 'private',
          language: data.language as 'en' | 'es' | 'fr' | 'de',
          timezone: data.timezone,
        });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to database
  const saveSettings = async (newSettings: UserSettings) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to save settings',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Map our settings interface to database fields
      const settingsData = {
        user_id: user.id,
        email_notifications: newSettings.emailNotifications,
        project_updates: newSettings.projectUpdates,
        marketing_emails: newSettings.marketingEmails,
        two_factor_auth: newSettings.twoFactorAuth,
        profile_visibility: newSettings.profileVisibility,
        language: newSettings.language,
        timezone: newSettings.timezone,
      };

      const { error: upsertError } = await supabase
        .from('user_settings')
        .upsert(settingsData, {
          onConflict: 'user_id',
        });

      if (upsertError) {
        throw upsertError;
      }

      setSettings(newSettings);
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update a single setting
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    return await saveSettings(newSettings);
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to change your password',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsSaving(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Load settings when user changes
  useEffect(() => {
    loadSettings();
  }, [user]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    loadSettings,
    saveSettings,
    updateSetting,
    changePassword,
  };
}
