# 🗨️ Realtime Chat App

A full-stack, real-time chat application enabling users to securely exchange text and image messages, with live online indicators. Built with the MERN stack, enhanced with Zustand for state management, and Socket.IO for real-time communication.

## 🔗 Live Demo

👉 [YouChat App](https://youchat-app.up.railway.app/login)

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Zustand
- **Backend:** Node.js, Express.js
- **Real-Time Communication:** Socket.IO
- **Authentication:** JWT (JSON Web Token)
- **Media Uploads:** Cloudinary
- **Database:** MongoDB (Mongoose)

## ✨ Features

- 🔐 Secure user authentication with JWT
- 💬 Real-time one-on-one chat with Socket.IO
- 🖼️ Upload and send images via Cloudinary
- 🟢 Online/offline presence indicators
- 🌙 Light and dark theme toggle
- 📱 Fully responsive design for all devices

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Atlas or local)
- Cloudinary account

---

### 🧪 Backend Setup

```bash
cd backend
npm install
npm run dev

Create a .env file inside backend/:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Create a .env file inside frontend/:

ini
Copy
Edit
VITE_API_URL=http://localhost:5000

🗂️ Folder Structure
arduino
Copy
Edit
chat-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.jsx
│   └── vite.config.js
└── README.md
🚀 Deployment
Frontend: Netlify / Vercel

Backend: Railway / Render

Set all environment variables in your hosting dashboard

