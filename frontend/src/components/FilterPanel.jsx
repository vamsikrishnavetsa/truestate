// frontend/src/components/FilterPanel.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function FilterPanel({ filters = {}, onChange = () => {} }) {
  const [options, setOptions] = useState({
    customerRegion: [], gender: [], productCategory: [], tags: [], paymentMethod: [], ageRange: { min: null, max: null }
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

  function update(field, value) {
    const next = { ...local, [field]: value };
    setLocal(next);
    onChange(next);
  }

  function handleMultiChange(e, field) {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    update(field, selected);
  }

  // age clamp helpers
  const minAge = options.ageRange?.min ?? null;
  const maxAge = options.ageRange?.max ?? null;

  function handleAgeMinChange(v) {
    const minVal = v === '' ? null : Number(v);
    const maxVal = local.ageRange[1];
    // clamp to dataset range if available
    const clampedMin = minVal === null ? null : (minAge !== null ? Math.max(minAge, minVal) : minVal);
    update('ageRange', [clampedMin, maxVal]);
  }
  function handleAgeMaxChange(v) {
    const maxVal = v === '' ? null : Number(v);
    const minVal = local.ageRange[0];
    const clampedMax = maxVal === null ? null : (maxAge !== null ? Math.min(maxAge, maxVal) : maxVal);
    update('ageRange', [minVal, clampedMax]);
  }

  return (
    <div style={{ width: 340, border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3 style={{ marginTop: 0 }}>Filters</h3>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display:'block' }}>Region</label>
        <select multiple value={local.customerRegion} onChange={(e) => handleMultiChange(e, 'customerRegion')} style={{ width: '100%', height: 90 }}>
          {options.customerRegion.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display:'block' }}>Gender</label>
        <select multiple value={local.gender} onChange={(e) => handleMultiChange(e, 'gender')} style={{ width: '100%', height: 70 }}>
          {options.gender.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display:'block' }}>Age range</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder={minAge ?? 'min'} type="number" value={local.ageRange[0] ?? ''} onChange={(e) => handleAgeMinChange(e.target.value)} />
          <span>—</span>
          <input placeholder={maxAge ?? 'max'} type="number" value={local.ageRange[1] ?? ''} onChange={(e) => handleAgeMaxChange(e.target.value)} />
          <div style={{ color:'#666', fontSize:12, marginLeft: 8 }}>{minAge !== null && maxAge !== null ? `data range: ${minAge}-${maxAge}` : ''}</div>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display:'block' }}>Product Category</label>
        <select multiple value={local.productCategory} onChange={(e) => handleMultiChange(e, 'productCategory')} style={{ width: '100%', height: 90 }}>
          {options.productCategory.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display:'block' }}>Tags</label>
        <select multiple value={local.tags} onChange={(e) => handleMultiChange(e, 'tags')} style={{ width: '100%', height: 90 }}>
          {options.tags.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display:'block' }}>Payment Method</label>
        <select multiple value={local.paymentMethod} onChange={(e) => handleMultiChange(e, 'paymentMethod')} style={{ width: '100%', height: 70 }}>
          {options.paymentMethod.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Date From</label>
        <input type="date" value={local.dateRange[0] ?? ''} onChange={(e) => update('dateRange', [e.target.value || null, local.dateRange[1]])} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Date To</label>
        <input type="date" value={local.dateRange[1] ?? ''} onChange={(e) => update('dateRange', [local.dateRange[0], e.target.value || null])} />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => { setLocal({ customerRegion: [], gender: [], ageRange: [null, null], productCategory: [], tags: [], paymentMethod: [], dateRange: [null, null] }); onChange({}); }}>Reset</button>
      </div>
    </div>
  );
}
