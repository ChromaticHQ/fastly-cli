const chalk = require(`chalk`);

const apiKeyDescription = `Fastly API Key`;
const apiKeyErrorMessage = `[error] ${apiKeyDescription} is required.`;
const apiKeyOption = `-k, --apikey <required>`;
const serviceIdDescription = `Fastly Service ID`;
const serviceIdErrorMessage = `[error] ${serviceIdDescription} is required.`;
const serviceIdOption = `-s, --serviceid <required>`;
const hardPurgeOption = `-h, --hardpurge`;
const hardPurgeDescription = `Hard purge immediately; do not use soft purge option.`;

module.exports = {
  apiKeyPresent (options) {
    if (!options.apikey) {
      console.error(chalk.red(apiKeyErrorMessage));
      return false;
    }
    return true;
  },

  serviceIdPresent (options) {
    if (!options.serviceid) {
      console.error(chalk.red(serviceIdErrorMessage));
      return false;
    }
    return true;
  },

  ResponseHandler (successMessage) {
    return (err, fastlyResponseBody) => {
      if (err) {
        return console.dir(err);
      }

      const prettyjson = require(`prettyjson`);
      const options = {};
      console.log(prettyjson.render(fastlyResponseBody, options));
      if (successMessage) {
        console.log(chalk.green(successMessage));
      }
      process.stdin.pause();
    };
  },

  apiKeyDescription,
  apiKeyOption,
  serviceIdDescription,
  serviceIdOption,
  apiKeyErrorMessage,
  serviceIdErrorMessage,
  hardPurgeOption,
  hardPurgeDescription,
};
