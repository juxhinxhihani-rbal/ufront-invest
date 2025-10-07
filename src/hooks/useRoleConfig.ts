import { useState, useEffect } from 'react';

interface RoleConfig {
  UPLOAD_FILE_ROLE: string;
  EXCHANGE_SCREEN_ROLE: string;
  QUESTIONNAIRE_SCREEN_ROLE: string;
  MENU_INVEST_ADMIN_ROLE: string;
}

let roleConfigCache: RoleConfig | null = null;
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useRoleConfig() {
  const [roleConfig, setRoleConfig] = useState<RoleConfig | null>(roleConfigCache);
  const [loading, setLoading] = useState(!roleConfigCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Return cached config if still valid
    if (roleConfigCache && Date.now() < cacheExpiry) {
      setRoleConfig(roleConfigCache);
      setLoading(false);
      return;
    }

    async function fetchRoleConfig() {
      try {
        setLoading(true);
        const response = await fetch('/api/config/roles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch role configuration');
        }
        
        const config: RoleConfig = await response.json();
        
        // Cache the config
        roleConfigCache = config;
        cacheExpiry = Date.now() + CACHE_DURATION;
        
        setRoleConfig(config);
        setError(null);
      } catch (err) {
        console.error('Error fetching role config:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Use cached config if available
        if (roleConfigCache) {
          setRoleConfig(roleConfigCache);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRoleConfig();
  }, []);

  return { roleConfig, loading, error };
}
