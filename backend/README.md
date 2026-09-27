## IntelliShield Backend

This backend is built with FastAPI and SQLAlchemy for user authentication and application data access.

### Current setup

- FastAPI application entry point in [app/main.py](app/main.py)
- SQLAlchemy database configuration and session creation in [app/database.py](app/database.py)
- User model in [app/models/user.py](app/models/user.py)
- Pydantic request/response schemas in [app/schemas/user.py](app/schemas/user.py)
- Password hashing and verification utilities in [app/security.py](app/security.py)
- Auth route module scaffold in [app/routers/auth.py](app/routers/auth.py)
- Project dependencies in [requirements.txt](requirements.txt)

### Included functionality

- Database bootstrap with SQLAlchemy declarative base
- PostgreSQL connection configuration via environment settings
- User table with fields for name, email, and hashed password
- Bcrypt-based password hashing and verification utilities
- Ready-to-fill auth route structure for registration and login flow

### Security notes

- Passwords are not stored in plain text.
- The application uses bcrypt hashing through the security helper functions.
- User authentication logic should be implemented in the auth router and reused with the database session dependency.

### Project structure

- app/
  - main.py
  - database.py
  - config.py
  - security.py
  - models/
    - user.py
  - schemas/
    - user.py
  - routers/
    - auth.py

### Dependency status

- FastAPI
- SQLAlchemy
- Pydantic + settings
- PostgreSQL driver
- bcrypt
