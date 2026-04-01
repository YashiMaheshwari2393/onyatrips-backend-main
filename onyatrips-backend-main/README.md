# Onyatrips Backend

Express.js REST API for Onyatrips.

## Setup

1. Clone the repo
2. npm install
3. Copy .env.example to .env
4. Get actual values from founder via private DM
5. npm run dev
6. Test: open http://localhost:3001/health

## Structure

src/
  config/     Database connection
  middleware/ Auth and error handling
  routes/     API endpoints (one file per feature)
  services/   Email, payment helpers

database/
  schema.sql  All table definitions
  seed.sql    Test data

postman/
  Onyatrips-API.json  Import this into Postman to test all endpoints

## How to add a new route

1. Create src/routes/yourroute.ts
2. Import and register in src/index.ts:
   import yourRoutes from './routes/yourroute'
   app.use('/api/your-path', yourRoutes)
3. Test in Postman
4. Add Postman tests to postman/ folder
5. Submit PR with screenshots
