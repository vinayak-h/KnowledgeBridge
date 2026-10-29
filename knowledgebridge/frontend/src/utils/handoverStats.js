/**
 * Derives dashboard counters from a paginated handover response.
 */
export function computeGlobalStats(result) {
  const items = result.content || [];
  const totalWork = items.reduce((n, h) => n + (h.workItems?.length || 0), 0);
  const active = items.filter((h) => h.status !== 'SHARED').length;
  const shared = items.filter((h) => h.status === 'SHARED').length;
  const completedWork = items.reduce(
    (n, h) =>
      n + (h.workItems || []).filter((w) => w.status === 'COMPLETED').length,
    0
  );

  return {
    total: result.totalElements || 0,
    active,
    shared,
    totalWork,
    completedWork,
  };
}

/**
 * Readiness meter percentage: uses server findings when available, otherwise form progress.
 */
export function getReadinessPercent(form, findings) {
  if (findings) {
    return Math.max(
      10,
      findings.ready ? 100 : 100 - findings.warningCount * 16
    );
  }

  return Math.min(
    85,
    20 +
      (form.title ? 15 : 0) +
      (form.creator ? 15 : 0) +
      (form.summary ? 15 : 0) +
      (form.workItems.length ? 20 : 0) +
      (form.recipient ? 15 : 0)
  );
}
