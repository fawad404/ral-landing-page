import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

export const US_PHONE_FORMAT = /^\(\d{3}\) \d{3}-\d{4}$/;

// Formats a US number as "(XXX) XXX-XXXX". Anything that isn't 10 digits
// (or 11 with a leading 1), or whose area code starts with 0/1, is returned
// unchanged so the Matches check rejects it. '' becomes undefined so optional
// fields stay optional.
export function normalizeUsPhone(value: unknown) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  let digits = trimmed.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (digits.length !== 10 || /^[01]/.test(digits)) return trimmed;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function IsUsPhone() {
  return applyDecorators(
    Transform(({ value }) => normalizeUsPhone(value)),
    Matches(US_PHONE_FORMAT, { message: '$property must be a valid 10-digit US phone number' }),
  );
}
