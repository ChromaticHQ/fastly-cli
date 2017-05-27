#!/usr/bin/env node
'use strict';

const program = require(`commander`);
const util = require(`./lib/util`);
const Fastly = require(`fastly`);

program
  .version(require(`../package.json`).version)
  .option(`-k, --apikey <apikey>`, `${util.apiKeyDescription}.`)
  .option(`-s, --serviceid <serviceid>`, `${util.serviceIdDescription}.`)
  .option(`-h, --hardpurge`, `Hard purge immediately; do not use soft purge option.`);

program
  .command(`purge-all`)
  .description(`Purge all Fastly content.`)
  .alias(`pa`)
  .action(() => { require(`./lib/purge-all`)(program, Fastly, util); });

program
  .command(`purge`)
  .description(`Purge content at specified specified URL.`)
  .arguments(`<url>`)
  .action((url) => {
    if (!util.apiKeyPresent(program) || !util.serviceIdPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

    if (program.hardpurge) {
      fastly.purge(program.serviceid, url, util.ResponseHandler(`Purged URL: ${url}`));
    }
    else {
      fastly.softPurge(program.serviceid, url, util.ResponseHandler(`Purged URL: ${url}`));
    }
  });

program
  .command(`purge-key`)
  .description(`Purge content with specified key.`)
  .alias(`pk`)
  .arguments(`<key>`)
  .action((key) => {
    if (!util.apiKeyPresent(program) || !util.serviceIdPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

    if (program.hardpurge) {
      fastly.purgeKey(program.serviceid, key, util.ResponseHandler(`Purged key: ${key}`));
    }
    else {
      fastly.softPurgeKey(program.serviceid, key, util.ResponseHandler(`Purged key: ${key}`));
    }
  });

program
  .command(`datacenters`)
  .description(`List Fastly datacenters.`)
  .alias(`dcs`)
  .action(() => {
    if (!util.apiKeyPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

    fastly.datacenters(util.ResponseHandler(null));
  });

program
  .command(`ip-list`)
  .description(`List Fastly public IPs.`)
  .alias(`ipl`)
  .action(() => {
    const fastly = require(`fastly`)(program.apikey);

    fastly.publicIpList(util.ResponseHandler(null));
  });

program
  .command(`edge-check`)
  .description(`Check edge status of content at specified URL.`)
  .alias(`ec`)
  .arguments(`<url>`)
  .action((url) => {
    if (!util.apiKeyPresent(program)) {
      return;
    }
    const fastly = require(`fastly`)(program.apikey);

    fastly.edgeCheck(url, util.ResponseHandler(null));
  });

program.parse(process.argv);
