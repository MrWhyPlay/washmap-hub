import { supabase } from '@/integrations/supabase/client';

export const geocodeAddress = async (address: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('geocode', {
      body: { address }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};