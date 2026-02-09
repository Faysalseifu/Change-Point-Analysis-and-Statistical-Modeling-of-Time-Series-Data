# Change-Point-Analysis-and-Statistical-Modeling-of-Time-Series-Data
Detecting changes and associating causes on time series data

## Task 3 - Interactive Dashboard

This task delivers a minimal but functional dashboard using Flask (backend API)
and React + Recharts (frontend) to explore Brent prices, change points, and
event highlights.

### Backend API (Flask)

Run from the repository root:

```bash
pip install -r backend/requirements.txt
python backend/app.py
```

The API is available at `http://localhost:5000/api` with endpoints:

- `GET /api/prices?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET /api/events`
- `GET /api/change_points`
- `GET /api/stats`

### Frontend (React)

Run from the repository root:

```bash
cd frontend
npm install
npm start
```

Set the API URL if the backend is on a different host:

```bash
set REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Features

- Time series chart with event markers and change point window
- Date range filters and event category filter
- Key indicators and change-point summary cards
- Click an event to zoom the date range
