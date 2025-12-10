import React, { useEffect, useState, useMemo } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import Pagination from './components/Pagination';
import TransactionsTable from './components/TransactionsTable';
import CustomersTable from './components/CustomersTable';
import ProductsTable from './components/ProductsTable';

function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('sales');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('Date');
  const [sortOrder, setSortOrder] = useState(-1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 300);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ results: [], total: 0, page: 1, pageSize: 10 });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [liveFilters, setLiveFilters] = useState(false); // NEW: whether FilterPanel pushes changes live

  const fetchParams = useMemo(
    () => ({ page, pageSize, sortBy, sortOrder, search: debouncedSearch, filters }),
    [page, pageSize, sortBy, sortOrder, debouncedSearch, filters]
  );

  useEffect(() => {
    setPage(1);
  }, [pageSize, sortBy, sortOrder, debouncedSearch, filters]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await api.getSales(fetchParams);
        if (!mounted) return;
        setData(res);
      } catch (e) {
        console.error('fetchData', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, [fetchParams]);

  const customerRows = data.results.map(r => ({
    customerId: r.customerId ?? r['Customer ID'],
    customerName: r.customerName ?? r['Customer Name'],
    phoneNumber: r.phoneNumber ?? r['Phone Number'],
    region: r.customerRegion ?? r['Customer Region'],
    type: r.customerType ?? r['Customer Type'],
    totalAmount: r.totalAmount ?? r['Total Amount']
  }));

  const productRows = data.results.map(r => ({
    productId: r.productId ?? r['Product ID'],
    productName: r.productName ?? r['Product Name'],
    brand: r.brand ?? r['Brand'],
    category: r.productCategory ?? r['Product Category'],
    tags: r.tags ?? (r['Tags'] ? String(r['Tags']).split(',').map(x => x.trim()) : []),
    quantity: r.quantity ?? r['Quantity']
  }));

  return (
    <div
      style={{
        padding: 22,
        maxWidth: 1280,
        margin: "0 auto",
        fontFamily: "Inter, sans-serif"
      }}
    >
      {/* HEADER */}
      <h1
        style={{
          marginBottom: 20,
          fontSize: 30,
          fontWeight: 700,
          color: "#1a1a1a",
        }}
      >
        Retail Sales Dashboard
      </h1>

      {/* TOP SECTION */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* FILTER BUTTON + LIVE TOGGLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{
              background: filtersOpen ? "#0057ff" : "#f0f0f0",
              color: filtersOpen ? "white" : "#333",
              border: "none",
              padding: "10px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              transition: "0.3s",
              boxShadow: filtersOpen ? "0 4px 12px rgba(0,0,0,0.2)" : "none"
            }}
          >
            {filtersOpen ? "Close Filters" : "Filters"}
          </button>

          {/* Live toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={liveFilters}
              onChange={(e) => setLiveFilters(e.target.checked)}
            />
            <span style={{ color: '#444' }}>Live</span>
          </label>
        </div>
      </div>

      {/* SLIDE-IN FILTER PANEL */}
      <div
        style={{
          maxHeight: filtersOpen ? 480 : 0,
          overflow: 'hidden',
          transition: "max-height 0.4s ease",
          marginBottom: 16,
          borderRadius: 10,
          background: "#fafafa",
          border: filtersOpen ? "1px solid #dedede" : "none",
          padding: filtersOpen ? 16 : "0 16px",
          boxShadow: filtersOpen ? "0 4px 12px rgba(0,0,0,0.08)" : "none"
        }}
      >
        <FilterPanel
          filters={filters}
          live={liveFilters} // pass the live flag
          onChange={(f) => {
            // FilterPanel will call this either on Apply (live=false) or on each change (live=true)
            setFilters(f || {});
            setPage(1);
          }}
        />
      </div>

      {/* SORT + TABS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "white",
          padding: "10px 0",
          zIndex: 20
        }}
      >
        {/* SORTING SECTION */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 600 }}>Sort by:</span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            <option value="Date">Date (Newest)</option>
            <option value="Quantity">Quantity</option>
            <option value="Customer Name">Customer Name (A–Z)</option>
            <option value="Final Amount">Final Amount</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === -1 ? 1 : -1)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              background: "#0066ff",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            {sortOrder === -1 ? "↓ Desc" : "↑ Asc"}
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 10 }}>
          {["sales", "customers", "products", "operational"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: activeTab === tab ? "#e8f0ff" : "#f7f7f7",
                fontWeight: activeTab === tab ? 700 : 500,
                cursor: "pointer",
                transition: "0.25s"
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* COUNT */}
      <div style={{ marginBottom: 12, color: "#666" }}>
        Showing <b>{data.results.length}</b> of <b>{data.total}</b> records
      </div>

      {/* MAIN TABLE CARD */}
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          border: "1px solid #e2e2e2",
          boxShadow: "0 8px 18px rgba(0,0,0,0.05)"
        }}
      >
        {activeTab === "sales" && <TransactionsTable data={data.results} loading={loading} />}
        {activeTab === "customers" && <CustomersTable data={customerRows} loading={loading} />}
        {activeTab === "products" && <ProductsTable data={productRows} loading={loading} />}
        {activeTab === "operational" && <TransactionsTable data={data.results} loading={loading} />}
      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: 18 }}>
        <Pagination
          page={data.page || page}
          pageSize={data.pageSize || pageSize}
          total={data.total || 0}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </div>
    </div>
  );
}
