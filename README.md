# cleanCSV

cleanCSV is a small web app that cleans CSV datasets for machine learning. It fills missing values and encodes categorical columns, then gives you a preview, a summary of changes, and a cleaned CSV to download.

## Tech stack

- Backend: FastAPI (Python)
- Frontend: React (Vite/CRA)
- Data: pandas, scikit-learn

## How it works

1. Upload a CSV file.
2. The backend preprocesses the data (impute missing values, encode categories).
3. You get a summary, a quick preview, and a download link for the cleaned CSV.

## Run locally

Prerequisites: Python 3.10+ and Node.js 18+

Backend

- cd backend
- uv venv .venv && activate it
- uv pip install -r requirements.txt
- uvicorn app.main:app --reload

Frontend

- cd frontend
- npm install
- npm run dev
