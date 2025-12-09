import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:5000/api';
const client = axios.create({ baseURL: API_ROOT, timeout: 30000 });

async function getSales({ page=1, pageSize=10, sortBy='Date', sortOrder=-1, search='', filters={} } = {}) {
  const params = { page, pageSize, sortBy, sortOrder, search, filters: JSON.stringify(filters) };
  const res = await client.get('/sales', { params });
  return res.data;
}

async function getFilters() {
  const res = await client.get('/sales/filters');
  return res.data;
}

export default { getSales, getFilters };
