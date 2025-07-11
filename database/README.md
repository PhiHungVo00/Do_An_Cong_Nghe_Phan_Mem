
# Database Documentation

This folder contains the SQL schema and sample data for the Sales Management System. The backend uses **MongoDB** via **Mongoose**, but the SQL scripts here provide a relational equivalent for reference and testing.

## Files

- `schema.sql` – PostgreSQL script to create all tables, views, procedures, triggers and indexes.
- `sample_data.sql` – Minimal seed data for quick demos.
- `docs/ERD.png` – Entity relationship diagram generated from the schema.

## Connection

The Node.js server expects a MongoDB connection string via the `MONGODB_URI` environment variable. Example `.env` for development:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sales_management
JWT_SECRET=your-secret
```

## Seed MongoDB

To populate the MongoDB database with sample products, users and events run:

```bash
cd server
npm run seed-data
```

## Backup & Restore

Use `mongodump` and `mongorestore` for MongoDB backups:

```bash
# Backup
mongodump --uri "$MONGODB_URI" --out backups/

# Restore
mongorestore --uri "$MONGODB_URI" backups/
```

## Security Notes

- Passwords are hashed using `bcryptjs` before storing.
- JWT tokens are signed with `JWT_SECRET` and should be kept private.
- Limit database access to trusted hosts and use strong credentials.

## New Features

- **Addresses table**: stores provinces, districts and wards for the address selection feature.
- **Order shipping info**: orders now track `shipper`, `delivery_status` and `delivered_at`.

Seed data for these additions can be found in `sample_data.sql`.
