import {
  BLANK_FORM,
  BLANK_WORK_ITEM,
  BLANK_KNOWLEDGE_ENTRY,
  BLANK_REFERENCE_LINK,
} from './constants.js';

export const blankForm = () => ({ ...BLANK_FORM });
export const newWorkItem = () => ({ ...BLANK_WORK_ITEM });
export const newKnowledgeEntry = () => ({ ...BLANK_KNOWLEDGE_ENTRY });
export const newReferenceLink = () => ({ ...BLANK_REFERENCE_LINK });

/**
 * Maps a handover returned by the API onto editable form state.
 */
export function toFormState(handover) {
  return {
    ...blankForm(),
    ...handover,
    startDate: handover.startDate || '',
    endDate: handover.endDate || '',
    workItems: handover.workItems || [],
    knowledgeEntries: handover.knowledgeEntries || [],
    referenceLinks: handover.referenceLinks || [],
  };
}
