const chalk = require(`chalk`);

const apiKeyDescription = `Fastly API Key`;
const serviceIdDescription = `Fastly Service ID`;
const apiKeyErrorMessage = `[error] ${apiKeyDescription} is required.`;
const serviceIdErrorMessage = `[error] ${serviceIdDescription} is required.`;

module.exports = {
  apiKeyPresent (program) {
    if (!program.apikey) {
      console.error(chalk.red(apiKeyErrorMessage));
      return false;
    }
    return true;
  },

  serviceIdPresent (program) {
    if (!program.serviceid) {
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
  serviceIdDescription,
  apiKeyErrorMessage,
  serviceIdErrorMessage,
};
