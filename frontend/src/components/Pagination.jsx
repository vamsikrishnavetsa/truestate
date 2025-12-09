import React from 'react';

/**
 * Pagination
 * Props:
 *  - page (number)
 *  - pageSize (number)
 *  - total (number)
 *  - onPageChange(newPage)
 *  - onPageSizeChange(newSize) optional
 */
export default function Pagination({ page = 1, pageSize = 10, total = 0, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageSizes = [5, 10, 25, 50, 100];

  return (
    <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>Previous</button>
        <span>Page {page} / {totalPages}</span>
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ fontSize: 13 }}>Rows per page</label>
        <select
          value={pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            if (onPageSizeChange) onPageSizeChange(newSize);
          }}
        >
          {pageSizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div style={{ color: '#666', fontSize: 13 }}>
          Showing {(page - 1) * pageSize + 1} - {Math.min(total, page * pageSize)} of {total}
        </div>
      </div>
    </div>
  );
}
