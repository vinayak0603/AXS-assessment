# AXS Video Chat Application

This project is a real-time video and text chat application submitted as an assessment solution. It is designed to facilitate seamless communication between Agents and Customers, featuring role-based access and smart room management. Built using the MERN stack (Node.js, Express, React) along with WebRTC (PeerJS) for video and Socket.io for real-time signaling.

# 🎥 🔴 WATCH THE DEMO

> [!IMPORTANT]
> **Don't miss the video walkthrough! It demonstrates the full functionality of the application.**
>
> 👉 **[CLICK HERE TO WATCH THE DEMO VIDEO](https://res.cloudinary.com/dkoqcp1g9/video/upload/2026-02-16_01-02-06_jccrv4.mp4?_s=vp-3.7.2)** 👈

## 🚀 Features

-   **Real-time Video & Audio**: High-quality video calls using WebRTC.
-   **Instant Text Chat**: Real-time messaging alongside video calls.
-   **Role-Based Access**: Specialized views for Agents and Customers.
-   **Room Management**:
    -   Secure unique room generation.
    -   **Strict Limit**: Maximum 2 users per room.
-   **Smart Meeting Control**:
    -   Use of "Join Screen" to set Name and Role before entering.
    -   **Auto-End**: If one participant leaves, the meeting automatically ends for the other user.
-   **Media Controls**: Toggle Audio/Video with ease.

## 🛠️ Tech Stack

### Frontend (`/client`)
-   **Framework**: [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Real-time Communication**: `socket.io-client`, `peerjs`
-   **Routing**: `react-router-dom`

### Backend (`/server`)
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Signaling**: [Socket.io](https://socket.io/)
-   **Peer Server**: `peer` (ExpressPeerServer) for WebRTC connections

---

## 📖 How to Run Locally

Follow these steps to get the project up and running on your local machine.

### Prerequisites
-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 1. Clone the Repository
```bash
git clone <repository_url>
cd AXS
```

### 2. Setup Server
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm install
```
Start the backend server:
```bash
npm start
```
*The server will run on `http://localhost:5000`*

### 3. Setup Client
Open a **new** terminal window and navigate to the `client` directory:
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```
*The client will usually run on `http://localhost:5173`*

### 4. Application Usage
1.  Open your browser to the client URL (e.g., `http://localhost:5173`).
2.  Click **"Create Instant Meeting"**.
3.  Enter your **Name** and select **Agent**.
4.  Copy the URL and open it in a **new browser window** (or Incognito mode).
5.  Enter a different Name and select **Customer**.
6.  Join the room and test the video/chat!

---

## 📂 Project Structure

```
AXS/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Chat, JoinScreen, Video controls)
│   │   ├── pages/          # Home and Room pages
│   │   └── App.jsx         # Main Router
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── server.js           # Main Entry (Socket.io + PeerJS logic)
│   └── package.json
│
└── README.md               # User Documentation
```

## 🔧 Configuration
-   **Port**: The server defaults to port `5000`. If you change this, update the socket connection URL in `client/src/pages/Room.jsx`.
-   **PeerJS**: The internal PeerJS server runs on the same port/path as the Express server.

