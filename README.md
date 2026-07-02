# ChatApp — Real-Time Chat Application

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, **Socket.io**, and **MongoDB**.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Socket.io](https://img.shields.io/badge/Socket.io-4-black) ![MongoDB](https://img.shields.io/badge/MongoDB-8-brightgreen)

---

## ✨ Features

### Core Features
- **Real-time messaging** — Messages are delivered instantly using Socket.io (no polling)
- **Chat history** — Messages persist in MongoDB and are loaded on refresh
- **Message timestamps** — Each message displays its send time
- **REST APIs** — Send messages and fetch history via REST endpoints
- **Responsive design** — Works on desktop and mobile browsers

### Bonus Features
- **Username-based login** — Simple authentication (no password required)
- **Typing indicator** — See when someone is typing with animated dots
- **Online/offline status** — Real-time user presence with green/gray status dots
- **Message read/delivered status** — Checkmarks show sent (✓), delivered (✓✓ blue), and read (✓✓ green)
- **MongoDB storage** — All messages persist across server restarts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Vanilla CSS |
| **Backend** | Node.js, Express |
| **Real-Time** | Socket.io |
| **Database** | MongoDB (Mongoose ODM) |
| **Styling** | Custom CSS (Dark theme with glassmorphism) |
| **Font** | Inter (Google Fonts) |

---

## 📁 Project Structure

```
ChatApp/
├── server/                      # Backend
│   ├── package.json
│   ├── .env / .env.example
│   └── src/
│       ├── index.js             # Entry — Express + Socket.io + MongoDB
│       ├── config/db.js         # MongoDB connection
│       ├── models/
│       │   ├── Message.js       # Message schema
│       │   └── User.js          # User schema
│       ├── routes/
│       │   ├── messageRoutes.js # Message REST endpoints
│       │   └── authRoutes.js    # Auth REST endpoints
│       ├── controllers/
│       │   ├── messageController.js
│       │   └── authController.js
│       └── socket/
│           └── socketHandler.js # Socket.io event handlers
│
├── client/                      # Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx             # React entry
│       ├── App.jsx              # Root component with auth gating
│       ├── index.css            # Design system (dark theme)
│       ├── context/             # React Contexts
│       │   ├── SocketContext.jsx
│       │   └── AuthContext.jsx
│       ├── pages/               # Page components
│       │   ├── Login.jsx
│       │   └── Chat.jsx
│       ├── components/          # Reusable UI components
│       │   ├── MessageBubble.jsx
│       │   ├── MessageInput.jsx
│       │   ├── MessageList.jsx
│       │   ├── ChatHeader.jsx
│       │   ├── TypingIndicator.jsx
│       │   ├── OnlineUsers.jsx
│       │   └── Sidebar.jsx
│       ├── hooks/               # Custom React hooks
│       │   ├── useSocket.js
│       │   └── useChat.js
│       ├── services/api.js      # REST API calls
│       └── utils/formatTime.js  # Timestamp formatting
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18 or later
- **MongoDB** — Local installation or [MongoDB Atlas](https://www.mongodb.com/atlas/database) free tier
- **npm** (comes with Node.js)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ChatApp
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI:
# MONGODB_URI=mongodb://localhost:27017/chatapp  (local)
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chatapp  (Atlas)

# Start the backend (development mode with auto-reload)
npm run dev

# Or for production:
npm start
```

The server will start on **http://localhost:5000**.

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The client will start on **http://localhost:5173**.

### 4. Open the App

1. Open **http://localhost:5173** in your browser
2. Enter a username and click "Join Chat"
3. Open a second browser tab/window with a different username
4. Start chatting! Messages will appear instantly in both tabs

---

## ⚙️ Environment Variables

### Server (`server/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/chatapp` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/messages?page=1&limit=50` | Fetch paginated chat history |
| `POST` | `/api/messages` | Send a new message `{ sender, text }` |
| `PATCH` | `/api/messages/:id/status` | Update message status `{ status }` |
| `POST` | `/api/auth/login` | Login with username `{ username }` |
| `GET` | `/api/auth/users` | Get online users list |
| `GET` | `/api/health` | Health check |

---

## 🔌 Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `user_join` | Client → Server | `username` | User joins the chat |
| `send_message` | Client → Server | `{ sender, text }` | Send a message |
| `new_message` | Server → Client | Message object | Broadcast new message |
| `typing` | Bidirectional | `username` | User started typing |
| `stop_typing` | Bidirectional | `username` | User stopped typing |
| `user_status` | Server → Client | `[{ username, socketId }]` | Online users list |
| `message_read` | Client → Server | `{ messageIds, reader }` | Mark messages as read |
| `message_status_update` | Server → Client | `{ messageId, status }` | Message status changed |

---

## 🎨 Design Decisions

1. **Dark Theme with Glassmorphism**: Chose a premium dark UI with glass panels and gradient accents for a modern, immersive chat experience.

2. **Socket.io for Real-Time**: All messages are sent via Socket.io `send_message` events for instant delivery. REST APIs serve as fallback for history loading.

3. **React Context for State**: Used React Context API (not Redux) for Socket.io and Auth state to keep the app lightweight.

4. **Custom Hooks Pattern**: Extracted all chat logic into `useChat` and `useSocket` hooks for clean separation of concerns and reusability.

5. **Auth-Gated Socket Connection**: Socket.io connection is only established after login, preventing unnecessary connections for unauthenticated users.

6. **Optimistic UI**: Messages appear instantly in the sender's view while being confirmed by the server in the background.

7. **Vite Proxy**: Development proxy routes `/api` and `/socket.io` to the backend, eliminating CORS issues during development.

---

## 📝 Assumptions

1. **Single Chat Room**: All users share one global chat room (no private messaging or channels).
2. **Dummy Authentication**: No password required — usernames are unique identifiers. This is not production-secure.
3. **MongoDB Required**: The app requires MongoDB for message persistence. Without it, the server starts but messages won't persist.
4. **Modern Browser**: The UI uses CSS features like `backdrop-filter` and CSS custom properties that require modern browsers.
5. **Local Development**: The setup assumes local development with the frontend proxy handling API routing.

---

## 📋 Scripts

### Server
| Script | Command | Description |
|---|---|---|
| `npm start` | `node src/index.js` | Start production server |
| `npm run dev` | `nodemon src/index.js` | Start dev server with auto-reload |

### Client
| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Start development server |
| `npm run build` | `vite build` | Build for production |
| `npm run preview` | `vite preview` | Preview production build |

---

## 📄 License

MIT
