# IntelliShield Team Setup Guide

## 1. Prerequisites

Install the following:

- Git
- Python
- Node.js
- VS Code

Verify the installations:

```powershell
git --version
python --version
node --version
npm --version
```

---

## 2. Clone the Repository

Clone the IntelliShield repository:

```powershell
git clone <GITHUB_REPOSITORY_URL>
cd IntelliShield
```

---

## 3. Create the Python Virtual Environment

From the project root:

```powershell
python -m venv .venv
```

Activate the virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Verify the Python executable:

```powershell
python -c "import sys; print(sys.executable)"
```

It should point to:

```text
IntelliShield\.venv\Scripts\python.exe
```

> Each team member creates their own `.venv`. The `.venv` folder is not committed to GitHub.

---

## 4. Install Backend Dependencies

Navigate to the backend:

```powershell
cd backend
```

Install the required Python packages:

```powershell
pip install -r requirements.txt
```

---

## 5. Start the Backend

From the `backend` directory:

```powershell
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### Health Check

Open:

```text
http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "healthy"
}
```

### API Documentation

Open:

```text
http://127.0.0.1:8000/docs
```

---

## 6. Install Frontend Dependencies

Open a second terminal.

Navigate to the frontend:

```powershell
cd frontend
```

Install the Node.js dependencies:

```powershell
npm install
```

> `node_modules` is generated locally and is not committed to GitHub.

---

## 7. Start the Frontend

From the `frontend` directory:

```powershell
npm run dev
```

The frontend will run at:

```text
http://localhost:5173/
```

Open this address in your browser.

---

## 8. Running the Project

Two terminals should normally be running.

### Terminal 1 — Backend

```powershell
cd C:\path\to\IntelliShield\backend
..\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### Terminal 2 — Frontend

```powershell
cd C:\path\to\IntelliShield\frontend
npm run dev
```

Frontend:

```text
http://localhost:5173/
```

---

## 9. Git Workflow

Do not normally work directly on `main`.

Before starting new work:

```powershell
git checkout main
git pull origin main
```

Create a new branch:

```powershell
git checkout -b feature/<feature-name>
```

Example:

```powershell
git checkout -b feature/login-page
```

---

## 10. Commit and Push Changes

Check your changes:

```powershell
git status
```

Stage the changes:

```powershell
git add .
```

Commit:

```powershell
git commit -m "Add login page"
```

Push the branch:

```powershell
git push -u origin feature/login-page
```

---

## 11. Create a Pull Request

After pushing your branch:

1. Open the IntelliShield GitHub repository.
2. Create a Pull Request.
3. Set the base branch to `main`.
4. Set the compare branch to your feature branch.
5. Add a clear title and description.
6. Review the changes.
7. Merge the Pull Request after review.

---

## 12. Files That Must Not Be Committed

Do not commit:

```text
.venv/
node_modules/
.env
__pycache__/
```

These files/folders are handled by `.gitignore`.

---

## 13. Daily Development Workflow

Start each task with:

```powershell
git checkout main
git pull origin main
git checkout -b feature/<feature-name>
```

Then:

1. Develop your feature.
2. Test your changes.
3. Check `git status`.
4. Commit your changes.
5. Push your branch.
6. Create a Pull Request.
7. Review the Pull Request.
8. Merge into `main`.

---

## 14. Important Team Rules

- Always pull the latest `main` before starting new work.
- Do not normally commit directly to `main`.
- Use feature branches for development.
- Create Pull Requests for completed work.
- Do not commit `.venv`, `node_modules`, or `.env` files.
- Never commit passwords, API keys, or other sensitive information.
- Each team member should maintain their own local development environment.
