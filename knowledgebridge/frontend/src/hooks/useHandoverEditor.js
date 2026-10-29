import { useState } from 'react';
import * as api from '../services/api.js';
import { blankForm, toFormState } from '../utils/handoverDefaults.js';
import { buildHandoverPayload } from '../utils/handoverPayload.js';
import { downloadBlob } from '../utils/download.js';
import { validateHandoverForm } from '../utils/validation.js';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Manages the handover editor form, save/export/delete actions.
 * `list` is the object returned by useHandoverList.
 * User feedback is sent through the global toast API.
 */
export function useHandoverEditor({ list, setScreen }) {
  const toast = useToast();
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
  }

  async function edit(handoverId) {
    try {
      const h = await api.getHandover(handoverId);
      setForm(toFormState(h));
      setId(handoverId);
      setFindings(null);
      setTab('work');
      setScreen('editor');
    } catch (e) {
      toast.error(e.message);
    }
  }

  function clearForm() {
    setForm(blankForm());
    setId(null);
    setFindings(null);
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

  /**
   * Saves the handover. Returns the saved handover, or null on failure.
   * Pass { notify: false } to suppress the success toast (used by other actions).
   */
  async function save({ notify = true } = {}) {
    const validation = validateHandoverForm(form);
    if (!validation.valid) {
      toast.error(validation.error);
      return null;
    }

    setSaving(true);
    const payload = buildHandoverPayload(form);

    try {
      const saved = await api.saveHandover(payload);
      setId(saved.id);
      setForm(toFormState(saved));
      await list.loadPage(list.currentPage);
      await list.loadGlobalStats();
      if (notify) toast.success('Handover saved successfully.');
      return saved;
    } catch (e) {
      toast.error(e.message);
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function checkCompleteness() {
    const saved = await save({ notify: false });
    if (!saved) return;
    try {
      setFindings(await api.checkCompleteness(saved.id));
      toast.success('Completeness check updated.');
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function exportDoc() {
    if (!id) {
      toast.warning('Save this handover before exporting.');
      return;
    }
    try {
      const blob = await api.exportHandover(id);
      downloadBlob(blob, `knowledgebridge-handover-${id}.docx`);
      toast.success('Your Word document is ready.');
    } catch (e) {
      toast.error(e.message);
    }
  }

  /** Deletes a handover. Returns true on success, false on failure (failure is reported as a toast). */
  async function removeHandover(handoverId) {
    try {
      await api.deleteHandover(handoverId);
    } catch (e) {
      toast.error(e.message);
      return false;
    }
    try {
      await list.loadPage(list.currentPage);
      await list.loadGlobalStats();
    } catch (e) {
      toast.error(e.message);
    }
    toast.success('Handover deleted.');
    if (id === handoverId) setScreen('dashboard');
    return true;
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
