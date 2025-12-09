Overview
A MERN-stack Retail Sales Dashboard supporting full-text search, multi-select filters, sorting and pagination.

Tech Stack
- Node.js, Express, MongoDB Atlas, Mongoose
- React (Vite), Axios

Search Implementation Summary
- Text index on `customerName` and `phoneNumber` using MongoDB `$text`. Backend supports optional regex fallback.

Filter Implementation Summary
- Multiple filters are accepted via a structured `filters` JSON param. Backend merges filters into a single query `$match`.

Sorting Implementation Summary
- Sorting supports date, quantity, and customerName fields. Sorting preserves active search/filters.

Pagination Implementation Summary
- Page size default 10, Next/Previous UI, backend returns total count and page.

Setup Instructions
- See backend/README.md and frontend/README.md
