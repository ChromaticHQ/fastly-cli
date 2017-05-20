#!/usr/bin/env node
'use strict';

const program = require(`commander`);
const chalk = require(`chalk`);

const fastlyApiKeyDescription = `Fastly API key`;
const fastlyServiceIdDescription = `Fastly service ID`;
const fastlyApiKeyErrorMessage = `[error] ${fastlyApiKeyDescription} is required.`;
const fastlyServiceIdErrorMessage = `[error] ${fastlyServiceIdDescription} is required.`;

program
  .version(require(`../package.json`).version)
  .option(`-k, --apikey <apikey>`, `${fastlyApiKeyDescription}.`)
  .option(`-s, --serviceid <serviceid>`, `${fastlyServiceIdDescription}.`)
  .option(`-h, --hardpurge`, `Hard purge immediately; do not use soft purge option.`);

program
  .command(`purge-all`)
  .description(`Purge all fastly content.`)
  .alias(`pa`)
  .action(() => {
    if (!fastlyApiKeyPresent(program) || !fastlyServiceIdPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

    if (program.hardpurge) {
      fastly.purgeAll(program.serviceid, handleFastlyResponse(`All content purged.`));
    }
    else {
      fastly.softPurgeAll(program.serviceid, handleFastlyResponse(`All content purged.`));
    }
  });

program
  .command(`purge`)
  .description(`Purge content at specified specified URL.`)
  .arguments(`<url>`)
  .action((url) => {
    if (!fastlyApiKeyPresent(program) || !fastlyServiceIdPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

    if (program.hardpurge) {
      fastly.purge(program.serviceid, url, handleFastlyResponse(`Purged URL: ${url}`));
    }
    else {
      fastly.softPurge(program.serviceid, url, handleFastlyResponse(`Purged URL: ${url}`));
    }
  });

program
  .command(`purge-key`)
  .description(`Purge content with specified key.`)
  .alias(`pk`)
  .arguments(`<key>`)
  .action((key) => {
    if (!fastlyApiKeyPresent(program) || !fastlyServiceIdPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

    if (program.hardpurge) {
      fastly.purgeKey(program.serviceid, key, handleFastlyResponse(`Purged key: ${key}`));
    }
    else {
      fastly.softPurgeKey(program.serviceid, key, handleFastlyResponse(`Purged key: ${key}`));
    }
  });

program
  .command(`datacenters`)
  .description(`List Fastly datacenters.`)
  .alias(`dcs`)
  .action(() => {
    if (!fastlyApiKeyPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

    fastly.datacenters(handleFastlyResponse(null));
  });

program
  .command(`ip-list`)
  .description(`List Fastly public IPs.`)
  .alias(`ipl`)
  .action(() => {
    const fastly = require(`fastly`)(program.apikey);

    fastly.publicIpList(handleFastlyResponse(null));
  });

program
  .command(`edge-check`)
  .description(`Check edge status of content at specified URL.`)
  .alias(`ec`)
  .arguments(`<url>`)
  .action((url) => {
    if (!fastlyApiKeyPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

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

function fastlyApiKeyPresent(program) {
  if (!program.apikey) {
    console.error(chalk.red(fastlyApiKeyErrorMessage));
    return false;
  }
  return true;
}

function fastlyServiceIdPresent(program) {
  if (!program.serviceid) {
    console.error(chalk.red(fastlyServiceIdErrorMessage));
    return false;
  }
  return true;
}
