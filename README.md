# 🛡️ LinkBuster AI: Advanced URL Threat Intelligence

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Render-blueviolet?style=for-the-badge&logo=render)](https://fakelinkbuster-pro-main.onrender.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Framework-black?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)

**LinkBuster AI** is a state-of-the-art cybersecurity platform that leverages high-dimensional machine learning and real-time behavioral analysis to identify phishing, malware, and social engineering threats hidden within URLs.

---

## 🚀 Live Deployment
Access the live intelligence dashboard here:  
**🔗 [https://fakelinkbuster-pro-main.onrender.com/](https://fakelinkbuster-pro-main.onrender.com/)**

---

## ✨ Key Capabilities

### 🧠 Neural Threat Detection
- **Feature Extraction**: AI analyzes 15+ mathematical features of every URL (entropy, digit ratio, path depth, etc.).
- **ML Engine**: Powered by a scikit-learn pipeline for high-accuracy threat classification.
- **Risk Scoring**: Provides a granular risk index (0-100%) with confidence levels.

### 📊 Intelligence Dashboard
- **Glassmorphic UI**: A premium, dark-themed dashboard for managing security posture.
- **Global Threat Map**: Real-time visualization of detected threat origins and patterns.
- **Scan History**: Full persistence of historical scans with AI-generated insights.
- **User Profiles**: Personalized security analytics and scan statistics.

### 🛡️ Multi-Channel Protection
- **Browser Extension**: Real-time background monitoring for seamless web protection.
- **Smart Alerts**: Automated email notifications via SMTP2Go when high-risk URLs are detected.
- **API Ecosystem**: Robust REST API endpoints for batch scanning and third-party integrations.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python, Flask, Gunicorn (Production WSGI) |
| **ML Engine** | Scikit-learn, NumPy, Pandas, Joblib |
| **Frontend** | HTML5, CSS3 (Glassmorphism), JavaScript, Jinja2 |
| **Database** | SQLite (Production-optimized with absolute paths) |
| **APIs** | Google Safe Browsing, SMTP2Go |
| **Infrastructure** | Render (CI/CD) |

---

## 📂 Project Structure

```text
LINKBUSTER-AI/
├── backend/                # Flask Core, AI Logic, and DB Management
│   ├── app_upgraded.py     # Main Application Entry Point
│   ├── init_db.py          # User Database Initialization
│   └── init_history.py     # Scan History Initialization
├── frontend/               # UI Templates and Static Assets
│   ├── templates/          # Jinja2 HTML Templates (Dashboard, Profile, etc.)
│   └── static/             # CSS (Glassmorphic) and JS (Threat Maps)
├── browser-extension/      # Chrome/Edge Extension Source
├── model/                  # ML Model Training and Feature Extraction
└── render.yaml             # Infrastructure as Code (Blueprint)
```

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the Matrix
```bash
git clone https://github.com/Rohithstu/FakeLinkBuster-Pro_Main.git
cd FakeLinkBuster-Pro_Main
```

### 2. Initialize Backend
```bash
cd backend
pip install -r requirements.txt
python init_db.py
python init_history.py
python app_upgraded.py
```
*The system will be live at `http://localhost:5000`*

### 3. Load Browser Extension
1. Open Chrome/Edge and navigate to `Extensions`.
2. Enable **Developer Mode**.
3. Click **Load Unpacked** and select the `browser-extension` folder.

---

## 🤝 Contributing
Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for a Safer Web by <a href="https://github.com/Rohithstu">K. Rohith Reddy</a></sub>
</div>
