import os
import uuid
import time
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import LabelEncoder

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse

router = APIRouter()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

FILE_TTL_SECONDS = 600  

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


def delete_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def cleanup_old_files(directory: str, ttl_seconds: int):
    now = time.time()
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            file_age = now - os.path.getmtime(file_path)
            if file_age > ttl_seconds:
                try:
                    os.remove(file_path)
                except Exception:
                    pass


@router.post("/preprocess")
async def preprocess_dataset(file: UploadFile = File(...)):
    cleanup_old_files(UPLOAD_DIR, FILE_TTL_SECONDS)
    cleanup_old_files(OUTPUT_DIR, FILE_TTL_SECONDS)

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    file_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}.csv")

    with open(input_path, "wb") as f:
        f.write(await file.read())

    try:
        df = pd.read_csv(input_path)
    except Exception:
        os.remove(input_path)
        raise HTTPException(status_code=400, detail="Invalid CSV file")

    if df.empty:
        os.remove(input_path)
        raise HTTPException(status_code=400, detail="CSV file is empty")

    summary = {}

    target_is_object = df.iloc[:, -1].dtype == "object"
    if target_is_object:
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]
        numerical_cols = X.select_dtypes(include=[np.number]).columns
        categorical_cols = X.select_dtypes(exclude=[np.number]).columns

        if y.isnull().sum() > 0:
            y_mode = y.mode()
            y_fill = y_mode.iloc[0] if not y_mode.empty else "missing"
            df.iloc[:, -1].fillna(y_fill, inplace=True)
            summary[y.name] = "Filled missing target values using mode"
            y = df.iloc[:, -1]  
    else:
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        categorical_cols = df.select_dtypes(exclude=[np.number]).columns
        y = None

    for col in numerical_cols:
        if df[col].isnull().sum() > 0:
            skewness = df[col].skew()
            if abs(skewness) > 1:
                fill_value = df[col].median()
                strategy = "median"
            else:
                fill_value = df[col].mean()
                strategy = "mean"

            if pd.isna(fill_value):
                fill_value = 0
                strategy = "constant 0"

            df[col].fillna(fill_value, inplace=True)
            summary[col] = f"Filled missing values using {strategy}"

    cols_to_encode = []
    cols_to_drop = []

    for col in categorical_cols:
        if df[col].isnull().sum() > 0:
            df[col].fillna(df[col].mode()[0], inplace=True)

        if df[col].nunique() <= 10:
            cols_to_encode.append(col)
            summary[col] = "One-hot encoded"
        else:
            cols_to_drop.append(col)
            summary[col] = "Dropped (high cardinality)"

    if cols_to_encode:
        try:
            encoder = OneHotEncoder(drop="first", handle_unknown="ignore", sparse_output=False)
        except TypeError:
            encoder = OneHotEncoder(drop="first", handle_unknown="ignore", sparse=False)
        encoded_data = encoder.fit_transform(df[cols_to_encode])
        encoded_df = pd.DataFrame(
            encoded_data,
            columns=encoder.get_feature_names_out(cols_to_encode),
            index=df.index
        )
        df = pd.concat([df.drop(columns=cols_to_encode), encoded_df], axis=1)

    if cols_to_drop:
        df.drop(columns=cols_to_drop, inplace=True)

    if target_is_object:
        le = LabelEncoder()
        df.iloc[:, -1] = le.fit_transform(df.iloc[:, -1])
        summary[df.columns[-1]] = "Label encoded target variable"

    output_filename = f"cleaned.csv"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    df.to_csv(output_path, index=False)

    os.remove(input_path)

    preview = df.head(10).to_dict(orient="records")

    return {
        "summary": summary,
        "preview": preview,
        "download_url": f"/download/{output_filename}"
    }


@router.get("/download/{filename}")
def download_file(filename: str, background_tasks: BackgroundTasks):
    file_path = os.path.join(OUTPUT_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    background_tasks.add_task(delete_file, file_path)

    return FileResponse(
        path=file_path,
        media_type="text/csv",
        filename=filename
    )