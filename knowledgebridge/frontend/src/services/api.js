// Centralized API communication layer
// All HTTP requests go through here for consistent error handling,
// logging, and future features like auth, caching, retry logic

import { API_BASE_URL } from '../utils/constants.js';

/**
 * Core fetch wrapper
 * Handles response parsing, error handling, and blob responses
 * Throws on non-200 status codes
 */
async function fetchAPI(url, opts = {}) {
  const response = await fetch(url, {
    ...opts,
    headers: {
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.headers || {}),
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(
      payload.error || payload.message || `Request failed (${response.status})`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return opts.blob ? response.blob() : response.json();
}

/**
 * List handovers with pagination and filters
 * @param {Object} filters - { search?, status?, type? }
 * @param {Object} pagination - { page, size, sort, direction }
 */
export async function listHandovers(filters = {}, pagination = {}) {
  const {
    page = 0,
    size = 10,
    sort = 'updatedAt',
    direction = 'DESC',
  } = pagination;

  const params = new URLSearchParams({
    page,
    size,
    sort,
    direction,
    ...(filters.search?.trim() && { search: filters.search.trim() }),
    ...(filters.status && filters.status !== 'ALL' && { status: filters.status }),
    ...(filters.type && filters.type !== 'ALL' && { type: filters.type }),
  });

  return fetchAPI(`${API_BASE_URL}?${params.toString()}`);
}

/**
 * Load statistics from all matching handovers
 * Used to populate dashboard statistics
 */
export async function loadHandoverStats(filters = {}) {
  const params = new URLSearchParams({
    page: 0,
    size: 1000,
    sort: 'updatedAt',
    direction: 'DESC',
  });

  return fetchAPI(`${API_BASE_URL}?${params.toString()}`);
}

/**
 * Get a single handover with all related data
 */
export async function getHandover(id) {
  return fetchAPI(`${API_BASE_URL}/${id}`);
}

/**
 * Create or update a handover
 */
export async function saveHandover(handover) {
  const method = handover.id ? 'PUT' : 'POST';
  const url = handover.id ? `${API_BASE_URL}/${handover.id}` : API_BASE_URL;

  return fetchAPI(url, {
    method,
    body: JSON.stringify(handover),
  });
}

/**
 * Delete a handover and all related data
 */
export async function deleteHandover(id) {
  return fetchAPI(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
}

/**
 * Check handover completeness
 * Returns findings with warnings and readiness status
 */
export async function checkCompleteness(id) {
  return fetchAPI(`${API_BASE_URL}/${id}/completeness`);
}

/**
 * Export handover as a Word document
 * Returns a Blob (binary file data)
 */
export async function exportHandover(id) {
  return fetchAPI(`${API_BASE_URL}/${id}/export`, { blob: true });
}

export default {
  listHandovers,
  loadHandoverStats,
  getHandover,
  saveHandover,
  deleteHandover,
  checkCompleteness,
  exportHandover,
};
