/**
 * Configuration pour la production
 */

export const environment = {
  production: true,
  apiUrl: getApiUrl()
};

function getApiUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://beelshops.alwaysdata.net/index.php/api';
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Production - Vercel
  if (hostname === 'beelshops.vercel.app' || hostname.includes('vercel.app')) {
    return 'https://beelshops.alwaysdata.net/index.php/api';
  }

  // Fallback - utiliser le backend AlwaysData
  return 'https://beelshops.alwaysdata.net/index.php/api';
}

export default environment;
