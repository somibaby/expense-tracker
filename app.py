"""
Expense Tracker
-----------------------
Anyone with access to this app can ADD an expense (stored in a SQLite database),
EDIT or DELETE existing entries, and everyone can VIEW the spending data and
see ANALYSIS/charts of it. Data can also be exported to Excel for easy reference.

Run it with:
    streamlit run app.py
"""

import io
import sqlite3
from datetime import date

import pandas as pd
import streamlit as st

DB_PATH = "data.db"

CATEGORIES = ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Shopping", "Other"]


# ---------- Database helpers ----------

def get_connection():
    return sqlite3.connect(DB_PATH, check_same_thread=False)


def init_db():
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            entry_date TEXT NOT NULL,
            notes TEXT
        )
        """
    )
    conn.commit()
    conn.close()


def add_entry(name, category, amount, entry_date, notes):
    conn = get_connection()
    conn.execute(
        "INSERT INTO entries (name, category, amount, entry_date, notes) VALUES (?, ?, ?, ?, ?)",
        (name, category, amount, entry_date.isoformat(), notes),
    )
    conn.commit()
    conn.close()


def load_data():
    conn = get_connection()
    df = pd.read_sql_query("SELECT * FROM entries ORDER BY entry_date DESC", conn)
    conn.close()
    return df


def update_entry(entry_id, name, category, amount, entry_date, notes):
    conn = get_connection()
    conn.execute(
        "UPDATE entries SET name=?, category=?, amount=?, entry_date=?, notes=? WHERE id=?",
        (name, category, amount, entry_date.isoformat(), notes, entry_id),
    )
    conn.commit()
    conn.close()


def delete_entry(entry_id):
    conn = get_connection()
    conn.execute("DELETE FROM entries WHERE id=?", (entry_id,))
    conn.commit()
    conn.close()


def to_excel_bytes(df):
    buffer = io.BytesIO()
    with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Expenses")
    return buffer.getvalue()


# ---------- App ----------

st.set_page_config(page_title="Expense Tracker", layout="wide")
init_db()

st.title("Expense Tracker")
st.caption("Log spending and view analysis, all in one small app.")

tab_add, tab_manage, tab_analyze = st.tabs(["Add Expense", "Manage Data", "Dashboard"])

# --- Add Expense tab ---
with tab_add:
    st.subheader("Add a new expense")
    with st.form("add_entry_form", clear_on_submit=True):
        col1, col2 = st.columns(2)
        with col1:
            name = st.text_input("Who paid")
            category = st.selectbox("Category", CATEGORIES)
        with col2:
            amount = st.number_input("Amount ($)", min_value=0.0, step=1.0)
            entry_date = st.date_input("Date", value=date.today())
        notes = st.text_area("Description (optional)", placeholder="e.g. Groceries at Walmart")

        submitted = st.form_submit_button("Save expense")
        if submitted:
            if not name:
                st.error("Please enter who paid.")
            else:
                add_entry(name, category, amount, entry_date, notes)
                st.success("Saved!")

# --- Manage Data tab ---
with tab_manage:
    st.subheader("Edit or delete an expense")
    df = load_data()

    if df.empty:
        st.info("No expenses yet. Add some in the 'Add Expense' tab.")
    else:
        options = {
            row.id: f"#{row.id} — {row.entry_date} — {row.name} — {row.category} — ${row.amount:,.2f}"
            for row in df.itertuples()
        }
        selected_id = st.selectbox(
            "Choose an entry", options.keys(), format_func=lambda i: options[i]
        )
        row = df[df["id"] == selected_id].iloc[0]

        with st.form("edit_entry_form"):
            col1, col2 = st.columns(2)
            with col1:
                name = st.text_input("Who paid", value=row["name"])
                category = st.selectbox(
                    "Category", CATEGORIES, index=CATEGORIES.index(row["category"])
                    if row["category"] in CATEGORIES else len(CATEGORIES) - 1,
                )
            with col2:
                amount = st.number_input("Amount ($)", min_value=0.0, step=1.0, value=float(row["amount"]))
                entry_date = st.date_input("Date", value=date.fromisoformat(row["entry_date"]))
            notes = st.text_area("Description (optional)", value=row["notes"] or "")

            col_update, col_delete = st.columns(2)
            update_clicked = col_update.form_submit_button("Update entry")
            delete_clicked = col_delete.form_submit_button("Delete entry")

            if update_clicked:
                update_entry(selected_id, name, category, amount, entry_date, notes)
                st.success("Updated!")
                st.rerun()
            if delete_clicked:
                delete_entry(selected_id)
                st.success("Deleted!")
                st.rerun()

# --- Dashboard tab ---
with tab_analyze:
    st.subheader("All expenses")
    df = load_data()

    if df.empty:
        st.info("No expenses yet. Add some in the 'Add Expense' tab.")
    else:
        st.dataframe(df, use_container_width=True)

        st.download_button(
            label="Download as Excel",
            data=to_excel_bytes(df),
            file_name="expenses.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

        st.subheader("Analysis")
        col1, col2, col3 = st.columns(3)
        col1.metric("Total spent", f"${df['amount'].sum():,.2f}")
        col2.metric("Number of transactions", len(df))
        col3.metric("Average expense", f"${df['amount'].mean():,.2f}")

        st.markdown("**Total spending by category**")
        by_category = df.groupby("category")["amount"].sum().sort_values(ascending=False)
        st.bar_chart(by_category)

        st.markdown("**Spending over time**")
        by_date = df.groupby("entry_date")["amount"].sum().sort_index()
        st.line_chart(by_date)

        st.markdown("**Spending per person**")
        by_person = df.groupby("name")["amount"].sum().sort_values(ascending=False)
        st.bar_chart(by_person)
