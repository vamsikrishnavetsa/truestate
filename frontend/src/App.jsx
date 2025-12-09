import React, { useEffect, useState, useMemo } from 'react';
import api from './services/api'; // your axios wrapper (getSales)
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
  // global UI state
  const [activeTab, setActiveTab] = useState('sales'); // 'sales' | 'customers' | 'products' | 'operational'
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('Date');
  const [sortOrder, setSortOrder] = useState(-1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 300);
  const [filters, setFilters] = useState({}); // friendly keys: customerRegion, productCategory, tags, dateRange, ageRange, paymentMethod, gender
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ results: [], total: 0, page: 1, pageSize: 10 });

  // Build fetch params once (memoize)
  const fetchParams = useMemo(() => ({ page, pageSize, sortBy, sortOrder, search: debouncedSearch, filters }), [page, pageSize, sortBy, sortOrder, debouncedSearch, filters]);

  useEffect(() => {
    // whenever key state changes, fetch page 1 (except page change)
    setPage(1);
  }, [pageSize, sortBy, sortOrder, debouncedSearch, filters]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // only sales API built in backend currently; for customers/products, we'll request sales and aggregate client-side
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
    return () => { mounted = false; };
  }, [fetchParams]);

  // Derived small summaries for Customers / Products views
  // We can also create backend endpoints for aggregated customers/products if desired (recommended for large dataset)
  // For now we generate client-friendly list from current page results.
  const customerRows = data.results.map(r => ({
    customerId: r.customerId ?? r['Customer ID'],
    customerName: r.customerName ?? r['Customer Name'],
    phoneNumber: r.phoneNumber ?? r['Phone Number'],
    region: r.customerRegion ?? r['Customer Region'],
    type: r.customerType ?? r['Customer Type'],
    totalAmount: r.totalAmount ?? r['Total Amount'],
  }));

  const productRows = data.results.map(r => ({
    productId: r.productId ?? r['Product ID'],
    productName: r.productName ?? r['Product Name'],
    brand: r.brand ?? r['Brand'],
    category: r.productCategory ?? r['Product Category'],
    tags: r.tags ?? (r['Tags'] ? String(r['Tags']).split(',').map(x=>x.trim()) : []),
    quantity: r.quantity ?? r['Quantity']
  }));

  return (
    <div style={{ padding: 18 }}>
      <h1>Retail Sales Dashboard</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div style={{ width: 320 }}>
          <FilterPanel filters={filters} onChange={(f) => { setFilters(f || {}); setPage(1); }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <label>Sort:</label>
          <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="Date">Date (Newest)</option>
            <option value="Quantity">Quantity</option>
            <option value="Customer Name">Customer Name (A–Z)</option>
            <option value="Final Amount">Final Amount</option>
          </select>
          <button onClick={()=>setSortOrder(sortOrder === -1 ? 1 : -1)} style={{ marginLeft: 8 }}>{sortOrder === -1 ? 'Desc' : 'Asc'}</button>
        </div>

        <div>
          <button onClick={()=>setActiveTab('sales')} style={{ fontWeight: activeTab === 'sales' ? 'bold' : 'normal' }}>Sales</button>
          <button onClick={()=>setActiveTab('customers')} style={{ fontWeight: activeTab === 'customers' ? 'bold' : 'normal', marginLeft: 8 }}>Customers</button>
          <button onClick={()=>setActiveTab('products')} style={{ fontWeight: activeTab === 'products' ? 'bold' : 'normal', marginLeft: 8 }}>Products</button>
          <button onClick={()=>setActiveTab('operational')} style={{ fontWeight: activeTab === 'operational' ? 'bold' : 'normal', marginLeft: 8 }}>Operational</button>
        </div>
      </div>

      {/* Page info */}
      <div style={{ marginBottom: 6 }}>
        Showing {data.results.length} / {data.total}
      </div>

      {/* main area: show tab content */}
      <div>
        {activeTab === 'sales' && <TransactionsTable data={data.results} loading={loading} />}

        {activeTab === 'customers' && <CustomersTable data={customerRows} loading={loading} />}

        {activeTab === 'products' && <ProductsTable data={productRows} loading={loading} />}

        {activeTab === 'operational' && (
          <div>
            {/* Reuse TransactionsTable for operational, or show a lightweight table */}
            <TransactionsTable data={data.results} loading={loading} />
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <Pagination
          page={data.page || page}
          pageSize={data.pageSize || pageSize}
          total={data.total || 0}
          onPageChange={(p) => { setPage(p); }}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      </div>
    </div>
  );
}
