// sensor_node.js
const rclnodejs = require('rclnodejs');
const { broadcastMessage } = require("../websocket");

class SensorNode {
  constructor() {
    this.node = null;
    this.publisher = null;
    this.Float32 = rclnodejs.require('std_msgs/msg/Float32');
    this.counter = 0.0;
  }

  async init() {
    await rclnodejs.init();
    this.node = new rclnodejs.Node('sensor_node');

    // Publisher
    this.publisher = this.node.createPublisher(this.Float32, 'sensor_value');

    // Subscriber
    this.node.createSubscription(
      this.Float32,
      'sensor_value',
      (msg) => {
        const sensorValue = msg.data;
        console.log(`[SUB] Received: ${msg.data}`);
        const message = { 
          topic: 'sensor_value', 
          data: sensorValue 
        };

        // console.log(`[WS] Broadcasting: ${JSON.stringify(message)}`);
        // broadcastMessage(message);
      }
    );

    // Auto publish every second
    this.node.createTimer(1000, () => this.publishValue());

    return this.node;
  }

  publishValue() {
    const msg = new this.Float32();
    msg.data = this.counter;

    this.publisher.publish(msg);
    console.log(`[PUB] Published: ${msg.data}`);

    this.counter += 0.5;
  }
  shutdown() {
      if (this.node) {
        this.node.destroy();
        rclnodejs.shutdown();
        console.log('TopicHandler and node shut down.');
      }
    }
}

module.exports = SensorNode;
