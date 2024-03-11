import './main.css';
import nameGenerator from './name-generator';
import isDef from './is-def';
  
  

// Store/retrieve the name in/from a cookie.
const cookies = document.cookie.split(';');
console.log(cookies)
let wsname = cookies.find(function(c) {
  if (c.match(/wsname/) !== null) return true;
  return false;
});
if (isDef(wsname)) {
  wsname = wsname.split('=')[1];
} else {
  wsname = nameGenerator();
  document.cookie = "wsname=" + encodeURIComponent(wsname);
}

// Set the name in the header
document.querySelector('header>p').textContent = decodeURIComponent(wsname);

// Create a WebSocket connection to the server
//const ws = new WebSocket("ws://"+window.location.host+"/socket");
const ws = new WebSocket("ws://localhost:1234");

// We get notified once connected to the server
ws.onopen = (event) => {
  console.log("We are connected.");
};

// Listen to messages coming from the server. When it happens, create a new <li> and append it to the DOM.
const messages = document.querySelector('#messages');
let line;
ws.onmessage = (event) => {
  line = document.createElement('li');
  line.textContent = event.data;
  messages.appendChild(line);
};

// Retrieve the input element. Add listeners in order to send the content of the input when the "return" key is pressed.
function sendMessage(event) {
  event.preventDefault();
  event.stopPropagation();
  if (sendInput.value !== '') {
    // Send data through the WebSocket
    ws.send(sendInput.value);
    sendInput.value = '';
  }
}
const sendForm = document.querySelector('form');
const sendInput = document.querySelector('form input');
sendForm.addEventListener('submit', sendMessage, true);
sendForm.addEventListener('blur', sendMessage, true);
