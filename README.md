# OncoScan AI – Brain Tumor Detection Web Application

## Project Description

OncoScan AI is an AI-powered web application designed to detect brain tumors from MRI images using a trained deep learning model. The system allows users to upload MRI images, receive tumor predictions, download PDF medical reports, and view their prediction history. An admin panel is also included for monitoring system statistics and managing prediction records.

This project integrates Artificial Intelligence, Web Development, Database Management, and Authentication into a complete full-stack AI application.

---

## System Features

### User Features

- User Registration
- User Login
- Upload MRI Image
- Brain Tumor Prediction
- Confidence Percentage Display
- Download PDF Medical Report
- User Prediction History
- Image Preview
- Drag and Drop Image Upload

### Admin Features

- Admin Dashboard
- Total Predictions Statistics
- Tumor Case Count
- No Tumor Case Count
- Total Patient Count
- View All Predictions
- Delete Prediction Records
- System Statistics

### AI Features

- Brain MRI Image Classification
- Tumor / No Tumor Prediction
- Confidence Score Calculation
- Image Preprocessing using OpenCV
- Deep Learning Model Integration

---

## Technology Stack

| Technology         | Purpose               |
| ------------------ | --------------------- |
| Python             | Backend Development   |
| FastAPI            | Web Framework         |
| TensorFlow / Keras | AI Model              |
| OpenCV             | Image Processing      |
| SQLite             | Database              |
| HTML               | Frontend Structure    |
| CSS                | Frontend Styling      |
| JavaScript         | Frontend Logic        |
| ReportLab          | PDF Report Generation |
| Uvicorn            | ASGI Server           |

---

## System Architecture

```
Client (Browser)
        |
        v
Frontend (HTML, CSS, JavaScript)
        |
        v
FastAPI Backend
        |
        |---- Authentication (Login / Register)
        |---- Prediction API
        |---- History API
        |---- Admin API
        |---- PDF Report Generator
        |
        v
Database (SQLite)
        |
        v
AI Model (TensorFlow)
```

---

## Database Structure

### Users Table

| Field      | Type      |
| ---------- | --------- |
| id         | INTEGER   |
| username   | TEXT      |
| password   | TEXT      |
| role       | TEXT      |
| created_at | TIMESTAMP |

### Predictions Table

| Field        | Type      |
| ------------ | --------- |
| id           | INTEGER   |
| user_id      | INTEGER   |
| patient_name | TEXT      |
| patient_id   | TEXT      |
| image_path   | TEXT      |
| prediction   | TEXT      |
| confidence   | REAL      |
| date         | TIMESTAMP |

Relationship:

```
One User → Many Predictions
```

---

## Project Folder Structure

```
ONCOSCAN-AI
│
├── backend
│       ├── main.py
│       ├── database.py
│
├── frontend
│       ├── admin
│       │       ├── dashboard.html
│       │       ├── dashboard.js
│       │       ├── stats.html
│       │       └── admin.css
│       │
│       └── user
│               ├── login.html
│               ├── index.html
│               ├── result.html
│               ├── history.html
│               ├── script.js
│               ├── history.js
│               └── style.css
│
├── models
│       └── brain_tumor_model.h5
│
├── static
│       ├── images
│       └── reports
│
├── database.db
├── requirements.txt
├── .gitignore
└── README.md
```

---

## How to Run the Project

### 1. Clone Repository

```
git clone https://github.com/yourusername/oncoscan-ai.git
cd oncoscan-ai
```

### 2. Create Virtual Environment

```
python -m venv venv
venv\Scripts\activate
```

### 3. Install Requirements

```
pip install -r requirements.txt
```

### 4. Run Server

```
uvicorn backend.main:app --reload
```

### 5. Open in Browser

```
http://127.0.0.1:8000/login
```

---

## Default Admin Login

```
Username: admin
Password: admin123
```

---

## System Workflow

```
User Registration / Login
            |
            v
Upload MRI Image
            |
            v
AI Model Prediction
            |
            v
Save Result to Database
            |
            v
Generate PDF Report
            |
            v
User History / Admin Dashboard
```

---

## Future Improvements

- Password Hashing
- Email Verification
- Multiple Image Prediction
- Export CSV Reports
- Model Accuracy Dashboard
- Cloud Deployment
- Docker Support
- API Authentication
- Role-Based Access Security

---

## Author

Shahriar Alom Masud
IoT & Robotics Engineering
Web Application Developer | AI | IoT | Robotics

---

## License

This project is developed for educational and research purposes.
