const { seedIfNecessary } = require("./seed");
const { consume } = require("./consumer");

const run = async () => {
  await seedIfNecessary();
  await consume();
};

run();
