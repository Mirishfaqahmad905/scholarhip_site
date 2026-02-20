const config = require('../config/appConfig');

const toBuffer = (value) => {
  if (!value) return null;
  if (Buffer.isBuffer(value)) return value;
  if (value?.type === 'Buffer' && Array.isArray(value?.data)) {
    return Buffer.from(value.data);
  }
  if (Array.isArray(value)) {
    return Buffer.from(value);
  }
  return null;
};

const extensionFromMimeType = (mimeType = '') => {
  const normalized = String(mimeType).toLowerCase();
  if (normalized === 'image/jpeg' || normalized === 'image/jpg') return 'jpg';
  if (normalized === 'image/png') return 'png';
  if (normalized === 'image/webp') return 'webp';
  if (normalized === 'image/gif') return 'gif';
  if (normalized === 'image/bmp' || normalized === 'image/x-ms-bmp') return 'bmp';
  return 'png';
};

const getSharp = () => {
  try {
    // Optional dependency: if not installed, fallback keeps original image.
    // eslint-disable-next-line global-require
    return require('sharp');
  } catch (error) {
    return null;
  }
};

const processImageBuffer = async (buffer, mimeType) => {
  const sharp = getSharp();
  if (!sharp || !buffer) {
    return { data: buffer, contentType: mimeType };
  }

  try {
    const optimized = await sharp(buffer)
      .rotate()
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toBuffer();

    return {
      data: optimized,
      contentType: 'image/webp',
    };
  } catch (error) {
    return { data: buffer, contentType: mimeType };
  }
};

const extractBinaryImage = (imageValue) => {
  if (!imageValue || typeof imageValue !== 'object') return null;
  const buffer = toBuffer(imageValue.data);
  if (!buffer) return null;
  return {
    data: buffer,
    contentType: imageValue.contentType || 'image/jpeg',
    fileName: imageValue.fileName || '',
  };
};

const isBinaryImage = (imageValue) => Boolean(extractBinaryImage(imageValue));

const normalizeImageFromRequest = async (req, fallbackImageValue) => {
  if (req.file) {
    const processed = await processImageBuffer(req.file.buffer, req.file.mimetype);
    const ext = extensionFromMimeType(processed.contentType || req.file.mimetype);
    const baseName = String(req.file.originalname || '')
      .replace(/\.[^/.]+$/, '')
      .trim();
    const safeBaseName = baseName || `image-${Date.now()}`;
    return {
      data: processed.data,
      contentType: processed.contentType || req.file.mimetype,
      fileName: `${safeBaseName}.${ext}`,
    };
  }

  if (fallbackImageValue && typeof fallbackImageValue === 'string') {
    return fallbackImageValue.trim();
  }

  return null;
};

const getBaseUrl = (req) => {
  const host = req.get('host') || '';
  const isLocalRequest = /localhost|127\.0\.0\.1/i.test(host);

  if (config.backendPublicUrl && !isLocalRequest) {
    return String(config.backendPublicUrl).replace(/\/+$/, '');
  }

  const forwardedProto = (req.get('x-forwarded-proto') || '').split(',')[0].trim();
  const forwardedHost = (req.get('x-forwarded-host') || '').split(',')[0].trim();

  const protocol = forwardedProto || req.protocol || 'https';
  const resolvedHost = forwardedHost || host;

  return `${protocol}://${resolvedHost}`;
};

const normalizeStoredPath = (value = '') => {
  let normalized = String(value).trim().replace(/\\/g, '/');
  if (!normalized) return '';
  normalized = normalized.replace(/^https?:\/\/\/+/i, (match) => (match.toLowerCase().startsWith('https') ? 'https://' : 'http://'));
  if (normalized.startsWith('data:image/')) return normalized;
  if (/^https?:\/\//i.test(normalized)) return normalized;

  const uploadsIndex = normalized.toLowerCase().indexOf('/uploads/');
  if (uploadsIndex >= 0) {
    normalized = normalized.slice(uploadsIndex + 1);
  }

  normalized = normalized.replace(/^\/+/, '');
  return normalized;
};

const resolveImageUrl = (req, entityType, entity) => {
  const value = entity?.image;
  if (!value) return null;
  if (typeof value === 'string') {
    return resolveMediaValueUrl(req, value);
  }
  if (isBinaryImage(value)) return `${getBaseUrl(req)}/api/image/${entityType}/${entity._id}`;
  return null;
};

const resolveMediaValueUrl = (req, value) => {
  const normalized = normalizeStoredPath(value);
  if (!normalized) return null;
  if (/^https?:\/\//i.test(normalized) || normalized.startsWith('data:image/')) return normalized;
  return `${getBaseUrl(req)}/${normalized}`;
};

module.exports = {
  isBinaryImage,
  extractBinaryImage,
  normalizeImageFromRequest,
  resolveImageUrl,
  resolveMediaValueUrl,
  processImageBuffer,
};
