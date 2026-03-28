# OncoScan AI: Full Stack Explainable Brain Tumor Detection System Using CNN and Grad-CAM
![Python](https://img.shields.io/badge/Python-3.x-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![TensorFlow](https://img.shields.io/badge/TensorFlow-DeepLearning-orange)
![CNN](https://img.shields.io/badge/CNN-Image_Classification-red)
![Grad-CAM](https://img.shields.io/badge/Grad--CAM-Explainable_AI-purple)
![SQLite](https://img.shields.io/badge/SQLite-Database-lightgrey)
![HTML](https://img.shields.io/badge/HTML-Frontend-orange)
![CSS](https://img.shields.io/badge/CSS-Frontend-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow)
![Chart.js](https://img.shields.io/badge/Chart.js-Analytics-pink)
![Netlify](https://img.shields.io/badge/Netlify-Frontend_Hosting-teal)
![Render](https://img.shields.io/badge/Render-Backend_Hosting-black)
![REST API](https://img.shields.io/badge/REST-API-green)
![ReportLab](https://img.shields.io/badge/PDF-Report_Generation-red)
## Project Overview
OncoScan AI is a full-stack explainable artificial intelligence system developed for detecting brain tumors from MRI images using a Convolutional Neural Network (CNN). The system integrates Grad-CAM for heatmap-based explainable AI visualization, a FastAPI backend for prediction and data management, and a web-based frontend interface for user interaction. The platform also includes PDF medical report generation, prediction history tracking, and an admin analytics dashboard. The frontend is deployed on Netlify and the backend is deployed on Render.

This project integrates Machine Learning, Backend Development, Frontend Development, Database Management, REST API Development, and Cloud Deployment into a complete AI-based web platform.
---
## Project Motivation
Brain tumor diagnosis using MRI images is a complex and time-consuming process that requires expert radiologists. The goal of this project is to assist medical professionals by developing an AI system that can automatically analyze MRI images and predict whether a tumor is present or not.

The system also provides explainable AI visualization (Grad-CAM heatmap) to show which region of the MRI image influenced the model’s decision.
---
## Project Structure

```
oncoscan-ai/
│
├── backend/                     # FastAPI backend + ML integration
│   ├── main.py                  # Main FastAPI application
│   ├── database.py              # Database connection & queries
│   └── __pycache__/
│
├── frontend/                    # Frontend (Netlify hosted)
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── dashboard.js
│   │   ├── stats.html
│   │   └── stats.js
│   │
│   ├── user/
│   │   ├── history.html
│   │   └── history.js
│   │
│   ├── index.html               # Upload page
│   ├── login.html               # Login page
│   ├── result.html              # Result page
│   ├── script.js
│   ├── style.css
│   ├── config.js                # Backend API URL config
│   └── _redirects               # Netlify redirects
│
├── models/                      # ML models
│   ├── brain_tumor_model.h5
│   ├── model_fixed.h5
│   └── model_fixed.keras
│
├── static/                      # Uploaded images, heatmaps, PDFs
│
├── utils/                       # Helper functions
│
├── tests/                       # Testing files
│
├── notebooks/                   # Model training notebooks
│
├── results/                     # Prediction results
│
├── fix_model.py                 # Model conversion script
├── database.db                  # SQLite database
├── requirements.txt             # Python dependencies
├── runtime.txt                  # Python runtime version
├── Procfile                     # Render deployment config
├── .gitignore
└── README.md
```
## Machine Learning Model
The brain tumor detection model is built using Deep Learning with Convolutional Neural Networks (CNN).

### Model Details
- Model Type: Convolutional Neural Network (CNN)
- Task: Binary Image Classification
- Classes: Tumor / No Tumor
- Framework: TensorFlow / Keras
- Image Processing: OpenCV
- Output:
  - Prediction (Tumor / No Tumor)
  - Confidence Score

### Model Workflow
MRI Image
↓
Image Preprocessing
↓
CNN Model
↓
Prediction
↓
Tumor / No Tumor


---
## Grad-CAM Heatmap (Explainable AI)
Grad-CAM (Gradient-weighted Class Activation Mapping) is used to visualize which region of the MRI image influenced the model’s prediction.

### Grad-CAM Workflow

Input Image
↓
CNN Forward Pass
↓
Compute Gradients
↓
Generate Heatmap
↓
Overlay Heatmap on Image


This makes the AI system explainable and suitable for medical applications.
---
## Backend (FastAPI)
The backend of the system is developed using FastAPI.

### Backend Responsibilities
- User Authentication
- Image Upload Handling
- AI Model Prediction
- Heatmap Generation
- PDF Report Generation
- Database Storage
- Prediction History
- Admin Dashboard APIs
- Statistics and Analytics
- Record Deletion
---
## REST API Endpoints

| Endpoint | Method | Description |
|---------|--------|-------------|
| /register | POST | User Registration |
| /login | POST | User Login |
| /predict | POST | Upload image and get prediction |
| /history/{user_id} | GET | User prediction history |
| /admin/all-history | GET | Admin dashboard data |
| /stats | GET | System statistics |
| /stats-details | GET | Chart data |
| /delete/{id} | DELETE | Delete prediction |
| /report/{id} | GET | Download PDF report |
---
## Database (SQLite)

### Users Table
| Field | Description |
|------|-------------|
| id | User ID |
| username | Username |
| password | Password |
| role | user / admin |
| created_at | Account creation date |

### Predictions Table
| Field | Description |
|------|-------------|
| id | Prediction ID |
| user_id | User ID |
| patient_name | Patient Name |
| patient_id | Patient ID |
| image_path | Uploaded MRI image |
| prediction | Tumor / No Tumor |
| confidence | Confidence score |
| heatmap_path | Heatmap image |
| report_path | PDF report |
| date | Prediction date |

Relationship:

One User → Many Predictions
---
## Frontend
The frontend of the system is built using HTML, CSS, and JavaScript.

### User Features
- User Registration
- User Login
- Upload MRI Image
- Drag and Drop Image Upload
- Image Preview
- Tumor Prediction Result
- Confidence Score Display
- Heatmap Visualization
- PDF Report Download
- Prediction History

### Admin Features
- Admin Dashboard
- Total Predictions
- Tumor Cases Count
- No Tumor Cases Count
- Total Patients
- Recent Predictions Table
- Delete Prediction Records
- Analytics Charts
---
## Charts and Analytics
Charts are implemented using Chart.js.

Charts included:
- Prediction Distribution (Pie Chart)
- Daily Prediction Activity (Line Chart)
---
## System Architecture

User (Browser)
|
v
Frontend (HTML, CSS, JavaScript)
|
v
Netlify (Frontend Hosting)
|
v
FastAPI Backend (Render)
|
v
AI Model (TensorFlow)
|
v
Database (SQLite)

---
## Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Netlify |
| Backend | Render |
| Database | SQLite |
| AI Model | TensorFlow |
| Version Control | GitHub |
---
## Project Workflow

User Login
↓
Upload MRI Image
↓
Image Preprocessing
↓
CNN Model Prediction
↓
Generate Heatmap
↓
Save Data to Database
↓
Generate PDF Report
↓
Show Result to User
↓
Admin Dashboard Analytics

---
## Technologies Used

### Machine Learning
- TensorFlow
- Keras
- CNN
- Grad-CAM
- OpenCV
- NumPy

### Backend
- FastAPI
- Python
- SQLite
- ReportLab
- Uvicorn

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js

### Deployment
- Netlify
- Render
- GitHub
---
## Future Improvements
- Password hashing
- Email notification system
- Multiple image prediction
- Cloud image storage
- Model accuracy dashboard
- Docker deployment
- JWT authentication
- Role-based access control
- Mobile responsive UI
---
## Author

Shahriar Alom Masud  
B.Sc. Engg. in IoT & Robotics Engineering  
University of Frontier Technology, Bangladesh  
Email: shahriar0002@std.uftb.ac.bd  
LinkedIn: https://www.linkedin.com/in/shahriar-alom-masud

---
## License

This project is licensed under the **MIT License**.

---
If you like this project, give it a star on GitHub!
