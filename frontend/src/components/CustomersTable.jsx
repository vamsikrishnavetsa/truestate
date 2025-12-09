import React from 'react';

export default function CustomersTable({ data = [], loading }) {
  if (loading) return <div style={{ padding: 12 }}>Loading customers...</div>;
  if (!data.length) return <div style={{ padding: 12 }}>No customers</div>;

  return (
    <div
      style={{
        overflowX: 'auto',
        marginTop: 16,
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <thead>
          <tr
            style={{
              background: '#f8fafc',
              textAlign: 'left',
              fontWeight: 600,
              borderBottom: '2px solid #e5e7eb',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <th style={thStyle}>Customer ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Region</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Recent Spend</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c, i) => (
            <tr
              key={c.customerId || i}
              style={{
                background: i % 2 === 0 ? '#ffffff' : '#f9fafb',
                transition: '0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#eef6ff')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = i % 2 === 0 ? '#ffffff' : '#f9fafb')
              }
            >
              <td style={tdStyle}>{c.customerId}</td>
              <td style={tdStyle}>{c.customerName}</td>
              <td style={tdStyle}>{c.phoneNumber}</td>
              <td style={tdStyle}>{c.region}</td>
              <td style={tdStyle}>{c.type}</td>
              <td style={tdStyle}>₹ {c.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Clean shared styles
const thStyle = {
  padding: '12px 14px',
  fontSize: 14,
  color: '#1e293b',
  borderBottom: '1px solid #e2e8f0',
};

const tdStyle = {
  padding: '12px 14px',
  fontSize: 14,
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
};
