🛡️ LinkBuster AI
Real-Time AI-Powered URL Threat Detection Platform

LinkBuster AI is a full-stack cybersecurity platform designed to detect phishing links, malicious domains, and suspicious URLs in real time. It combines machine learning–based URL analysis, browser-level monitoring, and intelligent alerting to proactively protect users from online threats.

🚀 Overview

Modern phishing attacks evolve rapidly and often bypass traditional blacklist-based systems.
LinkBuster AI addresses this by combining:

Feature-based machine learning detection

Pattern recognition algorithms

Threat intelligence integration

Real-time browser extension monitoring

User-level risk analytics dashboard

The system operates as an end-to-end security solution including backend API services, ML pipeline, database tracking, and browser extension integration.

✨ Core Capabilities
🤖 AI-Powered URL Analysis

Machine learning-based URL classification

Feature extraction (length, entropy, suspicious tokens, domain structure)

Pattern-based phishing detection

Risk scoring system (0–100%)

Integration with threat intelligence APIs

Each scanned URL is processed through a structured ML pipeline:

URL → Feature Extraction → Model Prediction → Risk Score → Response

🌐 Browser Extension Protection

Real-time URL scanning

Automatic background monitoring

Visual threat indicators (Green / Yellow / Red)

One-click manual scan option

Lightweight, non-blocking execution

The extension communicates securely with the backend REST API.

📊 Dashboard & Analytics

Complete scan history

Risk trend visualization

User authentication & profile management

Detailed threat breakdown reports

Exportable scan summaries

📧 Intelligent Alert System

Automated high-risk email notifications

AI-generated threat explanation reports

Multi-channel alerts (browser + email)

Customizable alert thresholds

🏗️ System Architecture
User
   ↓
Browser Extension
   ↓
Flask REST API
   ↓
ML Model (Scikit-learn)
   ↓
SQLite Database
   ↓
Dashboard & Alerts

Architecture Layers
Layer	Responsibility
Frontend	Dashboard UI & User Interaction
Extension	Real-time URL monitoring
Backend	API handling & business logic
ML Layer	Threat classification
Database	User data & scan logs
🛠️ Technology Stack
Backend

Python 3.9+

Flask (REST API)

Scikit-learn (ML model)

NumPy / Pandas (data processing)

SQLite (lightweight database)

Frontend

HTML5 / CSS3

JavaScript

Jinja2 templating

Security & APIs

Google Safe Browsing API (threat intelligence)

SMTP2Go (email delivery)

CORS-enabled API for extension compatibility

📈 Performance Benchmarks
Metric	Value
Average Scan Time	< 2 seconds
Detection Accuracy	~95% (known datasets)
Concurrent Handling	1000+ requests (tested locally)
Deployment Uptime	99%+ (controlled environment)
🔐 Privacy & Security Principles

HTTPS-only communication

Secure authentication system

Controlled API access

Minimal data retention policy

Transparent ML logic

🚀 Quick Start
1️⃣ Clone Repository
git clone https://github.com/Rohithstu/FakeLinkBuster-Pro_Main.git
cd FakeLinkBuster-Pro_Main

2️⃣ Backend Setup
cd backend
pip install -r requirements.txt
python app_upgraded.py

3️⃣ Load Browser Extension

Open Chrome → Extensions

Enable Developer Mode

Click "Load Unpacked"

Select browser-extension folder

🧠 Machine Learning Pipeline

Data Collection

Feature Engineering

Model Training

Model Serialization

Real-Time Prediction API

Model scripts available in:

/model

🧪 Future Improvements

Deep learning-based URL embeddings

Cloud deployment (AWS / Azure)

Redis caching for performance

JWT-based authentication

Docker containerization

CI/CD pipeline integration

🤝 Contributing

We welcome contributions.

Fork the repository

Create a feature branch

Commit changes

Submit a pull request

📜 License

MIT License

📬 Contact

Kamidi Rohith Reddy
Email: reddykrohith7@gmail.com.com

<div align="center">
🔐 Building Safer Browsing with AI

⭐ Star this repository • 🐛 Report Issues • 🔧 Contribute

</div>
