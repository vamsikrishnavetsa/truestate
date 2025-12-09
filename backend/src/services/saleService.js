// backend/src/services/saleService.js
const Sale = require('../models/Sale');

/** KEY MAP: friendly -> CSV DB field names */
const KEY_MAP = {
  customerId: 'Customer ID',
  customerName: 'Customer Name',
  phoneNumber: 'Phone Number',
  gender: 'Gender',
  age: 'Age',
  customerRegion: 'Customer Region',
  customerType: 'Customer Type',
  productId: 'Product ID',
  productName: 'Product Name',
  brand: 'Brand',
  productCategory: 'Product Category',
  tags: 'Tags',
  quantity: 'Quantity',
  pricePerUnit: 'Price per Unit',
  discountPercentage: 'Discount Percentage',
  totalAmount: 'Total Amount',
  finalAmount: 'Final Amount',
  date: 'Date',
  paymentMethod: 'Payment Method',
  orderStatus: 'Order Status',
  deliveryType: 'Delivery Type',
  storeId: 'Store ID',
  storeLocation: 'Store Location',
  salespersonId: 'Salesperson ID',
  employeeName: 'Employee Name'
};

function dbKey(k) {
  return KEY_MAP[k] || k;
}
function escapeRegex(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
function parseDateFlexible(v) {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v) ? null : v;
  const s = String(v).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s); return isNaN(d) ? null : d;
  }
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(s)) {
    const [dd,mm,yyyy] = s.split('-').map(Number);
    const d = new Date(yyyy, mm-1, dd); return isNaN(d) ? null : d;
  }
  const d = new Date(s); return isNaN(d) ? null : d;
}
function parseNumberFlexible(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return v;
  const n = Number(String(v).trim());
  return Number.isNaN(n) ? null : n;
}

/** buildMatch: robust parsing for filters + search */
function buildMatch({ search, filters } = {}) {
  const match = {};
  if (search && String(search).trim()) {
    const term = String(search).trim();
    const rx = { $regex: escapeRegex(term), $options: 'i' };
    match.$or = [
      { [dbKey('customerName')]: rx },
      { [dbKey('phoneNumber')]: rx },
      { [dbKey('customerId')]: rx },
      { [dbKey('productName')]: rx }
    ];
  }
  if (!filters || Object.keys(filters).length === 0) return match;

  for (const [rawKey, rawVal] of Object.entries(filters)) {
    if (rawVal === null || rawVal === undefined || rawVal === '') continue;
    const key = dbKey(rawKey);

    // Age range
    if (rawKey === 'ageRange' || rawKey === 'age') {
      if (Array.isArray(rawVal) && rawVal.length === 2) {
        const min = parseNumberFlexible(rawVal[0]);
        const max = parseNumberFlexible(rawVal[1]);
        const obj = {};
        if (min !== null) obj.$gte = min;
        if (max !== null) obj.$lte = max;
        if (Object.keys(obj).length) match[key] = obj;
      }
      continue;
    }

    // Date range
    if (rawKey === 'dateRange' || rawKey === 'date') {
      if (Array.isArray(rawVal) && rawVal.length === 2) {
        const from = parseDateFlexible(rawVal[0]);
        const to = parseDateFlexible(rawVal[1]);
        const obj = {};
        if (from) obj.$gte = from;
        if (to) {
          const td = new Date(to);
          td.setDate(td.getDate() + 1);
          obj.$lt = td;
        }
        if (Object.keys(obj).length) match[key] = obj;
      }
      continue;
    }

    // Tags stored as CSV string
    if (rawKey === 'tags' || key === 'Tags') {
      const arr = Array.isArray(rawVal) ? rawVal : String(rawVal).split(',').map(s => s.trim()).filter(Boolean);
      if (arr.length) {
        match.$and = match.$and || [];
        const ors = arr.map(tag => ({ [key]: { $regex: new RegExp(`\\b${escapeRegex(tag)}\\b`, 'i') } }));
        match.$and.push({ $or: ors });
      }
      continue;
    }

    // Array => $in
    if (Array.isArray(rawVal)) {
      const flat = rawVal.map(v => (typeof v === 'string' ? v.trim() : v)).filter(v => v !== '');
      if (flat.length) match[key] = { $in: flat };
      continue;
    }

    if (typeof rawVal === 'string' && rawVal.includes(',')) {
      const arr = rawVal.split(',').map(s => s.trim()).filter(Boolean);
      if (arr.length) { match[key] = { $in: arr }; continue; }
    }

    // Numeric fields equality
    const numericFields = ['Quantity','Price per Unit','Discount Percentage','Total Amount','Final Amount','Age'];
    if (numericFields.includes(key)) {
      const n = parseNumberFlexible(rawVal);
      if (n !== null) { match[key] = n; }
      continue;
    }

    // Default equality
    match[key] = rawVal;
  }

  return match;
}

