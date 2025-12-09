const express = require('express');
const router = express.Router();
const { getSales, getFilters } = require('../controllers/saleController');
const { csvUploadRouter } = require('../utils/csvUpload');

router.get('/', getSales);
router.get('/filters', getFilters);


// CSV single/upload route (optional) — primarily for small files.
// For large data (6.5M rows) we recommend mongoimport (see docs).
router.use('/upload-csv', csvUploadRouter);

module.exports = router;
