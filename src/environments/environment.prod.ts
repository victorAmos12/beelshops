/**
 * Configuration pour la production
 */

export const environment = {
  production: true,
  apiUrl: getApiUrl()
};

function getApiUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://beelshop.page.gd/api';
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Production - Vercel
  if (hostname === 'beelshops.vercel.app' || hostname.includes('vercel.app')) {
    return 'https://beelshop.page.gd/api';
  }

  // Fallback - utiliser le backend Infinity Free
  return 'https://beelshop.page.gd/api';
}

export default environment;
