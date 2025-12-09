import React from "react";

/**
 * Pagination Component - Premium UI
 */
export default function Pagination({
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSizes = [5, 10, 25, 50, 100];

  return (
    <div
      style={{
        marginTop: 18,
        padding: "12px 18px",
        borderRadius: 12,
        background: "white",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* LEFT: Page Controls */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <PageButton
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          ← Previous
        </PageButton>

        <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <PageButton
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next →
        </PageButton>
      </div>

      {/* RIGHT: Page Size + Display */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 14, color: "#374151" }}>Rows per page:</span>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "white",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {pageSizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <span style={{ fontSize: 13, color: "#6b7280" }}>
          Showing{" "}
          <b>{total === 0 ? 0 : (page - 1) * pageSize + 1}</b> -{" "}
          <b>{Math.min(total, page * pageSize)}</b> of <b>{total}</b>
        </span>
      </div>
    </div>
  );
}

/* ----------------------------
   Reusable Button Component
----------------------------- */
function PageButton({ disabled, children, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        background: disabled ? "#f3f4f6" : "#f8fafc",
        color: disabled ? "#9ca3af" : "#1f2937",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "#e7efff";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = "#f8fafc";
      }}
    >
      {children}
    </button>
  );
}
