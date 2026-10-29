// Constants for handover types, statuses, and defaults
// Used throughout the application to avoid magic strings

export const HANDOVER_TYPES = {
  LEAVE: 'LEAVE',
  PROJECT_TRANSITION: 'PROJECT_TRANSITION',
  ROLE_CHANGE: 'ROLE_CHANGE',
  RESPONSIBILITY_TRANSFER: 'RESPONSIBILITY_TRANSFER',
};

export const HANDOVER_TYPE_LABELS = {
  LEAVE: 'Planned / unplanned leave',
  PROJECT_TRANSITION: 'Project transition',
  ROLE_CHANGE: 'Role change',
  RESPONSIBILITY_TRANSFER: 'Responsibility transfer',
};

export const HANDOVER_STATUSES = {
  DRAFT: 'DRAFT',
  READY: 'READY',
  SHARED: 'SHARED',
};

export const WORK_ITEM_STATUSES = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  COMPLETED: 'COMPLETED',
};

export const WORK_ITEM_STATUS_LABELS = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  BLOCKED: 'Blocked',
  COMPLETED: 'Completed',
};

export const KNOWLEDGE_TYPES = {
  DECISION: 'DECISION',
  ISSUE: 'ISSUE',
  WORKAROUND: 'WORKAROUND',
  DEPENDENCY: 'DEPENDENCY',
  OPEN_QUESTION: 'OPEN_QUESTION',
  GENERAL: 'GENERAL',
};

export const KNOWLEDGE_TYPE_LABELS = {
  DECISION: 'Decision',
  ISSUE: 'Issue',
  WORKAROUND: 'Workaround',
  DEPENDENCY: 'Dependency',
  OPEN_QUESTION: 'Open question',
  GENERAL: 'General note',
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];
export const SEARCH_DEBOUNCE_MS = 300;

// Notification timing
export const TOAST_DURATION_MS = 5000;
export const TOAST_EXIT_MS = 180;
export const TOAST_MAX_VISIBLE = 5;

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/handovers';
export const API_STATS_PAGE_SIZE = 1000;

// Default form state shape
export const BLANK_FORM = {
  title: '',
  type: HANDOVER_TYPES.LEAVE,
  creator: '',
  recipient: '',
  startDate: '',
  endDate: '',
  summary: '',
  status: HANDOVER_STATUSES.DRAFT,
  workItems: [],
  knowledgeEntries: [],
  referenceLinks: [],
};

export const BLANK_WORK_ITEM = {
  title: '',
  description: '',
  status: WORK_ITEM_STATUSES.IN_PROGRESS,
  owner: '',
  dueDate: '',
  blocker: '',
  completedWork: '',
  nextAction: '',
};

export const BLANK_KNOWLEDGE_ENTRY = {
  type: KNOWLEDGE_TYPES.DECISION,
  title: '',
  content: '',
};

export const BLANK_REFERENCE_LINK = {
  label: '',
  url: '',
};

// Initial global stats shape
export const INITIAL_STATS = {
  total: 0,
  active: 0,
  shared: 0,
  totalWork: 0,
  completedWork: 0,
};
