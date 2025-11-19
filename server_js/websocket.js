// websocket.js
const WebSocket = require("ws");
let wss;  // Declare `wss` variable outside of function to share it

function initializeWebSocket(server) {
  wss = new WebSocket.Server({ server });
  console.log("WebSocket server initialized");
  wss.on("connection", (ws) => {
    console.log("WebSocket Client connected");
    
    ws.on("message", (message) => {
      console.log("Received message from WebSocket client:", message);
      ws.send(`Server received: ${message}`);
    });

    ws.on("close", () => {
      console.log("WebSocket Client disconnected");
    });
  });
}

function getWebSocketServer() {
  return wss;
}

function broadcastMessage(message) {
    const dataToSend = typeof message === "string" ? message : JSON.stringify(message);
    // console.log("Broadcasting message:", dataToSend);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(dataToSend);
      }
    });
  }

module.exports = { initializeWebSocket, getWebSocketServer,broadcastMessage};
