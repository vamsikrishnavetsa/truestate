import React, { useState } from 'react';

function fmtDate(val) {
  if (!val) return "";
  try {
    const d = new Date(val);
    if (isNaN(d)) return String(val);
    return d.toLocaleDateString();
  } catch {
    return String(val);
  }
}

export default function TransactionsTable({ data = [], loading }) {
  const [expanded, setExpanded] = useState(null);

  if (loading) return <div style={{ padding: 12 }}>Loading transactions...</div>;
  if (!data.length) return <div style={{ padding: 12 }}>No transactions found</div>;

  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        marginTop: 16,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* HEADER */}
        <thead>
          <tr
            style={{
              background: "#f8fafc",
              textAlign: "left",
              fontWeight: 600,
              borderBottom: "2px solid #e5e7eb",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Customer ID</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Final Amount</th>
            <th style={thStyle}>More</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((r, i) => {
            const isOpen = expanded === i;
            return (
              <React.Fragment key={r._id || i}>

                {/* MAIN ROW */}
                <tr
                  style={{
                    background: i % 2 === 0 ? "#ffffff" : "#f9fafb",
                    transition: "0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#eef6ff")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      i % 2 === 0 ? "#ffffff" : "#f9fafb")
                  }
                >
                  <td style={tdStyle}>{fmtDate(r.date)}</td>
                  <td style={tdStyle}>{r.customerId ?? r["Customer ID"]}</td>
                  <td style={tdStyle}>{r.customerName ?? r["Customer Name"]}</td>
                  <td style={tdStyle}>{r.phoneNumber ?? r["Phone Number"]}</td>
                  <td style={tdStyle}>{r.productName ?? r["Product Name"]}</td>
                  <td style={tdStyle}>{r.productCategory ?? r["Product Category"]}</td>
                  <td style={tdStyle}>{r.quantity ?? r["Quantity"]}</td>
                  <td style={tdStyle}>₹ {r.finalAmount ?? r["Final Amount"]}</td>

                  <td style={tdStyle}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : i)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #cfcfcf",
                        background: isOpen ? "#dbeafe" : "#f8f9fa",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {isOpen ? "Hide" : "Show"}
                    </button>
                  </td>
                </tr>

                {/* EXPANDED SECTION */}
                {isOpen && (
                  <tr>
                    <td colSpan={9} style={{ padding: 16, background: "#f8fafc" }}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: 10,
                        }}
                      >
                        {renderDetail("Customer ID", r.customerId ?? r["Customer ID"])}
                        {renderDetail("Customer Name", r.customerName ?? r["Customer Name"])}
                        {renderDetail("Phone Number", r.phoneNumber ?? r["Phone Number"])}
                        {renderDetail("Gender", r.gender ?? r["Gender"])}
                        {renderDetail("Age", r.age ?? r["Age"])}
                        {renderDetail("Customer Region", r.customerRegion ?? r["Customer Region"])}
                        {renderDetail("Customer Type", r.customerType ?? r["Customer Type"])}

                        {renderDetail("Product ID", r.productId ?? r["Product ID"])}
                        {renderDetail("Brand", r.brand ?? r["Brand"])}
                        {renderDetail("Category", r.productCategory ?? r["Product Category"])}
                        {renderDetail("Tags",
                          Array.isArray(r.tags)
                            ? r.tags.join(", ")
                            : r["Tags"] ?? ""
                        )}

                        {renderDetail("Quantity", r.quantity ?? r["Quantity"])}
                        {renderDetail("Price per Unit", r.pricePerUnit ?? r["Price per Unit"])}
                        {renderDetail("Discount %", r.discountPercentage ?? r["Discount Percentage"])}
                        {renderDetail("Total Amount", r.totalAmount ?? r["Total Amount"])}
                        {renderDetail("Final Amount", r.finalAmount ?? r["Final Amount"])}

                        {renderDetail("Date", fmtDate(r.date ?? r["Date"]))}
                        {renderDetail("Payment Method", r.paymentMethod ?? r["Payment Method"])}
                        {renderDetail("Order Status", r.orderStatus ?? r["Order Status"])}
                        {renderDetail("Delivery Type", r.deliveryType ?? r["Delivery Type"])}
                        {renderDetail("Store ID", r.storeId ?? r["Store ID"])}
                        {renderDetail("Store Location", r.storeLocation ?? r["Store Location"])}
                        {renderDetail("Salesperson ID", r.salespersonId ?? r["Salesperson ID"])}
                        {renderDetail("Employee Name", r.employeeName ?? r["Employee Name"])}
                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Small helper for expanded fields
function renderDetail(label, value) {
  return (
    <div style={{ fontSize: 14 }}>
      <strong style={{ color: "#1e293b" }}>{label}:</strong>{" "}
      <span style={{ color: "#475569" }}>{value}</span>
    </div>
  );
}


// Shared styles
const thStyle = {
  padding: "12px 14px",
  fontSize: 14,
  color: "#1e293b",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "12px 14px",
  fontSize: 14,
  color: "#334155",
  borderBottom: "1px solid #f1f5f9",
};
