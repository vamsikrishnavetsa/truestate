import React from 'react';

/**
 * SearchBar
 * - value: current value
 * - onChange: function(newValue)
 * This component is intentionally simple; App.jsx handles debouncing if desired.
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <input
        placeholder="Search customer name, phone, or customer ID..."
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: 10,
          fontSize: 14,
          borderRadius: 6,
          border: '1px solid #ddd'
        }}
      />
    </div>
  );
}
