const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SL_PHONE_RE = /^(?:\+94|0)?(?:7[0-9])\d{7}$|^0\d{9}$/;

export function isValidEmail(value) {
  return EMAIL_RE.test(value.trim());
}

export function isValidSriLankanPhone(value) {
  if (!value) return false;
  return SL_PHONE_RE.test(value.trim().replace(/[\s-]/g, ''));
}

export function isValidPassword(value, minLength = 6) {
  return value.length >= minLength;
}

const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = [
  'var(--color-error)',
  'var(--color-error)',
  'var(--color-warning)',
  'var(--brand-amber)',
  'var(--color-success)',
];

export function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: '', color: STRENGTH_COLORS[0], percent: 0 };
  }

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4);
  return {
    score: clamped,
    label: STRENGTH_LABELS[clamped],
    color: STRENGTH_COLORS[clamped],
    percent: (clamped / 4) * 100,
  };
}
