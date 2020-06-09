const { Kafka } = require("kafkajs");
const { BROKER_LIST, TOPIC, PARTITIONS, NUM_MESSAGES } = require("./constants");

module.exports = {
  seedIfNecessary: async () => {
    const kafka = new Kafka({
      clientId: "test-producer",
      brokers: BROKER_LIST,
    });

    const admin = kafka.admin();
    await admin.connect();

    const wasJustCreated = await admin.createTopics({
      topics: [{ topic: TOPIC, numPartitions: PARTITIONS }],
    });

    await admin.disconnect();

    // Don't produce unless its a fresh creation (first runner wins)
    if (!wasJustCreated) {
      console.info("Topic already exists, not seeding");
      return;
    }

    console.info(`Seeding topic '${TOPIC}' with ${NUM_MESSAGES} messages...`);

    const producer = kafka.producer();
    await producer.connect();

    const messages = Array(NUM_MESSAGES)
      .fill()
      .map(() => ({
        key: Math.random().toString(),
        value: "X",
      }));

    await producer.send({
      topic: TOPIC,
      messages,
    });
  },
};
