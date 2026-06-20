# Publisher Dashboard Backend

Express and MongoDB API for the Publisher Dashboard.

Active domain models:

- `User`
- `Publisher`
- `Offer`, including embedded Admin-only `paymentDetails`

Primary routes:

- `/auth`
- `/users`
- `/publishers`
- `/offers`
- `/dashboard`
- `/export`

See the authoritative architecture and permission specification in the repository root [README.md](../README.md).

## Development

```bash
npm install
npm run seed-admin
npm run dev
```

Copy `.env.example` to `.env` and configure MongoDB, JWT, frontend origin, and seeded Admin credentials.
