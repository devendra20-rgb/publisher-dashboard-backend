# Publisher Dashboard — Backend

Internal admin backend to monitor publisher onboarding data from multiple Google Sheets.

---

## Tech Stack

| Layer         | Technology                         |
|---------------|------------------------------------|
| Runtime       | Node.js                            |
| Framework     | Express.js                         |
| Database      | MongoDB + Mongoose                 |
| Sheet Data    | Google Sheets API (Service Account)|
| Scheduler     | node-cron                          |

---

## Project Structure

```
src/
├── app.js                        # Express entry point
├── config/
│   ├── db.js                     # MongoDB connection
│   └── googleSheets.js           # Google Sheets API client
├── models/
│   ├── SheetConfig.model.js      # Sheet configuration schema
│   └── PublisherData.model.js    # Publisher data schema
├── controllers/
│   ├── sheetConfig.controller.js
│   ├── publisher.controller.js
│   ├── stats.controller.js
│   └── sync.controller.js
├── routes/
│   ├── sheetConfig.routes.js
│   ├── publisher.routes.js
│   ├── stats.routes.js
│   └── sync.routes.js
├── services/
│   ├── sheetConfig.service.js    # CRUD for sheet configs
│   ├── googleSheets.service.js   # Fetch + normalize sheet rows
│   ├── sync.service.js           # Upsert logic
│   ├── publisher.service.js      # Query helpers
│   └── stats.service.js         # Aggregation queries
├── cron/
│   └── syncCron.js               # Scheduled sync (every 15 min)
└── utils/
    ├── apiResponse.js            # sendSuccess / sendError helpers
    ├── errorHandler.js           # Global error middleware
    └── pagination.js             # Reusable pagination helper
```

---

## Quick Start

### 1. Clone & install

```bash
git clone <repo>
cd publisher-dashboard
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/publisher_dashboard
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json
CRON_SCHEDULE=*/15 * * * *
```

### 3. Set up Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **Google Sheets API**
3. Create a **Service Account** → Download the JSON key
4. Save the JSON file as `google-service-account.json` in the project root
5. **Share each Google Sheet** with the service account email
   (e.g. `my-service@project.iam.gserviceaccount.com`) — give it **Viewer** access

### 4. Run

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## API Reference

### Sheet Configs  `/api/sheets`

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| GET    | `/api/sheets`          | Get all sheet configs        |
| GET    | `/api/sheets/:id`      | Get one sheet config         |
| POST   | `/api/sheets`          | Add a new sheet config       |
| PUT    | `/api/sheets/:id`      | Update a sheet config        |
| PATCH  | `/api/sheets/:id/toggle` | Toggle active/inactive     |
| DELETE | `/api/sheets/:id`      | Delete a sheet config        |

**POST /api/sheets — Request body:**
```json
{
  "sheetName": "Sagar's Sheet",
  "sheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
  "usedBy": "Sagar",
  "range": "Sheet1!A:G",
  "active": true
}
```

---

### Publishers  `/api/publishers`

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/api/publishers`   | Get all publishers (with filters)  |

**Query params (all optional):**

| Param           | Example              | Description                    |
|-----------------|----------------------|--------------------------------|
| `usedBy`        | `usedBy=Sagar`       | Filter by delivery person      |
| `market`        | `market=India`       | Partial match, case-insensitive|
| `status`        | `status=Active`      | Partial match, case-insensitive|
| `sheetId`       | `sheetId=1Bxi...`    | Exact sheet ID                 |
| `publisherName` | `publisherName=Times`| Partial match, case-insensitive|
| `page`          | `page=2`             | Page number (default 1)        |
| `limit`         | `limit=20`           | Items per page (default 20)    |

---

### Statistics  `/api/stats`

| Method | Endpoint               | Description                            |
|--------|------------------------|----------------------------------------|
| GET    | `/api/stats/overview`  | Total publishers + active sheets       |
| GET    | `/api/stats/monthly`   | Monthly onboarding count (`?year=2025`)|
| GET    | `/api/stats/by-person` | Count grouped by delivery person       |
| GET    | `/api/stats/by-sheet`  | Count grouped by sheet                 |
| GET    | `/api/stats/by-status` | Count grouped by status                |

---

### Manual Sync  `/api/sync`

| Method | Endpoint    | Description                          |
|--------|-------------|--------------------------------------|
| POST   | `/api/sync` | Trigger immediate sync of all sheets |

**Response:**
```json
{
  "success": true,
  "message": "Sync completed",
  "data": {
    "synced": 47,
    "errors": 0,
    "total": 3
  }
}
```

---

## Duplicate Prevention

Each publisher row is uniquely identified by the combination of:
- `publisherName`
- `sheetId`

On every sync, the backend runs a **MongoDB `bulkWrite` with `upsert: true`**.  
If a row already exists it gets updated; if not it gets created. No duplicates, ever.

---

## Cron Schedule

Default: every 15 minutes.  
Change `CRON_SCHEDULE` in `.env` to any valid cron expression:

```
*/15 * * * *   → every 15 minutes
0 * * * *      → every hour
0 9 * * *      → every day at 9am
```
