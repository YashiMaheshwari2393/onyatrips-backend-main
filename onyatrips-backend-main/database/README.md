# Database

## Setup
1. Get DATABASE_URL from founder via private DM
2. Copy .env.example to .env and fill in DATABASE_URL
3. Run schema: copy schema.sql content into Railway Query tab and run
4. Run seed data: copy seed.sql content into Railway Query tab and run

## Tables
See schema.sql for all table definitions.
All new tables must be added to schema.sql.

## Migrations
When adding a new column or table after initial setup,
create a file in this folder named:
migrations/001_add_bookings_table.sql
migrations/002_add_rating_to_places.sql
etc.