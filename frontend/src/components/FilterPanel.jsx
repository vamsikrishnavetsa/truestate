import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Tailwind-based, responsive, accessible Filter Panel
// - Uses checkbox lists for multi-select (better UX than native <select multiple>)
// - Shows dataset age range hints
// - Has Apply and Reset buttons
// - Accepts `filters` and `onChange` props like your original component

export default function FilterPanel({ filters = {}, onChange = () => {}, live = false }) {
  const [options, setOptions] = useState({
    customerRegion: [],
    gender: [],
    productCategory: [],
    tags: [],
    paymentMethod: [],
    ageRange: { min: null, max: null }
  });

  const [local, setLocal] = useState({
    customerRegion: filters.customerRegion || [],
    gender: filters.gender || [],
    ageRange: filters.ageRange || [null, null],
    productCategory: filters.productCategory || [],
    tags: filters.tags || [],
    paymentMethod: filters.paymentMethod || [],
    dateRange: filters.dateRange || [null, null]
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.getFilters();
        if (!mounted) return;
        setOptions({
          customerRegion: res.customerRegion || [],
          gender: res.gender || [],
          productCategory: res.productCategory || [],
          tags: res.tags || [],
          paymentMethod: res.paymentMethod || [],
          ageRange: res.ageRange || { min: null, max: null }
        });
      } catch (e) {
        console.error('Failed to load filter options', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setLocal({
      customerRegion: filters.customerRegion || [],
      gender: filters.gender || [],
      ageRange: filters.ageRange || [null, null],
      productCategory: filters.productCategory || [],
      tags: filters.tags || [],
      paymentMethod: filters.paymentMethod || [],
      dateRange: filters.dateRange || [null, null]
    });
  }, [filters]);

  function toggleArrayField(field, value) {
    const set = new Set(local[field]);
    if (set.has(value)) set.delete(value); else set.add(value);
    const next = { ...local, [field]: Array.from(set) };
    setLocal(next);
    if (live) onChange(next);
  }

  function update(field, value) {
    const next = { ...local, [field]: value };
    setLocal(next);
    if (live) onChange(next);
  }

  const minAge = options.ageRange?.min ?? null;
  const maxAge = options.ageRange?.max ?? null;

  function clampMin(v) {
    const minVal = v === '' ? null : Number(v);
    const maxVal = local.ageRange[1];
    const clampedMin = minVal === null ? null : (minAge !== null ? Math.max(minAge, minVal) : minVal);
    update('ageRange', [clampedMin, maxVal]);
  }
  function clampMax(v) {
    const maxVal = v === '' ? null : Number(v);
    const minVal = local.ageRange[0];
    const clampedMax = maxVal === null ? null : (maxAge !== null ? Math.min(maxAge, maxVal) : maxVal);
    update('ageRange', [minVal, clampedMax]);
  }

  function handleReset() {
    const empty = { customerRegion: [], gender: [], ageRange: [null, null], productCategory: [], tags: [], paymentMethod: [], dateRange: [null, null] };
    setLocal(empty);
    onChange(empty);
  }

  function handleApply() {
    onChange(local);
  }

  // Small helper to render checkbox lists with a search box
  function CheckboxList({ label, items, field }) {
    const [q, setQ] = useState('');
    const filtered = items.filter(i => i.toLowerCase().includes(q.toLowerCase()));
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">{label}</label>
          <input
            className="text-sm px-2 py-1 border rounded w-36"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search"
            aria-label={`Search ${label}`}
          />
        </div>
        <div className="mt-2 max-h-40 overflow-auto border rounded p-2 bg-white">
          {filtered.length === 0 && <div className="text-sm text-gray-500">no options</div>}
          {filtered.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-sm py-1">
              <input
                type="checkbox"
                checked={local[field].includes(opt)}
                onChange={() => toggleArrayField(field, opt)}
                className="h-4 w-4"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full md:w-80 border rounded-lg p-4 bg-gray-50 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Filters</h3>
        <div className="text-sm text-gray-600">{Object.values(local).some(v => Array.isArray(v) ? v.length > 0 : v?.some?.(x => x)) ? 'Active' : 'All'}</div>
      </div>

      <CheckboxList label="Region" items={options.customerRegion} field="customerRegion" />

      <CheckboxList label="Gender" items={options.gender} field="gender" />

      <div className="mb-4">
        <label className="font-medium">Age range</label>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="number"
            placeholder={minAge ?? 'min'}
            value={local.ageRange[0] ?? ''}
            onChange={(e) => clampMin(e.target.value)}
            className="w-20 px-2 py-1 border rounded"
            aria-label="Minimum age"
          />
          <span className="text-gray-600">—</span>
          <input
            type="number"
            placeholder={maxAge ?? 'max'}
            value={local.ageRange[1] ?? ''}
            onChange={(e) => clampMax(e.target.value)}
            className="w-20 px-2 py-1 border rounded"
            aria-label="Maximum age"
          />
          <div className="text-xs text-gray-500 ml-2">{minAge !== null && maxAge !== null ? `data range: ${minAge}–${maxAge}` : ''}</div>
        </div>
      </div>

      <CheckboxList label="Product category" items={options.productCategory} field="productCategory" />

      <div className="mb-4">
        <label className="font-medium">Tags</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {options.tags.length === 0 && <div className="text-sm text-gray-500">no tags</div>}
          {options.tags.map(tag => {
            const active = local.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleArrayField('tags', tag)}
                className={`text-sm px-2 py-1 rounded-full border ${active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <CheckboxList label="Payment method" items={options.paymentMethod} field="paymentMethod" />

      <div className="mb-4">
        <label className="font-medium">Date range</label>
        <div className="mt-2 flex gap-2 items-center">
          <input type="date" value={local.dateRange[0] ?? ''} onChange={(e) => update('dateRange', [e.target.value || null, local.dateRange[1]])} className="px-2 py-1 border rounded" />
          <span className="text-gray-600">—</span>
          <input type="date" value={local.dateRange[1] ?? ''} onChange={(e) => update('dateRange', [local.dateRange[0], e.target.value || null])} className="px-2 py-1 border rounded" />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={handleApply} className="flex-1 px-3 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700">Apply</button>
        <button onClick={handleReset} className="px-3 py-2 rounded border bg-white">Reset</button>
      </div>

      <div className="text-xs text-gray-500 mt-3">
        Tip: click tags to toggle quickly. Use <code className="bg-gray-100 px-1 rounded">Apply</code> to submit filters.
      </div>
    </aside>
  );
}
