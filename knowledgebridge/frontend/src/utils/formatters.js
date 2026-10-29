// Utility functions for formatting display values

/**
 * Convert enum strings to display-friendly format
 * E.g., 'PROJECT_TRANSITION' -> 'Project Transition'
 */
export function nice(value = '') {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Format a date string (YYYY-MM-DD) to display format
 * E.g., '2026-10-28' -> 'Oct 28, 2026'
 * Returns 'Not set' if date is missing
 */
export function dateText(value) {
  if (!value) return 'Not set';
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a timestamp for display
 * E.g., '2026-10-28T18:22:11.670Z' -> 'Oct 28'
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'Recently updated';
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate percentage completion from work items
 * Returns 0 if no work items
 */
export function calculateCompletion(workItems = []) {
  if (!workItems.length) return 0;
  const completed = workItems.filter(w => w.status === 'COMPLETED').length;
  return Math.round((completed / workItems.length) * 100);
}

/**
 * Get initials from a person's name for avatar
 */
export function getInitials(name = '') {
  return (name || '?').trim().slice(0, 1).toUpperCase();
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(text = '', maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}
