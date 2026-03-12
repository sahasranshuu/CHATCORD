# ChatCord

Realtime chat application with rooms using **Node.js**, **Express**, and **Socket.IO**.

## Features

- **Realtime messaging** with Socket.IO
- **Chat rooms** (join a specific room by name)
- **Active users list** per room
- **Message timestamps** via Moment.js
- **Persistence in browser**
  - **User + room** are saved to `localStorage`
  - **Messages** are saved per room in `localStorage`
- **Refresh-safe session**
  - Refreshing the chat page will **not** remove you from the room
  - You only “leave” by **closing the tab/window** (after a short grace period) or using the **Leave** button

## Tech Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML/CSS/Vanilla JS

## Project Structure

- `server.js` — Express + Socket.IO server
- `public/` — static frontend
  - `public/index.html` — join form (username + room)
  - `public/chat.html` — chat UI
  - `public/js/main.js` — client-side Socket.IO + `localStorage` persistence
- `utils/messages.js` — message formatting helper
- `utils/users.js` — in-memory room user tracking

## Getting Started

### Prerequisites

- Node.js (LTS recommended)

### Install

```bash
npm install
```

### Run (production)

```bash
npm start
```

### Run (development with auto-reload)

```bash
npm run dev
```

Then open:

- `http://localhost:3000`

## Usage

1. Open the app in your browser.
2. Enter a **username** and **room**.
3. Send messages in realtime with other users in the same room.

## Data Persistence (localStorage)

The browser stores:

- **User session**: `chatcord_user`
- **Client id** (used to avoid leaving on refresh): `chatcord_client_id`
- **Messages per room**: `chatcord_messages_<room>`

If you want to clear saved data:

1. Open DevTools → Application/Storage → Local Storage
2. Remove the keys above (or clear site data)




```bash
set PORT=3001 && npm start
```

## License

ISC

