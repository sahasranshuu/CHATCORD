const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Local storage keys
const STORAGE_USER_KEY = "chatcord_user";
const STORAGE_MESSAGES_PREFIX = "chatcord_messages_";

function saveCurrentUser(username, room) {
  if (!username || !room) return;
  const payload = { username, room };
  try {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("Unable to save user to localStorage", e);
  }
}

function saveMessage(room, message) {
  if (!room || !message) return;
  const key = `${STORAGE_MESSAGES_PREFIX}${room}`;
  try {
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push(message);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    console.error("Unable to save message to localStorage", e);
  }
}

function loadMessages(room) {
  if (!room) return [];
  const key = `${STORAGE_MESSAGES_PREFIX}${room}`;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Unable to load messages from localStorage", e);
    return [];
  }
}

// Get username and room from URL (or fall back to localStorage)
let { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

if (!username || !room) {
  try {
    const storedUserRaw = localStorage.getItem(STORAGE_USER_KEY);
    if (storedUserRaw) {
      const storedUser = JSON.parse(storedUserRaw);
      if (storedUser.username && storedUser.room) {
        username = storedUser.username;
        room = storedUser.room;
        // Keep URL in sync so server-side logic still works
        const search = Qs.stringify({ username, room });
        const newUrl = `${window.location.pathname}?${search}`;
        window.history.replaceState(null, "", newUrl);
      }
    }
  } catch (e) {
    console.error("Unable to read user from localStorage", e);
  }
}

// Persist current user and hydrate previous messages for this room
saveCurrentUser(username, room);
const existingMessages = loadMessages(room);
existingMessages.forEach((msg) => outputMsg(msg));
if (existingMessages.length > 0) {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMsg(message);
  saveMessage(room, message);

  //Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Meassage Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit("chatMessage", msg);

  //Clear Input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM

function outputMsg(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  } else {
  }
});
