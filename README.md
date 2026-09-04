# 🧠 Mental Health Score Predictor

Predict a student's mental wellbeing score from their digital habits and daily routine — screen time, sleep, study hours, stress level, and more — using a machine learning model served through a FastAPI backend, with an interactive web UI on the frontend.

**Live demo:** [mental-health-score-1-fxfg.onrender.com](https://mental-health-score-1-fxfg.onrender.com/)
**API base URL:** `https://mental-health-score-njz4.onrender.com`

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Deployment](#deployment)
  - [Deploying the Backend (Render)](#deploying-the-backend-render)
  - [Deploying the Frontend (Render Static Site)](#deploying-the-frontend-render-static-site)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

This project estimates a **mental health / wellbeing score (0–10)** for students based on lifestyle and social-media usage patterns. It has two parts:

1. **Backend** — a FastAPI service that loads a trained ML model (`Mental_Health_Model.pkl`) and exposes a `/predict` endpoint.
2. **Frontend** — a lightweight, dependency-free HTML/CSS/JS interface that collects user input through an interactive form, shows a live heuristic preview as you fill it out, and calls the backend to display the final predicted score on an animated gauge.

The model was trained on a dataset of student social-media usage, study habits, sleep, physical activity, and self-reported stress levels.

---

## Features

- 🎯 Real-time ML-based prediction of a wellbeing score out of 10
- ⚡ Instant client-side preview gauge while the form is being filled
- 📱 Fully responsive layout (desktop, tablet, mobile with a sticky action bar)
- 🌤️ Clean light-themed UI with accessible focus states and reduced-motion support
- 🔌 Simple REST API (`POST /predict`) that can be consumed by any frontend or client
- 🌍 CORS-enabled backend, ready to be called from any origin

---

## Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — API framework
- [Pydantic](https://docs.pydantic.dev/) — request validation
- [scikit-learn](https://scikit-learn.org/) — model training/inference
- [joblib](https://joblib.readthedocs.io/) — model serialization
- [pandas](https://pandas.pydata.org/) — data handling
- [Uvicorn](https://www.uvicorn.org/) — ASGI server

**Frontend**
- HTML5, CSS3 (custom properties, no framework)
- Vanilla JavaScript (Fetch API)
- Google Fonts (Fraunces + IBM Plex Sans)

**Deployment**
- [Render](https://render.com/) — backend web service + frontend static site

---

## Project Structure

```
mental-health-score/
├── main.py                     # FastAPI app & /predict endpoint
├── Mental_Health_Model.pkl     # Trained ML model (loaded at startup)
├── ML_Project.ipynb            # Model training / EDA notebook
├── requirements.txt            # Python dependencies
├── index.html                  # Frontend markup
├── style.css                   # Frontend styling
├── script.js                   # Frontend logic (form + API calls)
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- pip
- Git

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/yogeshyadav-07/mental-health-score.git
cd mental-health-score

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the API locally
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

If you don't have a `requirements.txt` yet, create one with:

```txt
fastapi
uvicorn[standard]
pydantic
pandas
scikit-learn
joblib
```

### Frontend Setup

The frontend is static — no build step required.

```bash
# From the project root, just open it directly
open index.html          # macOS
start index.html         # Windows
```

Or serve it locally so relative paths behave exactly like production:

```bash
python -m http.server 5500
# then visit http://localhost:5500
```

> By default, `script.js` points `API_URL` at the deployed backend (`https://mental-health-score-njz4.onrender.com/predict`). Change this to `http://127.0.0.1:8000/predict` if you're testing against a local backend.

---

## API Reference

### `GET /`

Health check.

**Response**
```json
{ "message": "Welcome to the Mental Health Prediction API build by yogesh kumar yadav" }
```

### `POST /predict`

Predicts a mental wellbeing score from student lifestyle data.

**Request body**

| Field                      | Type    | Notes                                                                 |
|-----------------------------|---------|------------------------------------------------------------------------|
| `age`                        | int     | 10–100                                                                 |
| `gender`                     | string  | `Male`, `Female`                                                       |
| `country`                    | string  | Any country name                                                       |
| `academic_level`             | string  | `Undergraduate`, `Graduate`, `High School`                             |
| `most_used_platform`         | string  | `Facebook`, `LinkedIn`, `Instagram`, `Snapchat`, `Twitter`, `YouTube`, `TikTok`, `LINE`, `KakaoTalk`, `VKontakte`, `WhatsApp`, `WeChat` |
| `purpose_of_use`             | string  | `Networking`, `Education`, `Entertainment`, `News`                    |
| `avg_daily_usage_hours`      | float   | 0–24                                                                   |
| `daily_unlocks`              | int     | ≥ 0                                                                    |
| `study_hours`                | float   | 0–24                                                                   |
| `physical_activity_hours`    | float   | 0–24                                                                   |
| `sleep_hours_per_night`      | float   | 0–24                                                                   |
| `stress_level`               | string  | `Low`, `Medium`, `High`, `Very High`                                   |

**Example request**
```json
{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 4.5,
  "daily_unlocks": 60,
  "study_hours": 3,
  "physical_activity_hours": 1,
  "sleep_hours_per_night": 7,
  "stress_level": "Medium"
}
```

**Example response**
```json
{
  "predicted_mental_health_score": 6.42
}
```

---

## Deployment

Both pieces are deployed on **Render**.

### Deploying the Backend (Render)

1. Push this repo to GitHub (already done: [yogeshyadav-07/mental-health-score](https://github.com/yogeshyadav-07/mental-health-score.git)).
2. On [Render](https://render.com/), click **New → Web Service** and connect the repo.
3. Configure:

   | Setting | Value |
   |---|---|
   | **Environment** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

4. Make sure `Mental_Health_Model.pkl` is committed to the repo (Render only deploys what's in Git).
5. Deploy — Render will give you a live URL such as `https://mental-health-score-njz4.onrender.com`.

> Free-tier Render services spin down after inactivity, so the first request after idle time may take 20–50 seconds to respond ("cold start"). The frontend already surfaces a friendly message for this.

### Deploying the Frontend (Render Static Site)

1. On Render, click **New → Static Site** and connect the same (or a separate) repo.
2. Configure:

   | Setting | Value |
   |---|---|
   | **Build Command** | *(leave blank — no build step)* |
   | **Publish Directory** | `.` (root, or wherever `index.html` lives) |

3. Deploy — you'll get a URL like `https://mental-health-score-1-fxfg.onrender.com/`.
4. In `script.js`, keep `API_URL` pointed at the backend's live URL so the static site can reach it (CORS is already open on the API).

---

## Environment Variables

The current backend doesn't require any secrets to run — the model is loaded directly from the local `.pkl` file. If you later add configuration (e.g. a different model path, allowed CORS origins), document them here, for example:

```env
MODEL_PATH=Mental_Health_Model.pkl
ALLOWED_ORIGINS=https://mental-health-score-1-fxfg.onrender.com
```

---

## Screenshots

> Add screenshots or a short GIF of the form and the result gauge here once available.

```
docs/screenshot-form.png
docs/screenshot-result.png
```

---

## Roadmap

- [ ] Add a `requirements.txt` with pinned versions
- [ ] Add automated tests for `/predict`
- [ ] Add input-level explanations (which factors pulled the score up/down)
- [ ] Add a `Dockerfile` for containerized deployment

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is available under the [MIT License](LICENSE).

---

## Author

**Yogesh Kumar Yadav**
GitHub: [@yogeshyadav-07](https://github.com/yogeshyadav-07)
Repository: [mental-health-score](https://github.com/yogeshyadav-07/mental-health-score)
