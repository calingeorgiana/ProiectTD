const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const newuser = document.getElementById("user_register");


// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  // am folosit querystring pentru a lua username-ul si room-ul din URL
  ignoreQueryPrefix: true,
});

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
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down la fiecare mesaj trimis
});

socket.on("messageSend", (message) => {
  console.log(message);
  outputMessage1(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down la fiecare mesaj trimis
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value; // se preia mesajul introdus

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg); // se trimite serverului

  // Clear input
  const a = document.querySelector(".emojionearea-editor");
  a.innerHTML = "";
  e.target.elements.msg.value = ""; // eliberam text-box-ul unde am introdus text
  e.target.elements.msg.focus();
});

// Output message to chat field   --> aici se face postarea mesajelor
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p"); // se creaza un paragraf pentru fiecare mesaj trimis
  para.classList.add("text");
  para.innerText = message.text; // se paseaza textul in paragraf
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

function outputMessage1(message) {
  const div = document.createElement("div");
  div.classList.add("messageSend");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p"); // se creaza un paragraf pentru fiecare mesaj trimis
  para.classList.add("text");
  para.innerText = message.text; // se paseaza textul in paragraf
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to chat side-bar
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to chat side-bar
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

