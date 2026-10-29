/**
 * Trims text fields and converts empty dates to null before saving.
 */
export function buildHandoverPayload(form) {
  return {
    ...form,
    title: form.title.trim(),
    creator: form.creator.trim(),
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    workItems: form.workItems.map((w) => ({
      ...w,
      title: (w.title || '').trim(),
      dueDate: w.dueDate || null,
    })),
    knowledgeEntries: form.knowledgeEntries.map((k) => ({
      ...k,
      title: (k.title || '').trim(),
    })),
    referenceLinks: form.referenceLinks.map((l) => ({
      ...l,
      label: (l.label || '').trim(),
      url: (l.url || '').trim(),
    })),
  };
}
