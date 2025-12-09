// ============================================================
//                   PAYRING UTILITIES
// ============================================================

import type { Currency, Timestamp } from '../types/models';

// ==================== CURRENCY HELPERS ====================

/**
 * Create a Currency object from cents
 */
export function createCurrency(amountMinor: number, currency: string = 'USD'): Currency {
  return {
    amountMinor,
    currency,
    formatted: formatCurrency(amountMinor, currency),
  };
}

/**
 * Format cents to display string
 */
export function formatCurrency(amountMinor: number, currency: string = 'USD'): string {
  const amount = amountMinor / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Parse dollar string to cents
 */
export function parseToCents(dollarString: string): number {
  const cleaned = dollarString.replace(/[^0-9.-]/g, '');
  const amount = parseFloat(cleaned);
  if (isNaN(amount)) return 0;
  return Math.round(amount * 100);
}

/**
 * Calculate platform fee
 */
export function calculateFee(amountMinor: number, feePercent: number = 0.03): number {
  const fee = Math.round(amountMinor * feePercent);
  const minFee = 50; // $0.50
  const maxFee = 10000; // $100
  return Math.min(Math.max(fee, minFee), maxFee);
}

// ==================== DATE/TIME HELPERS ====================

/**
 * Create a Timestamp object from ISO string
 */
export function createTimestamp(isoString: string): Timestamp {
  return {
    iso: isoString,
    relative: getRelativeTime(isoString),
  };
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
}

/**
 * Format date for display
 */
export function formatDate(isoString: string, format: 'short' | 'long' | 'full' = 'short'): string {
  const date = new Date(isoString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    case 'full':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Check if date is past due
 */
export function isPastDue(isoString: string): boolean {
  return new Date(isoString) < new Date();
}

/**
 * Check if date is due soon (within days)
 */
export function isDueSoon(isoString: string, withinDays: number = 3): boolean {
  const date = new Date(isoString);
  const now = new Date();
  const dueDate = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);
  return date <= dueDate && date >= now;
}

// ==================== STRING HELPERS ====================

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${randomPart}` : `${timestamp}${randomPart}`;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Format username (ensure @ prefix)
 */
export function formatUsername(username: string): string {
  if (!username) return '';
  return username.startsWith('@') ? username : `@${username}`;
}

/**
 * Parse recipient input (email, phone, or username)
 */
export function parseRecipient(input: string): { type: 'email' | 'phone' | 'username'; value: string } {
  const trimmed = input.trim();
  
  // Email pattern
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { type: 'email', value: trimmed };
  }
  
  // Phone pattern (various formats)
  if (/^[\d\s\-+()]+$/.test(trimmed) && trimmed.replace(/\D/g, '').length >= 10) {
    return { type: 'phone', value: trimmed.replace(/\D/g, '') };
  }
  
  // Username (default)
  return { type: 'username', value: formatUsername(trimmed) };
}

// ==================== VALIDATION HELPERS ====================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Validate amount (positive number)
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && isFinite(amount);
}

// ==================== AGREEMENT HELPERS ====================

/**
 * Calculate agreement progress percentage
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Get milestone completion status text
 */
export function getMilestoneStatusText(completed: number, total: number): string {
  if (total === 0) return 'No milestones';
  if (completed === total) return 'All complete';
  return `${completed}/${total} complete`;
}

// ==================== AVATAR HELPERS ====================

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate avatar color from name
 */
export function getAvatarColor(name: string): string {
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899',
    '#06B6D4', '#84CC16', '#F97316', '#14B8A6', '#6366F1',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
