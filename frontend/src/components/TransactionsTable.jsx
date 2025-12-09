import React, { useState } from 'react';

function fmtDate(val) {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (isNaN(d)) return String(val);
    return d.toLocaleDateString();
  } catch (e) {
    return String(val);
  }
}

export default function TransactionsTable({ data = [], loading }) {
  const [expanded, setExpanded] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (!Array.isArray(data) || data.length === 0) return <div>No results</div>;

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Final Amount</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <React.Fragment key={r._id || i}>
              <tr style={{ borderTop: '1px solid #eee' }}>
                <td>{fmtDate(r.date)}</td>
                <td>{r.customerId ?? r['Customer ID'] ?? ''}</td>
                <td>{r.customerName ?? r['Customer Name'] ?? ''}</td>
                <td>{r.phoneNumber ?? r['Phone Number'] ?? ''}</td>
                <td>{r.productName ?? r['Product Name'] ?? ''}</td>
                <td>{r.productCategory ?? r['Product Category'] ?? ''}</td>
                <td>{r.quantity ?? r['Quantity'] ?? ''}</td>
                <td>{r.finalAmount ?? r['Final Amount'] ?? ''}</td>
                <td>
                  <button onClick={() => setExpanded(expanded === i ? null : i)}>
                    {expanded === i ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>

              {expanded === i && (
                <tr>
                  <td colSpan={9} style={{ background: '#fafafa', padding: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                      {/* Customer fields */}
                      <div><strong>Customer ID:</strong> {r.customerId ?? r['Customer ID']}</div>
                      <div><strong>Customer Name:</strong> {r.customerName ?? r['Customer Name']}</div>
                      <div><strong>Phone Number:</strong> {r.phoneNumber ?? r['Phone Number']}</div>
                      <div><strong>Gender:</strong> {r.gender ?? r['Gender']}</div>
                      <div><strong>Age:</strong> {r.age ?? r['Age']}</div>
                      <div><strong>Customer Region:</strong> {r.customerRegion ?? r['Customer Region']}</div>
                      <div><strong>Customer Type:</strong> {r.customerType ?? r['Customer Type']}</div>

                      {/* Product fields */}
                      <div><strong>Product ID:</strong> {r.productId ?? r['Product ID']}</div>
                      <div><strong>Brand:</strong> {r.brand ?? r['Brand']}</div>
                      <div><strong>Product Category:</strong> {r.productCategory ?? r['Product Category']}</div>
                      <div><strong>Tags:</strong> {(r.tags && r.tags.join) ? r.tags.join(', ') : (r['Tags'] ?? '')}</div>

                      {/* Sales fields */}
                      <div><strong>Quantity:</strong> {r.quantity ?? r['Quantity']}</div>
                      <div><strong>Price per Unit:</strong> {r.pricePerUnit ?? r['Price per Unit']}</div>
                      <div><strong>Discount %:</strong> {r.discountPercentage ?? r['Discount Percentage']}</div>
                      <div><strong>Total Amount:</strong> {r.totalAmount ?? r['Total Amount']}</div>
                      <div><strong>Final Amount:</strong> {r.finalAmount ?? r['Final Amount']}</div>

                      {/* Operational fields */}
                      <div><strong>Date:</strong> {fmtDate(r.date ?? r['Date'])}</div>
                      <div><strong>Payment Method:</strong> {r.paymentMethod ?? r['Payment Method']}</div>
                      <div><strong>Order Status:</strong> {r.orderStatus ?? r['Order Status']}</div>
                      <div><strong>Delivery Type:</strong> {r.deliveryType ?? r['Delivery Type']}</div>
                      <div><strong>Store ID:</strong> {r.storeId ?? r['Store ID']}</div>
                      <div><strong>Store Location:</strong> {r.storeLocation ?? r['Store Location']}</div>
                      <div><strong>Salesperson ID:</strong> {r.salespersonId ?? r['Salesperson ID']}</div>
                      <div><strong>Employee Name:</strong> {r.employeeName ?? r['Employee Name']}</div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
