# IntelliShield

IntelliShield is a secure authentication platform with a FastAPI backend and a frontend interface for user registration and access flows.

## Overview

The project is organized into two main areas:

- Backend: FastAPI + SQLAlchemy + PostgreSQL-ready configuration
- Frontend: Vite-based interface for user-facing screens

## Project structure

```text
IntelliShield/
├── README.md
├── team_setup.md
├── backend/
│   ├── README.md
│   ├── requirements.txt
│   └── app/
│       ├── config.py
│       ├── database.py
│       ├── main.py
│       ├── security.py
│       ├── models/
│       │   └── user.py
│       ├── routers/
│       │   └── auth.py
│       └── schemas/
│           └── user.py
├── frontend/
│   ├── README.md
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
└── docs/
    └── docs.md
```

## Backend features

- FastAPI application setup
- SQLAlchemy database connection and session management
- User model for account storage
- Pydantic schemas for auth payloads and responses
- Bcrypt-based password hashing and verification
- Auth route structure for registration and login

## Security model

Passwords are hashed before storage using bcrypt. This prevents plaintext password storage and enables safe verification during login.

## Backend run

From the backend folder:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

## Frontend run

From the frontend folder:

```powershell
cd frontend
npm install
npm run dev
```

## Notes

- The backend is currently set up for secure password hashing and user auth scaffolding.
- Registration and login endpoints are the next backend implementation step.
- Environment variables such as the database URL should be defined in the project environment or .env file used by the FastAPI settings.
