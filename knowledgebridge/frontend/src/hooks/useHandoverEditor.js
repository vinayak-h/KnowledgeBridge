import { useState } from 'react';
import * as api from '../services/api.js';
import { blankForm, toFormState } from '../utils/handoverDefaults.js';
import { buildHandoverPayload } from '../utils/handoverPayload.js';
import { downloadBlob } from '../utils/download.js';
import { validateHandoverForm } from '../utils/validation.js';

/**
 * Manages the handover editor form, save/export/delete actions.
 * `list` is the object returned by useHandoverList.
 */
export function useHandoverEditor({ list, setError, setNotice, setScreen }) {
  const [form, setForm] = useState(blankForm());
  const [id, setId] = useState(null);
  const [tab, setTab] = useState('work');
  const [findings, setFindings] = useState(null);
  const [saving, setSaving] = useState(false);

  function create() {
    setForm(blankForm());
    setId(null);
    setFindings(null);
    setTab('work');
    setScreen('editor');
    setError('');
    setNotice('');
  }

  async function edit(handoverId) {
    try {
      const h = await api.getHandover(handoverId);
      setForm(toFormState(h));
      setId(handoverId);
      setFindings(null);
      setTab('work');
      setScreen('editor');
      setError('');
      setNotice('');
    } catch (e) {
      setError(e.message);
    }
  }

  function clearForm() {
    setForm(blankForm());
    setId(null);
    setFindings(null);
    setError('');
  }

  function patch(key, value) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setFindings(null);
  }

  function patchArray(key, index, field, value) {
    setForm((previous) => ({
      ...previous,
      [key]: previous[key].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    setFindings(null);
  }

  function addArray(key, value) {
    setForm((previous) => ({ ...previous, [key]: [...previous[key], value] }));
  }

  function removeArray(key, index) {
    setForm((previous) => ({
      ...previous,
      [key]: previous[key].filter((_, i) => i !== index),
    }));
  }

  async function save() {
    const validation = validateHandoverForm(form);
    if (!validation.valid) {
      setError(validation.error);
      return null;
    }

    setSaving(true);
    setError('');

    const payload = buildHandoverPayload(form);

    try {
      const saved = await api.saveHandover(payload);
      setId(saved.id);
      setForm(toFormState(saved));
      await list.loadPage(list.currentPage);
      await list.loadGlobalStats();
      setNotice('Handover saved successfully.');
      return saved;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function checkCompleteness() {
    const saved = await save();
    if (!saved) return;
    try {
      setFindings(await api.checkCompleteness(saved.id));
      setNotice('Completeness check updated.');
    } catch (e) {
      setError(e.message);
    }
  }

  async function exportDoc() {
    if (!id) {
      setError('Save this handover before exporting.');
      return;
    }
    try {
      const blob = await api.exportHandover(id);
      downloadBlob(blob, `knowledgebridge-handover-${id}.docx`);
      setNotice('Your Word document is ready.');
    } catch (e) {
      setError(e.message);
    }
  }

  /** Deletes a handover. Returns null on success, or the error message on failure. */
  async function removeHandover(handoverId) {
    try {
      await api.deleteHandover(handoverId);
    } catch (e) {
      setError(e.message);
      return e.message;
    }
    try {
      await list.loadPage(list.currentPage);
      await list.loadGlobalStats();
    } catch (e) {
      setError(e.message);
    }
    setNotice('Handover deleted.');
    if (id === handoverId) setScreen('dashboard');
    return null;
  }

  return {
    form,
    id,
    tab,
    setTab,
    findings,
    saving,
    create,
    edit,
    clearForm,
    patch,
    patchArray,
    addArray,
    removeArray,
    save,
    checkCompleteness,
    exportDoc,
    removeHandover,
  };
}
