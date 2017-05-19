#!/usr/bin/env node
'use strict';

const program = require(`commander`);
const chalk = require(`chalk`);
const co = require(`co`);
const coPrompt = require(`co-prompt`);

const fastlyApiKeyDescription = `Fastly API key`;
const fastlyServiceIdDescription = `Fastly service ID`;

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
    co(function *() {
      if (!program.apikey) {
        program.apikey = yield coPrompt(`${fastlyApiKeyDescription}: `);
      }
      if (!program.serviceid) {
        program.serviceid = yield coPrompt(`${fastlyServiceIdDescription}: `);
      }
      const fastly = require(`fastly`)(program.apikey);

      if (program.hardpurge) {
        fastly.purgeAll(program.serviceid, handleFastlyResponse(`All content purged.`));
      }
      else {
        fastly.softPurgeAll(program.serviceid, handleFastlyResponse(`All content purged.`));
      }
    });
  });

program
  .command(`purge`)
  .description(`Purge content at specified specified URL.`)
  .arguments(`<url>`)
  .action((url) => {
    co(function *() {
      if (!program.apikey) {
        program.apikey = yield coPrompt(`${fastlyApiKeyDescription}: `);
      }
      if (!program.serviceid) {
        program.serviceid = yield coPrompt(`${fastlyServiceIdDescription}: `);
      }
      const fastly = require(`fastly`)(program.apikey);

      if (program.hardpurge) {
        fastly.purge(program.serviceid, url, handleFastlyResponse(`Purged URL: ${url}`));
      }
      else {
        fastly.softPurge(program.serviceid, url, handleFastlyResponse(`Purged URL: ${url}`));
      }
    });
  });

program
  .command(`purge-key`)
  .description(`Purge content with specified key.`)
  .alias(`pk`)
  .arguments(`<key>`)
  .action((key) => {
    co(function *() {
      if (!program.apikey) {
        program.apikey = yield coPrompt(`${fastlyApiKeyDescription}: `);
      }
      if (!program.serviceid) {
        program.serviceid = yield coPrompt(`${fastlyServiceIdDescription}: `);
      }
      const fastly = require(`fastly`)(program.apikey);

      if (program.hardpurge) {
        fastly.purgeKey(program.serviceid, key, handleFastlyResponse(`Purged key: ${key}`));
      }
      else {
        fastly.softPurgeKey(program.serviceid, key, handleFastlyResponse(`Purged key: ${key}`));
      }
    });
  });

program
  .command(`datacenters`)
  .description(`List Fastly datacenters.`)
  .alias(`dcs`)
  .action(() => {
    co(function *() {
      if (!program.apikey) {
        program.apikey = yield coPrompt(`${fastlyApiKeyDescription}: `);
      }
      const fastly = require(`fastly`)(program.apikey);

      fastly.datacenters(handleFastlyResponse(null));
    });
  });

program
  .command(`ip-list`)
  .description(`List Fastly public IPs.`)
  .alias(`ips`)
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
    co(function *() {
      if (!program.apikey) {
        program.apikey = yield coPrompt(`${fastlyApiKeyDescription}: `);
      }
      const fastly = require(`fastly`)(program.apikey);

      fastly.edgeCheck(url, handleFastlyResponse(null));
    });
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
      console.log(chalk.bold.green(successMessage));
    }
    process.stdin.pause();
  };
}
