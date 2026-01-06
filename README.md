# 💬 Fullstack Chat Application

A modern **full‑stack real‑time chat application** built using **MERN stack + Socket.IO**, supporting user authentication, real‑time messaging, and media uploads. The project is deployed on **Render** with a production‑ready build setup.

---

## 🚀 Live Demo

🔗 **Live URL:** [https://fullstack-chatapp-wudv.onrender.com](https://fullstack-chatapp-wudv.onrender.com)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS + DaisyUI
* Socket.IO Client
* Axios

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.IO
* JWT Authentication
* bcrypt.js
* Multer
* Cloudinary

### Deployment & Tools

* Render (Frontend + Backend)
* MongoDB Atlas
* GitHub

---

## ✨ Features

* 🔐 User Authentication (JWT + Cookies)
* 💬 Real‑time Chat using WebSockets
* 🟢 Online / Offline User Status
* 📩 Message Persistence (MongoDB)
* 🖼️ Image Uploads (Cloudinary)
* 🔄 Live Message Updates
* 📱 Responsive UI

---

## 📂 Project Structure

```
fullstack-ChatApp/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── socket/
│   │   ├── utils/
│   │   └── index.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)

```
PORT=5001
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 🧪 Local Development

### 1️⃣ Clone the repository

```
git clone https://github.com/Parmarkuldeep117/fullstack-ChatApp
cd fullstack-ChatApp
```

### 2️⃣ Install dependencies

```
npm install --prefix Backend
npm install --prefix Frontend
```

### 3️⃣ Run the project

**Backend**

```
npm run dev --prefix Backend
```

**Frontend**

```
npm run dev --prefix Frontend
```

---

## 📦 Production Build

```
npm run build --prefix Frontend
npm run start --prefix Backend
```

---

## 🧠 Key Learnings

* Real‑time communication with Socket.IO
* JWT authentication with HTTP‑only cookies
* Handling CORS & secure cookies in production
* Deploying full‑stack apps on Render
* Debugging production‑level issues

---

## 🧑‍💻 Author

**Kuldeep Parmar**
🔗 GitHub: [https://github.com/Parmarkuldeep117](https://github.com/Parmarkuldeep117)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub — it really helps!

## 📸 Screenshots

> Replace the placeholders below with your uploaded image URLs (GitHub, Imgur, Cloudinary, etc.)

### 🔐 Authentication (Login / Signup)

![Login Screenshot](https://github.com/Parmarkuldeep117/fullstack-ChatApp/issues/1#issue-3784784960)
![Signup Screenshot](https://github.com/Parmarkuldeep117/fullstack-ChatApp/issues/2#issue-3784788233)

### 💬 Chat Interface

![Chat UI Screenshot](https://github.com/Parmarkuldeep117/fullstack-ChatApp/issues/6#issue-3784818389)

### 🧑‍🤝‍🧑 User List / Conversations

![User List Screenshot](https://github.com/Parmarkuldeep117/fullstack-ChatApp/issues/3#issue-3784789690)
![User Profile Screenshot](https://github.com/Parmarkuldeep117/fullstack-ChatApp/issues/4#issue-3784790526)
![Settings Screenshot](https://github.com/Parmarkuldeep117/fullstack-ChatApp/issues/5#issue-3784792124)

