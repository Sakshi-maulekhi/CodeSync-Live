# CodeSync

A real-time collaborative coding platform where multiple users can join coding rooms, write code together, and execute code in real time. CodeSync is designed to improve collaboration for coding practice, teaching and team programming sessions.

---
## 🔗 Live Demo
[CodeSync Live](https://code-sync-live-jrnx.vercel.app/)

## 🚀 Features

* 🔴 Real-time collaborative code editor
* 👥 Multi-user room system
* ⚡ Instant code synchronization
* ▶️ Code execution support
* 🎨 Clean and responsive UI
* 🔐 Room-based collaboration
* 📈 Personalized coding journey dashboard
* 🔥 Track solved problems and coding streaks
* ⏱️ Time spent coding and submission history

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO

### Database

* MongoDB

---
## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone <your-repository-link>
cd CodeSync
```

### 2️⃣ Install dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🌍 Environment Variables

Create a `.env` file inside the server folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 📸 Key Functionalities

### Real-Time Collaboration

Users can join the same room and edit code together instantly using Socket.IO.

### Live Code Sharing

Multiple users can join the same room and collaborate on code in real time using Socket.IO.

### Code Synchronization

All connected users see updates in real time without refreshing the page.

### Responsive UI

Modern and responsive interface built with Tailwind CSS.


