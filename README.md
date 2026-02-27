## 🔹 Commitment Reality Engine (CRE)

Commitment Reality Engine (CRE) is a behavioral tracking system that measures the gap between what you *plan* and what you *actually do*.

It calculates your **Effort Gap (Actual − Estimated)**, detects commitment bias patterns, and gives real-time behavioral feedback to improve planning accuracy.

This project focuses on accountability, realistic estimation, and bias correction.


---

## 🔹 Core Concept

Most people consistently:

- Underestimate effort → Optimism Bias
- Overestimate effort → Fear Bias

CRE tracks your commitments, compares estimated vs actual effort, calculates a Reality Score, and classifies your behavioral pattern.


---

## 🔹 Features 

### 1. Authentication System
- User Registration
- Secure Login
- Protected Dashboard Access

### 2. Commitment Creation
- Add new commitments
- Enter estimated effort (hours)
- Select start date & end date
- Real-time validation

### 3. Effort Gap Tracking
- Stores estimated effort
- Records actual effort on completion
- Automatically calculates difference

### 4. Reality Score Engine
- Calculates overall planning accuracy
- Displays numerical Reality Score
- Dynamically updates after each completion

### 5. Bias Detection System
- Shows status badge:
  - REALISTIC
  - OPTIMISTIC
  - (Future scope: PESSIMISTIC / Fear Bias)
- Detects consistent underestimation behavior
- Displays behavioral warnings

### 6. Pre-Commitment Warning (🔥 Unique Feature)
Before creating a commitment, the system:
- Analyzes previous estimation pattern
- Warns if user usually underestimates effort
- Suggests adjusting estimate

### 7. Commitment Lifecycle
- Pending Commitments
- Add reason for delay
- Mark as Complete
- Delete commitment
- View Completed Commitments with Estimated vs Actual

### 8. Reset Mechanism
- Restart button resets tracking metrics
- Useful for new evaluation cycles

---

## 🔹 Screenshots

### 🔐 Register Page
<br>
<img width="1920" height="897" alt="Screenshot 2026-02-26 223136" src="https://github.com/user-attachments/assets/688c4b58-4e05-4056-ae2a-8e70c01eef22" />

### 🔑 Login Page
<br>
<img width="1920" height="913" alt="Screenshot 2026-02-26 223113" src="https://github.com/user-attachments/assets/3390b9db-927d-440f-b34f-d9a468a23a24" />

### 📊 Dashboard – Reality Score View
<br>
<img width="1920" height="910" alt="Screenshot 2026-02-26 223355" src="https://github.com/user-attachments/assets/3b4bc4b9-a6fd-4294-afa7-6e9847ff3329" />

### 📝 Dashboard – New Commitment & Warning
<br>
<img width="1920" height="910" alt="Screenshot 2026-02-26 224145" src="https://github.com/user-attachments/assets/81fca4cc-68bb-4361-ba6d-af81c290fa7e" />
 

### ✅ Dashboard – Commitments Overview
<br>
<img width="1920" height="910" alt="Screenshot 2026-02-26 224004" src="https://github.com/user-attachments/assets/92d4d421-aaec-4bd1-b030-5805590eebe4" />


---

## 🔹 Tech Stack

Frontend:
- React.js
- Vite
- Modern CSS Styling

Backend:
- Node.js
- Express.js

Database:
- MongoDB

---

## 🔹 How It Works (Logic Flow)

1. User registers and logs in.
2. User creates a commitment with estimated effort.
3. System stores commitment as pending.
4. On completion, user enters actual effort.
5. Effort Gap is calculated:
   
   Effort Gap = Actual − Estimated

6. Reality Score updates dynamically.
7. Bias detection logic evaluates estimation behavior.
8. System displays classification and warnings.

---

## 🔹 Why This Project Matters

Most productivity tools track tasks.

CRE tracks **self-deception in planning**.

This project focuses on:
- Behavioral analytics
- Accountability
- Decision accuracy
- Psychological bias detection

It is not just a task manager — it is a commitment evaluation engine.


---

## 🔹 Future Improvements

- Graphical analytics dashboard
- Effort trend visualization
- Weekly bias reports


---

## 🔹 Installation

Clone the repository:

```
git clone https://github.com/Harshitha-Nuthikadi/commitment-reality-engine.git
```

📁 Frontend:

```
cd frontend
npm install
npm run dev
```

📁 Backend:

```
cd backend
npm install
npm start
```

---

## 🔹 Project Status

Active Development  
Built as a behavioral tracking system with bias detection logic.

---

## 🔹 Author

Harshitha Nuthikadi 
Full Stack Developer (Learning & Building)

---

If you are someone who wants to improve planning discipline and eliminate consistent estimation errors — this system is built for that purpose.
