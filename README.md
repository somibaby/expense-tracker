# Data System Demo

A small Python system: people add data through a form, it's stored in a
database, and everyone can see the analysis on a dashboard.

- **Storage**: SQLite (`data.db`, created automatically on first run)
- **App**: Streamlit (`app.py`) — form to add entries + dashboard with charts
- **Analysis**: pandas

## Setup

```
pip install -r requirements.txt
```

## Run

```
streamlit run app.py
```

This opens the app in your browser at `http://localhost:8501`.

## How it works

- **Add Entry tab**: anyone using the app fills in Name, Category, Value,
  Date, Notes — saved into `data.db`.
- **Dashboard tab**: shows the full table, summary stats, and charts
  (average value by category, value over time, entries per person).

The fields (Name/Category/Value/Date/Notes) are generic on purpose —
swap them for your real data (sensor readings, expenses, survey scores,
etc.) once you know what you're tracking.

## Letting others use it

Right now this runs only on your machine. To let other people add data
and view the dashboard too, you have two easy options later:

1. **Streamlit Community Cloud** (free) — push this folder to a GitHub
   repo and deploy it at share.streamlit.io. Everyone gets a shared link.
2. **Swap SQLite for a hosted database** (e.g. Postgres on Supabase/Railway)
   if you expect many people writing data at the same time — SQLite is
   fine for one or a few people, but a real database handles concurrent
   writes better.
