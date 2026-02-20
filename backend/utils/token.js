const crypto = require('crypto');

let jsonwebtoken = null;
try {
  // Optional dependency. If missing, fallback implementation below is used.
  // eslint-disable-next-line global-require
  jsonwebtoken = require('jsonwebtoken');
} catch (error) {
  jsonwebtoken = null;
}

const base64UrlEncode = (input) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const base64UrlDecode = (value) => {
  const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
};

const parseExpiresInSeconds = (expiresIn) => {
  if (typeof expiresIn === 'number' && Number.isFinite(expiresIn)) {
    return Math.max(0, Math.floor(expiresIn));
  }
  if (typeof expiresIn !== 'string') return 0;
  const input = expiresIn.trim().toLowerCase();
  const match = input.match(/^(\d+)\s*([smhd])?$/);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = match[2] || 's';
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
  return amount * (multipliers[unit] || 1);
};

const createSignature = (headerB64, payloadB64, secret) =>
  crypto
    .createHmac('sha256', String(secret || ''))
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const sign = (payload, secret, options = {}) => {
  if (jsonwebtoken) {
    return jsonwebtoken.sign(payload, secret, options);
  }

  const now = Math.floor(Date.now() / 1000);
  const expSeconds = parseExpiresInSeconds(options.expiresIn);
  const finalPayload = {
    ...payload,
    iat: now,
    ...(expSeconds > 0 ? { exp: now + expSeconds } : {}),
  };

  const headerB64 = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadB64 = base64UrlEncode(JSON.stringify(finalPayload));
  const signature = createSignature(headerB64, payloadB64, secret);
  return `${headerB64}.${payloadB64}.${signature}`;
};

const verify = (token, secret) => {
  if (jsonwebtoken) {
    return jsonwebtoken.verify(token, secret);
  }

  const parts = String(token || '').split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [headerB64, payloadB64, signature] = parts;
  const expected = createSignature(headerB64, payloadB64, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid token signature');
  }

  const header = JSON.parse(base64UrlDecode(headerB64));
  if (header.alg !== 'HS256') {
    throw new Error('Unsupported token algorithm');
  }

  const payload = JSON.parse(base64UrlDecode(payloadB64));
  if (payload.exp && Math.floor(Date.now() / 1000) >= Number(payload.exp)) {
    throw new Error('Token expired');
  }

  return payload;
};

module.exports = { sign, verify };
