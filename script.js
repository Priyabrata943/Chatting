// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC5FmiUVcFHfYhu6AVSGNcnCKcULUZ2Vpo",
  authDomain: "chatting-e2597.firebaseapp.com",
  projectId: "chatting-e2597",
  storageBucket: "chatting-e2597.appspot.com",
  messagingSenderId: "498567847234",
  appId: "1:498567847234:web:e4c112cfc78e03cf58fcdb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let username = "";
let typingTimeout;

function setUsername() {
  const input = document.getElementById("usernameInput");
  username = input.value.trim();
  if (username) {
    document.getElementById("usernamePrompt").style.display = "none";
    document.getElementById("chatContainer").style.display = "flex";
  }
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (text) {
    db.collection("messages").add({
      username,
      text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    input.value = "";
    db.collection("typing").doc("status").set({ user: "" });
  }
}

function sendTyping() {
  db.collection("typing").doc("status").set({ user: username });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    db.collection("typing").doc("status").set({ user: "" });
  }, 1000);
}

// Show messages in real time
db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot(snapshot => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.textContent = `${data.username}: ${data.text}`;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

// Typing indicator
db.collection("typing").doc("status")
  .onSnapshot(doc => {
    const typing = doc.data()?.user;
    const typingIndicator = document.getElementById("typingIndicator");
    typingIndicator.textContent = typing && typing !== username ? `${typing} is typing...` : "";
  });
