# NETHRA

## Agricultural Intelligence & Transaction Platform

NETHRA is an AI-powered Agricultural Intelligence and Transaction Platform designed to improve income stability for small and marginal farmers. The system integrates yield prediction, disease detection, fair price modeling, and marketplace connectivity into one unified ecosystem.

The goal is simple. Replace guesswork with data. Replace dependency with transparency.

---

# Problem

Small and marginal farmers face:

* No structured yield prediction
* Late crop disease detection
* Weak price transparency
* High machinery ownership costs
* Limited access to bulk buyers
* Expensive or inaccessible financial services

This results in income instability and reduced profitability.

NETHRA addresses these inefficiencies through predictive analytics and structured transaction support.

---

# Core Features

## 1. AI Yield Prediction

Predicts expected crop yield using machine learning based on environmental and crop parameters.

## 2. Disease Detection

Image-based crop disease identification for early intervention.

## 3. Fertilizer Recommendation

Optimized fertilizer suggestions to reduce overuse and cost.

## 4. NETHRA Fair Price Index (NFPI)

A fair pricing model calculated as:

NFPI =
0.6 × Today’s Modal Price

* 0.3 × 7-Day Average
* 0.1 × Demand Factor

Provides a transparent and data-backed price reference.

## 5. Equipment Rental Marketplace

Enables farmers to rent tractors and machinery instead of purchasing.

## 6. Buyer Integration

Direct connection with bulk buyers such as retailers and institutions.

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Deployed on Vercel (for development/demo)

## Backend

* FastAPI
* REST APIs

## Machine Learning

* Random Forest (Yield Prediction)

## External APIs

* Market Price API (Mandi Data)
* Satellite Data (NDVI & Environmental Data)
* Image Analysis API (Disease Detection)
* Location Services API

## Cloud Infrastructure

* AWS (Primary scalable deployment architecture)
* Vercel (Frontend hosting during prototype phase)

---

# System Architecture

The platform follows a layered architecture:

1. User Interface Layer – Farmer inputs crop data and uploads images
2. Application Layer – Backend request handling and routing
3. Intelligence Layer – ML model processing and pricing logic
4. Integration Layer – External APIs for price, satellite, and geo data

This modular structure allows independent scaling of services.

---

# Deployment

Current Demo Deployment:
Frontend hosted on Vercel for rapid iteration.

Production Architecture:
Designed for AWS-based scalable deployment including compute services, storage, and secure API handling.

---

# Business Model

NETHRA does not charge farmers.

Revenue is generated from:

* Equipment rental commission (5–7%)
* Fertilizer affiliate partnerships
* Financial institution commission
* Buyer contract facilitation fee (~2%)

The ecosystem pays. Farmers benefit.

---

# Installation (Development Setup)

Clone the repository:

```
git clone https://github.com/your-repo/nethra.git
cd nethra
```

Frontend Setup:

```
npm install
npm run dev
```

Backend Setup:

```
pip install -r requirements.txt
uvicorn main:app --reload
```

Make sure environment variables are configured for API keys.

---

# Testing

* Unit testing for prediction modules
* API integration testing
* Edge case handling for invalid inputs
* Performance testing for concurrent requests

Cross-validation used for ML model evaluation.

---

# Limitations

* Depends on external APIs for disease detection and price data
* Prediction accuracy depends on dataset quality
* Requires internet connectivity
* Model requires periodic retraining

---

# Future Scope

* In-house disease detection model
* Multilingual AI chatbot support
* IoT soil sensor integration
* Blockchain-based contract transparency
* AI-based credit scoring

---

# Team

Team Name: Chakravyuh
Team Lead: Kommu Hemasree
Members: Kushal, Sunaina, Shashank
College: GRIET

---

# License

This project is developed for academic and hackathon purposes. Further commercialization requires licensing and regulatory compliance.