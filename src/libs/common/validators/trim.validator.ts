import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    }
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? v.trim() : v));
    }
    return value;
  });
}
