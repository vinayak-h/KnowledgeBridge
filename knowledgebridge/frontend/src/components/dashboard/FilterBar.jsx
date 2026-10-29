import { ChevronDown, Filter, Search } from 'lucide-react';

export default function FilterBar({ list }) {
  const {
    search,
    statusFilter,
    typeFilter,
    handleSearch,
    handleStatusChange,
    handleTypeChange,
  } = list;

  return (
    <div className="filter-bar">
      <label className="search-box">
        <Search size={18} />
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by title, creator or recipient..."
        />
        <kbd>⌕</kbd>
      </label>
      <label className="filter-select">
        <Filter size={15} />
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="ALL">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="READY">Ready for review</option>
          <option value="SHARED">Shared</option>
        </select>
        <ChevronDown size={15} />
      </label>
      <label className="filter-select">
        <select
          value={typeFilter}
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          <option value="ALL">All types</option>
          <option value="LEAVE">Leave</option>
          <option value="PROJECT_TRANSITION">Project transition</option>
          <option value="ROLE_CHANGE">Role change</option>
          <option value="RESPONSIBILITY_TRANSFER">
            Responsibility transfer
          </option>
        </select>
        <ChevronDown size={15} />
      </label>
    </div>
  );
}
