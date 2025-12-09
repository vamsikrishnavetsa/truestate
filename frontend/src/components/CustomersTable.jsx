import React from 'react';

export default function CustomersTable({ data = [], loading }) {
  if (loading) return <div>Loading customers...</div>;
  if (!data.length) return <div>No customers</div>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Region</th>
          <th>Type</th>
          <th>Recent Spend</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c, i) => (
          <tr key={c.customerId || i}>
            <td>{c.customerId}</td>
            <td>{c.customerName}</td>
            <td>{c.phoneNumber}</td>
            <td>{c.region}</td>
            <td>{c.type}</td>
            <td>{c.totalAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
