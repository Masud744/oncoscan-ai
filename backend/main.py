import os
import numpy as np
import tensorflow as tf
import cv2
import shutil
import uuid
import sqlite3
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

app = FastAPI()

# Base directory setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

DATABASE = os.path.join(ROOT_DIR, "database.db")
STATIC_DIR = os.path.join(ROOT_DIR, "static")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
MODEL_PATH = os.path.join(ROOT_DIR, "models", "model_fixed.h5")

# Create folders
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "images"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "reports"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "heatmaps"), exist_ok=True)

# Load model once
model = None

def get_model():
    global model
    if model is None:
        print("Loading AI model...")
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print("Model loaded successfully!")
    return model

def get_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    return conn, cursor

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend")

# LOGIN PAGE
@app.get("/login")
def login_page():
    return FileResponse(os.path.join(FRONTEND_DIR, "user/login.html"))

# LOGIN API
@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    conn, cursor = get_db()
    cursor.execute("SELECT id, role FROM users WHERE username=? AND password=?", (username, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        return {"status": "success", "user_id": user[0], "role": user[1]}
    else:
        return {"status": "invalid"}

# REGISTER
@app.post("/register")
def register(username: str = Form(...), password: str = Form(...)):
    conn, cursor = get_db()
    try:
        cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')", (username, password))
        conn.commit()
        conn.close()
        return {"status": "registered"}
    except:
        conn.close()
        return {"status": "user_exists"}

# USER PAGES
@app.get("/")
def user_home():
    return FileResponse(os.path.join(FRONTEND_DIR, "user/index.html"))

@app.get("/result-page")
def result_page():
    return FileResponse(os.path.join(FRONTEND_DIR, "user/result.html"))

@app.get("/history-page")
def history_page():
    return FileResponse(os.path.join(FRONTEND_DIR, "user/history.html"))

# ADMIN PAGES
@app.get("/admin")
def admin_dashboard():
    return FileResponse(os.path.join(FRONTEND_DIR, "admin/dashboard.html"))

@app.get("/admin/stats")
def admin_stats_page():
    return FileResponse(os.path.join(FRONTEND_DIR, "admin/stats.html"))

# PDF GENERATE
def generate_pdf(patient_name, patient_id, prediction, confidence, image_path):
    pdf_filename = f"report_{patient_id}_{uuid.uuid4().hex[:6]}.pdf"
    pdf_path = os.path.join(STATIC_DIR, "reports", pdf_filename)

    c = canvas.Canvas(pdf_path, pagesize=letter)
    c.setTitle("OncoScan AI Medical Report")

    c.setFont("Helvetica-Bold", 18)
    c.drawString(150, 750, "OncoScan AI - Medical Report")

    c.setFont("Helvetica", 12)
    c.drawString(50, 700, f"Patient Name : {patient_name}")
    c.drawString(50, 680, f"Patient ID   : {patient_id}")
    c.drawString(50, 660, f"Prediction   : {prediction}")
    c.drawString(50, 640, f"Confidence   : {round(confidence*100,2)}%")

    now = datetime.now()
    c.drawString(50, 620, f"Date : {now.strftime('%Y-%m-%d %H:%M:%S')}")

    c.drawImage(image_path, 150, 350, width=300, height=250)

    c.save()
    return f"/static/reports/{pdf_filename}"

# PREDICT
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    patient_name: str = Form(...),
    patient_id: str = Form(...),
    user_id: int = Form(...)
):
    conn, cursor = get_db()
    try:
        file_id = str(uuid.uuid4())
        file_location = os.path.join(STATIC_DIR, "images", f"{file_id}.jpg")

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        img = cv2.imread(file_location)
        if img is None:
            raise Exception("Image loading failed")

        img = cv2.resize(img, (224, 224))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)

        model = get_model()
        prediction_prob = float(model.predict(img)[0][0])
        label = "Tumor" if prediction_prob > 0.5 else "No Tumor"

        cursor.execute("""
        INSERT INTO predictions
        (user_id, patient_name, patient_id, image_path, prediction, confidence)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, patient_name, patient_id, f"static/images/{file_id}.jpg", label, prediction_prob))

        conn.commit()
        conn.close()

        pdf_url = generate_pdf(patient_name, patient_id, label, prediction_prob, file_location)

        return {
            "prediction": label,
            "confidence_percent": round(prediction_prob * 100, 2),
            "heatmap_url": f"/static/images/{file_id}.jpg",
            "report_url": pdf_url
        }

    except Exception as e:
        conn.close()
        return JSONResponse({"error": str(e)}, status_code=500)

# USER HISTORY
@app.get("/history/{user_id}")
def history(user_id: int):
    conn, cursor = get_db()
    cursor.execute("SELECT * FROM predictions WHERE user_id=? ORDER BY date DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()

    data = []
    for row in rows:
        data.append({
            "user_id": row[1],
            "patient_name": row[2],
            "patient_id": row[3],
            "image_path": "/" + row[4],
            "prediction": row[5],
            "confidence_percent": round(row[6] * 100, 2),
            "date": row[7]
        })

    return data

# ADMIN ALL HISTORY
@app.get("/admin/all-history")
def admin_all_history():
    conn, cursor = get_db()
    cursor.execute("SELECT * FROM predictions ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()

    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "user_id": row[1],
            "patient_name": row[2],
            "patient_id": row[3],
            "image_path": "/" + row[4],
            "prediction": row[5],
            "confidence_percent": round(row[6] * 100, 2),
            "date": row[7]
        })

    return data

# DELETE
@app.delete("/delete/{record_id}")
def delete_record(record_id: int):
    conn, cursor = get_db()
    cursor.execute("DELETE FROM predictions WHERE id=?", (record_id,))
    conn.commit()
    conn.close()
    return {"message": "Deleted"}

# STATS
@app.get("/stats")
def stats():
    conn, cursor = get_db()

    cursor.execute("SELECT COUNT(*) FROM predictions")
    total_predictions = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE prediction='Tumor'")
    tumor_cases = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE prediction='No Tumor'")
    no_tumor_cases = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT patient_id) FROM predictions")
    total_patients = cursor.fetchone()[0]

    conn.close()

    return {
        "total_predictions": total_predictions,
        "tumor_cases": tumor_cases,
        "no_tumor_cases": no_tumor_cases,
        "total_patients": total_patients
    }

# STATS DETAILS
@app.get("/stats-details")
def stats_details():
    conn, cursor = get_db()

    cursor.execute("""
        SELECT prediction, COUNT(*) 
        FROM predictions 
        GROUP BY prediction
    """)
    prediction_counts = cursor.fetchall()

    cursor.execute("""
        SELECT DATE(date), COUNT(*) 
        FROM predictions 
        GROUP BY DATE(date)
        ORDER BY DATE(date)
    """)
    daily_predictions = cursor.fetchall()

    conn.close()

    return {
        "prediction_counts": prediction_counts,
        "daily_predictions": daily_predictions
    }
