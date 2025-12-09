import React from 'react';

export default function ProductsTable({ data = [], loading }) {
  if (loading) return <div>Loading products...</div>;
  if (!data.length) return <div>No products</div>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Tags</th>
          <th>Qty (page)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p, i) => (
          <tr key={p.productId || i}>
            <td>{p.productId}</td>
            <td>{p.productName}</td>
            <td>{p.brand}</td>
            <td>{p.category}</td>
            <td>{p.tags ? p.tags.join(', ') : ''}</td>
            <td>{p.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
