import React from 'react';

/**
 * SearchBar - Upgraded UI
 * Includes search icon, better styling, focus ring,
 * clean rounded input, improved placeholder contrast.
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Search Icon */}
        <span
          style={{
            position: "absolute",
            left: 14,
            fontSize: 16,
            color: "#6b7280", // gray-500
            pointerEvents: "none",
          }}
        >
          🔍
        </span>

        <input
          placeholder="Search customer name, phone, product, etc..."
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px 10px 38px", // spacing for icon
            fontSize: 14,
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "#ffffff",
            transition: "0.2s",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            fontFamily: "Inter, sans-serif",
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid #3b82f6"; // blue-500
            e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.25)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1px solid #d1d5db";
            e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
          }}
        />
      </div>
    </div>
  );
}
