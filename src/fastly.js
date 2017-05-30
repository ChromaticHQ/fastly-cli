#!/usr/bin/env node
'use strict';

const program = require(`commander`);
const chalk = require(`chalk`);

const fastlyApiKeyDescription = `Fastly API key`;
const fastlyApiKeyOption = `-k, --apikey <required>`;
const fastlyApiKeyErrorMessage = `[error] ${fastlyApiKeyDescription} is required.`;

const fastlyServiceIdDescription = `Fastly service ID`;
const fastlyServiceIdOption = `-s, --serviceid <required>`;
const fastlyServiceIdErrorMessage = `[error] ${fastlyServiceIdDescription} is required.`;

const fastlyHardPurgeOption = `-h, --hardpurge`;
const fastlyHardPurgeDescription = `Hard purge immediately; do not use soft purge option.`;

program
  .version(require(`../package.json`).version)

program
  .command(`purge-all`)
  .description(`Purge all Fastly content.`)
  .alias(`pa`)
  .option(fastlyApiKeyOption, `${fastlyApiKeyDescription}.`)
  .option(fastlyServiceIdOption, `${fastlyServiceIdDescription}.`)
  .option(fastlyHardPurgeOption, fastlyHardPurgeDescription)
  .action((options) => {
    if (!fastlyApiKeyPresent(options) || !fastlyServiceIdPresent(options)) {
      return;
    }
    const fastly = require(`fastly`)(options.apikey);

    if (options.hardpurge) {
      fastly.purgeAll(options.serviceid, handleFastlyResponse(`All content purged.`));
    }
    else {
      fastly.softPurgeAll(options.serviceid, handleFastlyResponse(`All content purged.`));
    }
  });

program
  .command(`purge`)
  .description(`Purge content at specified specified URL.`)
  .option(fastlyApiKeyOption, `${fastlyApiKeyDescription}.`)
  .option(fastlyServiceIdOption, `${fastlyServiceIdDescription}.`)
  .option(fastlyHardPurgeOption, fastlyHardPurgeDescription)
  .arguments(`<url>`)
  .action((url, options) => {
    if (!fastlyApiKeyPresent(options) || !fastlyServiceIdPresent(options)) {
      return;
    }
    const fastly = require(`fastly`)(options.apikey);

    if (options.hardpurge) {
      fastly.purge(options.serviceid, url, handleFastlyResponse(`Purged URL: ${url}`));
    }
    else {
      fastly.softPurge(options.serviceid, url, handleFastlyResponse(`Purged URL: ${url}`));
    }
  });

program
  .command(`purge-key`)
  .description(`Purge content with specified key.`)
  .alias(`pk`)
  .option(fastlyApiKeyOption, `${fastlyApiKeyDescription}.`)
  .option(fastlyServiceIdOption, `${fastlyServiceIdDescription}.`)
  .option(fastlyHardPurgeOption, fastlyHardPurgeDescription)
  .arguments(`<key>`)
  .action((key, options) => {
    if (!fastlyApiKeyPresent(options) || !fastlyServiceIdPresent(options)) {
      return;
    }
    const fastly = require(`fastly`)(options.apikey);

    if (options.hardpurge) {
      fastly.purgeKey(options.serviceid, key, handleFastlyResponse(`Purged key: ${key}`));
    }
    else {
      fastly.softPurgeKey(options.serviceid, key, handleFastlyResponse(`Purged key: ${key}`));
    }
  });

program
  .command(`datacenters`)
  .description(`List Fastly datacenters.`)
  .alias(`dcs`)
  .option(fastlyApiKeyOption, `${fastlyApiKeyDescription}.`)
  .action((options) => {
    if (!fastlyApiKeyPresent(options)) {
      return;
    }
    const fastly = require(`fastly`)(options.apikey);

    fastly.datacenters(handleFastlyResponse(null));
  });

program
  .command(`ip-list`)
  .description(`List Fastly public IPs.`)
  .alias(`ipl`)
  .action(() => {
    const fastly = require(`fastly`)();

    fastly.publicIpList(handleFastlyResponse(null));
  });

program
  .command(`edge-check`)
  .description(`Check edge status of content at specified URL.`)
  .alias(`ec`)
  .option(fastlyApiKeyOption, `${fastlyApiKeyDescription}.`)
  .arguments(`<url>`)
  .action((url, options) => {
    if (!fastlyApiKeyPresent(options)) {
      return;
    }
    const fastly = require(`fastly`)(options.apikey);

    fastly.edgeCheck(url, handleFastlyResponse(null));
  });

program.parse(process.argv);

function handleFastlyResponse(successMessage) {
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
}

function fastlyApiKeyPresent(options) {
  if (!options.apikey) {
    console.error(chalk.red(fastlyApiKeyErrorMessage));
    return false;
  }
  return true;
}

function fastlyServiceIdPresent(options) {
  if (!options.serviceid) {
    console.error(chalk.red(fastlyServiceIdErrorMessage));
    return false;
  }
  return true;
}
