import { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { supabase } from '../lib/supabase';

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchConfig = () => {
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setConfig(data);
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error('Error fetching config:', err);
          if (isMounted) setIsLoading(false);
        });
    };

    fetchConfig();

    let channel: any = null;
    let pollInterval: any = null;

    if (supabase) {
      // Subscribe to real-time changes on the app_config table
      channel = supabase
        .channel(`schema-db-changes-${Math.random().toString(36).substring(7)}`)
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'app_config',
          },
          (payload) => {
            console.log('Realtime change received from Supabase:', payload);
            if (payload.new && (payload.new as any).data) {
              if (isMounted) {
                setConfig(prev => ({
                  ...(prev || {}),
                  ...(payload.new as any).data,
                }));
              }
            } else {
              // Fallback to fetch if payload data is missing
              fetchConfig();
            }
          }
        )
        .subscribe();
    }
    
    // Polling fallback to ensure we always have fresh data even if realtime fails due to RLS
    pollInterval = setInterval(() => {
      fetchConfig();
    }, 15000); // Check every 15 seconds

    return () => {
      isMounted = false;
      if (channel) {
        supabase?.removeChannel(channel);
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  return { config, setConfig, isLoading };
}
