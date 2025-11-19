// server.js
const rclnodejs = require('rclnodejs');
const express = require('express');
const SensorNode = require('./ros/ros_topic');
const http = require("http");
const { initializeWebSocket } = require("./websocket");

const app = express();
const server = http.createServer(app);
initializeWebSocket(server);
const port = 4000;

async function main() {
  const sensor = new SensorNode();
  const node = await sensor.init();

  console.log('Sensor Node is running...');
  rclnodejs.spin(node);
}

main();

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/amr`);
});


async function shutdown() {
  console.log('Bye Bye');
//   await client.close();
  // Call ros2 shutdown method
  SensorNode.shutdown();
  // Gracefully exit the process
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);