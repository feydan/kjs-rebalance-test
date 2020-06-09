const { appendFile } = require("fs");

module.exports = {
  appendLine: ({ file, text }) =>
    new Promise((resolve, reject) => {
      appendFile(file, `${text}\n`, (err) => (err ? reject(err) : resolve()));
    }),
  delayMs: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};