/** querySales: returns normalized results for frontend */
async function querySales({ page = 1, pageSize = 10, sortBy = 'Date', sortOrder = -1, search = '', filters = {} } = {}) {
  const match = buildMatch({ search, filters });
  const sortMap = { date: 'Date', Date: 'Date', quantity: 'Quantity', Quantity: 'Quantity', 'Customer Name': 'Customer Name', 'Final Amount': 'Final Amount' };
  const sortField = sortMap[sortBy] || sortBy;
  const sortObj = {}; sortObj[sortField] = sortOrder;
  const skip = (page - 1) * pageSize;

  const pipeline = [
    { $match: match },
    { $sort: sortObj },
    { $skip: skip },
    { $limit: pageSize }
  ];

  const [rawResults, total] = await Promise.all([
    Sale.aggregate(pipeline).allowDiskUse(true).exec(),
    Sale.countDocuments(match)
  ]);

  const normalize = (doc) => ({
    _id: doc._id,
    transactionId: doc['Transaction ID'],
    date: doc['Date'] ? doc['Date'] : doc.Date,
    customerId: doc['Customer ID'],
    customerName: doc['Customer Name'],
    phoneNumber: doc['Phone Number'],
    gender: doc['Gender'],
    age: doc['Age'],
    customerRegion: doc['Customer Region'],
    customerType: doc['Customer Type'],
    productId: doc['Product ID'],
    productName: doc['Product Name'],
    brand: doc['Brand'],
    productCategory: doc['Product Category'],
    tags: doc['Tags'] ? String(doc['Tags']).split(',').map(s => s.trim()).filter(Boolean) : [],
    quantity: doc['Quantity'],
    pricePerUnit: doc['Price per Unit'],
    discountPercentage: doc['Discount Percentage'],
    totalAmount: doc['Total Amount'],
    finalAmount: doc['Final Amount'],
    paymentMethod: doc['Payment Method'],
    orderStatus: doc['Order Status'],
    deliveryType: doc['Delivery Type'],
    storeId: doc['Store ID'],
    storeLocation: doc['Store Location'],
    salespersonId: doc['Salesperson ID'],
    employeeName: doc['Employee Name']
  });

  const results = Array.isArray(rawResults) ? rawResults.map(normalize) : [];
  return { results, total, page, pageSize };
}

/** getFilterOptions: returns arrays for dropdowns + age min/max */
async function getFilterOptions() {
  // distinct simple fields
  const [regions, genders, productCategories, paymentMethods] = await Promise.all([
    Sale.distinct('Customer Region').then(arr => (arr || []).filter(Boolean).sort()),
    Sale.distinct('Gender').then(arr => (arr || []).filter(Boolean).sort()),
    Sale.distinct('Product Category').then(arr => (arr || []).filter(Boolean).sort()),
    Sale.distinct('Payment Method').then(arr => (arr || []).filter(Boolean).sort())
  ]);

  // tags: split CSV string into unique tags
  const tagsAgg = await Sale.aggregate([
    { $project: { tagsStr: { $ifNull: ['$Tags', ''] } } },
    { $project: { tagsArr: { $split: ['$tagsStr', ','] } } },
    { $unwind: { path: '$tagsArr', preserveNullAndEmptyArrays: false } },
    { $project: { tag: { $trim: { input: '$tagsArr' } } } },
    { $match: { tag: { $ne: '' } } },
    { $group: { _id: null, tags: { $addToSet: '$tag' } } },
    { $project: { _id: 0, tags: 1 } }
  ]).allowDiskUse(true).exec();
  const tags = (tagsAgg && tagsAgg[0] && tagsAgg[0].tags) ? tagsAgg[0].tags.sort() : [];

  // age min/max
  const ageAgg = await Sale.aggregate([
    { $match: { Age: { $exists: true, $ne: null } } },
    { $group: { _id: null, minAge: { $min: "$Age" }, maxAge: { $max: "$Age" } } },
    { $project: { _id: 0, minAge: 1, maxAge: 1 } }
  ]).exec();
  const minAge = (ageAgg && ageAgg[0]) ? ageAgg[0].minAge : null;
  const maxAge = (ageAgg && ageAgg[0]) ? ageAgg[0].maxAge : null;

  return {
    customerRegion: regions,
    gender: genders,
    productCategory: productCategories,
    paymentMethod: paymentMethods,
    tags,
    ageRange: { min: minAge, max: maxAge }
  };
}

module.exports = { querySales, getFilterOptions };
