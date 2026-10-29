import { useEffect, useState } from 'react';
import * as api from '../services/api.js';
import {
  DEFAULT_PAGE_SIZE,
  INITIAL_STATS,
  SEARCH_DEBOUNCE_MS,
} from '../utils/constants.js';
import { computeGlobalStats } from '../utils/handoverStats.js';

/**
 * Manages the paginated handover list, filters, and dashboard statistics.
 */
export function useHandoverList({ onError }) {
  const [pageData, setPageData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [globalStats, setGlobalStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);

  async function loadPage(pageNum = 0, size = pageSize) {
    setLoading(true);
    try {
      const result = await api.listHandovers(
        { search, status: statusFilter, type: typeFilter },
        { page: pageNum, size, sort: 'updatedAt', direction: 'DESC' }
      );
      setPageData(result);
      setCurrentPage(pageNum);
      onError('');
    } catch (e) {
      onError(
        `${e.message}. Confirm MySQL and the Spring Boot backend are running, then refresh.`
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadGlobalStats() {
    try {
      const result = await api.loadHandoverStats();
      setGlobalStats(computeGlobalStats(result));
    } catch (e) {
      console.error('Failed to load global stats:', e);
    }
  }

  useEffect(() => {
    loadPage(0);
    loadGlobalStats();
  }, []);

  function handleSearch(val) {
    setSearch(val);
    clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setCurrentPage(0);
        loadPage(0);
      }, SEARCH_DEBOUNCE_MS)
    );
  }

  function handleStatusChange(val) {
    setStatusFilter(val);
    setCurrentPage(0);
    loadPage(0);
  }

  function handleTypeChange(val) {
    setTypeFilter(val);
    setCurrentPage(0);
    loadPage(0);
  }

  function handlePageSizeChange(newSize) {
    setPageSize(newSize);
    setCurrentPage(0);
    loadPage(0, newSize);
  }

  function clearFilters() {
    setSearch('');
    handleStatusChange('ALL');
    handleTypeChange('ALL');
  }

  return {
    pageData,
    currentPage,
    pageSize,
    search,
    statusFilter,
    typeFilter,
    globalStats,
    loading,
    loadPage,
    loadGlobalStats,
    handleSearch,
    handleStatusChange,
    handleTypeChange,
    handlePageSizeChange,
    clearFilters,
  };
}
