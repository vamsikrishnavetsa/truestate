# Architecture

## Backend architecture
- Node.js + Express API
- Mongoose ORM for MongoDB Atlas
- Controllers -> Services -> Models separation
- CSV upload util for small test files; production import with mongoimport

## Frontend architecture
- Vite + React
- Components: SearchBar, FilterPanel, TransactionsTable, Pagination
- services/api.js centralizes API calls
- state: useState + useEffect + custom useDebounce hook

## Data flow
- Frontend sends query params (page, pageSize, sortBy, sortOrder, search, filters) to backend
- Backend builds MongoDB query from search & filters, returns paginated results
- Frontend displays results and retains search/filter/sort state

## Folder structure
(see project root)

## Module responsibilities
- controllers: receive HTTP requests, validate args
- services: business logic and DB queries
- models: Mongoose schema definitions
- utils: db connection, csv upload parsing
