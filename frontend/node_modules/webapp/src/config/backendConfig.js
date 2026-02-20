const FALLBACK_BACKEND = 'https://scholarhip-site-backend.vercel.app';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const backendBaseUrl = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || FALLBACK_BACKEND);

// In Vite dev, API calls go through the /api proxy in vite.config.js.
const apiBaseUrl = import.meta.env.DEV ? '' : backendBaseUrl;

// Uploaded media should resolve directly from backend host.
const uploadBaseUrl = trimTrailingSlash(
  import.meta.env.VITE_UPLOAD_BASE_URL || backendBaseUrl
);

const normalizeMediaPath = (value) => {
  const raw = String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^https?:\/\/\/+/i, (match) => (match.toLowerCase().startsWith('https') ? 'https://' : 'http://'));
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('data:image/')) return raw;

  const uploadsIndex = raw.toLowerCase().indexOf('/uploads/');
  if (uploadsIndex >= 0) {
    return raw.slice(uploadsIndex + 1);
  }

  return raw.replace(/^\/+/, '');
};

const buildMediaUrl = (value) => {
  const normalized = normalizeMediaPath(value);
  if (!normalized) return '';
  if (/^https?:\/\//i.test(normalized)) return normalized;
  if (normalized.startsWith('data:image/')) return normalized;
  return `${uploadBaseUrl}/${normalized}`;
};

export { apiBaseUrl, uploadBaseUrl, buildMediaUrl };
