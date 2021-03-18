module.exports = {
  BROKER_LIST: ["localhost:9092"],
  DELAY_PER_MESSAGE_MS: 250,
  GROUP_ID: "group.50",
  NUM_MESSAGES: 1200,
  OUT_FILE: "results.csv",
  PARTITIONS: 6,
  TOPIC: "rebalance.test.50",
}
