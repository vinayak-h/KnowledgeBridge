// Form validation logic
// Extracted from save() function for reusability and testability

/**
 * Validate a handover form before saving
 * Returns { valid: boolean, error?: string }
 */
export function validateHandoverForm(form) {
  // Title is required
  if (!form.title?.trim()) {
    return { valid: false, error: 'Add a handover title before saving.' };
  }

  // Creator is required
  if (!form.creator?.trim()) {
    return { valid: false, error: 'Add a creator (your name) before saving.' };
  }

  // End date cannot be before start date
  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    return { valid: false, error: 'The end date cannot be earlier than the start date.' };
  }

  return { valid: true };
}

/**
 * Validate work item data
 * Returns { valid: boolean, error?: string }
 */
export function validateWorkItem(workItem) {
  if (!workItem.title?.trim()) {
    return { valid: false, error: 'Work item title is required.' };
  }

  return { valid: true };
}

/**
 * Validate knowledge entry data
 */
export function validateKnowledgeEntry(entry) {
  if (!entry.title?.trim()) {
    return { valid: false, error: 'Knowledge entry title is required.' };
  }

  return { valid: true };
}

/**
 * Validate reference link data
 */
export function validateReferenceLink(link) {
  if (!link.label?.trim()) {
    return { valid: false, error: 'Reference link label is required.' };
  }

  if (link.url && !isValidUrl(link.url)) {
    return { valid: false, error: 'Reference link URL must be valid.' };
  }

  return { valid: true };
}

/**
 * Check if a string is a valid URL
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
