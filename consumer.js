const { Kafka, logLevel } = require("kafkajs")
const { BROKER_LIST, TOPIC, GROUP_ID } = require("./constants")
const { handleBatch } = require("./handle-batch")

const REBALANCE_EVALUATION_INTERVAL_MS = 2000

const sleepMs = ms => new Promise(r => setTimeout(r, ms));
const sleepS = s => sleepMs(s * 1000)

module.exports = {
  consume: async () => {
    const getNewConsumer = async () => {
      const kafka = new Kafka({
        clientId: "test",
        brokers: BROKER_LIST,
        logLevel: logLevel.DEBUG,
        ssl: undefined,
      })

      const consumer = kafka.consumer({ groupId: GROUP_ID })

      await consumer.connect()
      await consumer.subscribe({ topic: TOPIC, fromBeginning: true })
      await consumer.run({
        eachBatch: handleBatch,
        eachBatchAutoResolve: false,
      })

      return consumer
    }

    let consumer = await getNewConsumer()

    await sleepS(360) // sleep 6 minutes

    await consumer.disconnect()

    await sleepS(60) // sleep 1 minute

    consumer = await getNewConsumer()
    

    // // Every 2 seconds, impose a 10% chance of re-joining group
    // const maybeRebalance = async () => {
    //   const shouldRebalance = Math.random() > 0.9
    //   if (shouldRebalance) {
    //     console.info("Rebalancing...")
    //     await consumer.disconnect()
    //     consumer = await getNewConsumer()
    //   }
    //   setTimeout(maybeRebalance, REBALANCE_EVALUATION_INTERVAL_MS)
    // }

    // maybeRebalance()

    process.on("SIGINT", async () => {
      await consumer.disconnect()
      process.exit()
    })
  },
}
