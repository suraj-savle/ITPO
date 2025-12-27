# Contributing to ITPO - Internship and Training Placement Office

Thank you for your interest in contributing to this project!  
Follow the steps below to get started.


## 1. Fork the Repository
Click "Fork" on the top-right of the repository.  
This creates your own copy.

## 2. Clone Your Fork


```bash
git clone https://github.com/suraj-savle/ITPO.git
```

## 3. Create a New Branch
```bash
git checkout -b feature-branch-name
```

## 4. Install Dependencies

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```bash
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Important: Seed Admin Account (First Time Setup)

Before starting the backend server for the first time, you must create an admin user.

### Open the file: backend/scripts/seedAdmin.js
Update the admin credentials inside the file:

### Run the seed script from the backend/scripts folder:

```bash
node seedAdmin.js
```

This will create the admin account in the database.

### Start the backend server:

```bash
npm start
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

### Recommendation Service Setup
```bash
# Navigate to recommendation service
cd ../recommendation_service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python app.py
```

## 5. Environment Variables
Create a `.env` file inside the backend folder:


```bash
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```


## 6. Run the Project

### Backend

```bash
npm start
```

### Frontend

```bash
npm run dev
```

## 7. Commit Your Changes

```bash
git add .
git commit -m "Meaningful commit message"
```

## 8. Push and Create a Pull Request

```bash
git push origin feature-branch-name
```

Go to your fork → "Compare & Pull Request"


## 9. Contribution Rules
- Write clean, readable code  
- Add comments where needed  
- Use meaningful commit messages  
- Write PR description clearly  
- Do not push `.env` or sensitive data  
- Follow the folder structure

Thank you for contributing!
