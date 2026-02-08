/**
 * Configuration globale de l'application
 * Gère les URLs du backend selon l'environnement
 */

export const environment = {
  production: false,
  apiUrl: getApiUrl()
};

/**
 * Détermine l'URL du backend selon l'environnement
 */
function getApiUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api';
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Production - Vercel
  if (hostname === 'beelshops.vercel.app' || hostname.includes('vercel.app')) {
    return 'https://beelshop.page.gd/api';
  }

  // Staging/Preview
  if (hostname.includes('staging') || hostname.includes('preview')) {
    return 'https://beelshop.page.gd/api';
  }

  // Développement local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }

  // Fallback - utiliser le backend Infinity Free
  return 'https://beelshop.page.gd/api';
}

export default environment;
