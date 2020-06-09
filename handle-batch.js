const { appendLine, delayMs } = require("./util");
const { DELAY_PER_MESSAGE_MS, OUT_FILE } = require("./constants");

const writeMessage = async ({ partition, offset }) => {
  console.log("Processing: ", { partition, offset });
  await appendLine({ file: OUT_FILE, text: `${partition},${offset}` });
};

module.exports = {
  handleBatch: async (args) => {
    const { batch } = args;
    const { topic, partition } = batch;

    const tryCommit = () =>
      args.commitOffsetsIfNecessary(args.uncommittedOffsets());

    for (const message of batch.messages) {
      if (!args.isRunning()) {
        break;
      }

      try {
        await delayMs(DELAY_PER_MESSAGE_MS);
        await writeMessage({ partition, offset: message.offset });
        args.resolveOffset(message.offset);
      } catch (err) {
        console.error(`Error on partition: ${partition}`, { err });
        // In case of errors, commit the previously consumed offsets
        await tryCommit();
        throw err;
      }

      try {
        await args.heartbeat();
      } catch (err) {
        console.error(
          `HEARTBEAT ERROR - Partition ${partition} - Offset: ${message.offset}`,
          err
        );

        if (err.type === "REBALANCE_IN_PROGRESS") {
          await tryCommit();
        }

        throw err;
      }
    }

    await tryCommit();
  },
};
