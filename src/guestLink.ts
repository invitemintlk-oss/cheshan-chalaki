// Short guest links: ?g=<mode+prefix digit><base64url payload>
// Digits 0-3: compact payload (Sinhala/ASCII packed one byte per character).
// Digits 4-7: UTF-8 payload, used when the name has characters compact mode can't hold.

export const PREFIXES = ['ඔබට', 'ඔබ දෙපලට', 'ඔබ සැමට', 'ඔබ ඇතුළු පවුලේ සැමට'];

const SINHALA_START = 0x0d80;
const ZWJ = 0x200d;
const ZWJ_BYTE = 0x7f;

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

const compactEncode = (name: string): Uint8Array | null => {
  const bytes: number[] = [];
  for (const char of name) {
    const code = char.codePointAt(0)!;
    if (code >= SINHALA_START && code < SINHALA_START + 0x80) bytes.push(0x80 + code - SINHALA_START);
    else if (code === ZWJ) bytes.push(ZWJ_BYTE);
    else if (code < ZWJ_BYTE) bytes.push(code);
    else return null;
  }
  return Uint8Array.from(bytes);
};

const compactDecode = (bytes: Uint8Array) =>
  Array.from(bytes, (b) =>
    String.fromCodePoint(b >= 0x80 ? SINHALA_START + b - 0x80 : b === ZWJ_BYTE ? ZWJ : b),
  ).join('');

export const encodeGuest = (name: string, prefixIndex: number) => {
  const compact = compactEncode(name);
  if (compact) return `${prefixIndex}${toBase64Url(compact)}`;
  return `${prefixIndex + 4}${toBase64Url(new TextEncoder().encode(name))}`;
};

export const decodeGuest = (code: string): { name: string; prefix: string } | null => {
  try {
    const digit = Number(code[0]);
    if (!Number.isInteger(digit) || digit < 0 || digit > 7) return null;
    const prefix = PREFIXES[digit % 4];
    if (!prefix) return null;
    const bytes = fromBase64Url(code.slice(1));
    const name = digit < 4 ? compactDecode(bytes) : new TextDecoder().decode(bytes);
    return name.trim() ? { name, prefix } : null;
  } catch {
    return null;
  }
};

export const guestGreeting = (name: string, prefix: string) => `ආදරණීය ${name} ${prefix}`;

// Readable guest links: /{guestName}?p={prefixKey}  ("Dear" adds no ?p=)

export const GUEST_PREFIXES = [
  { key: 'mr', label: 'Mr.' },
  { key: 'mrs', label: 'Mrs.' },
  { key: 'miss', label: 'Miss' },
  { key: 'mr-mrs', label: 'Mr. & Mrs.' },
  { key: 'family', label: 'Family' },
  { key: 'dear', label: 'Dear' },
] as const;

export type GuestPrefixKey = (typeof GUEST_PREFIXES)[number]['key'];

const isPrefixKey = (value: string | null): value is GuestPrefixKey =>
  GUEST_PREFIXES.some((p) => p.key === value);

// "Dear" is not part of the name: the greeting adds it, so the name stays bare.
export const guestDisplayName = (name: string, key: GuestPrefixKey) => {
  if (key === 'dear') return name;
  if (key === 'family') return `${name} and Family`;
  return `${GUEST_PREFIXES.find((p) => p.key === key)!.label} ${name}`;
};

export const buildGuestUrl = (origin: string, name: string, key: GuestPrefixKey) =>
  `${origin}/${encodeURIComponent(name)}${key === 'dear' ? '' : `?p=${key}`}`;

export const parseGuestPath = (pathname: string, search: string) => {
  const segment = pathname.replace(/^\/+|\/+$/g, '');
  if (!segment || segment.includes('/') || segment === 'admin') return null;
  let name: string;
  try {
    name = decodeURIComponent(segment).replace(/\s+/g, ' ').trim();
  } catch {
    return null;
  }
  if (!name) return null;
  const p = new URLSearchParams(search).get('p');
  const key: GuestPrefixKey = isPrefixKey(p) ? p : 'dear';
  return { name, key, displayName: guestDisplayName(name, key) };
};
