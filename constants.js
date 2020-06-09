module.exports = {
  BROKER_LIST: ["kafka.cluster.local:31090"],
  DELAY_PER_MESSAGE_MS: 250,
  GROUP_ID: "group.32",
  NUM_MESSAGES: 1200,
  OUT_FILE: "results.csv",
  PARTITIONS: 6,
  TOPIC: "rebalance.test.32",
};
