import './main.css';
import nameGenerator from './name-generator';
import isDef from './is-def';


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

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

// Fonction pour obtenir les coordonnées de la souris relatives au canvas
function getCanvasMousePosition(e) {
  const rect = canvas.getBoundingClientRect(); // Rectangle du canvas
  const scaleX = canvas.width / rect.width;     // Échelle horizontale
  const scaleY = canvas.height / rect.height;   // Échelle verticale

  // Coordonnées de la souris relatives au coin supérieur gauche du canvas
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  return { x, y };
}

// Variables pour stocker les informations du dessin en cours
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
  if (!isDrawing) return; // Arrêter la fonction si nous ne sommes pas en train de dessiner

  const { x, y } = getCanvasMousePosition(e); // Obtenir les coordonnées de la souris sur le canvas

  // Dessiner une ligne du dernier point à celui-ci
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(x, y);
  context.stroke();
  // couleur du trait
  context.strokeStyle = decodeURIComponent(wsname);
  // Mettre à jour les coordonnées du dernier point
  lastX = x;
  lastY = y;
  console.log(lastX, lastY)
  var data = {
    x: lastX,
    y: lastY,
    color: decodeURIComponent(wsname)
  };
  //emit the message to the server
  ws.send(JSON.stringify(data));
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const { x, y } = getCanvasMousePosition(e);
  lastX = x;
  lastY = y;
});

