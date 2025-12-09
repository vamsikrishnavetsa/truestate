// backend/src/controllers/saleController.js
const saleService = require('../services/saleService');

function safeParseFilters(str) {
  if (!str) return {};
  try {
    // if filters come as already parsed object (when called internally), return it
    if (typeof str === 'object') return str;
    return JSON.parse(str);
  } catch (e) {
    // sometimes front-end sends unencoded object; try decodeURIComponent then parse
    try {
      return JSON.parse(decodeURIComponent(str));
    } catch (err) {
      console.warn('Could not parse filters:', str);
      return {};
    }
  }
}

async function getSales(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const sortBy = req.query.sortBy || 'Date';
    const sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder, 10) : -1;
    const search = req.query.search || '';
    const filters = safeParseFilters(req.query.filters);

    // Call service (it will map friendly keys -> DB)
    const data = await saleService.querySales({ page, pageSize, sortBy, sortOrder, search, filters });
    res.json(data);
  } catch (err) {
    console.error('getSales error', err);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
}

async function getFilters(req, res) {
  try {
    const options = await saleService.getFilterOptions();
    res.json(options);
  } catch (err) {
    console.error('getFilters error', err);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
}

module.exports = { getSales, getFilters };
