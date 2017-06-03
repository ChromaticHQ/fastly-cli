#!/usr/bin/env node
'use strict';

const program = require(`commander`);
const util = require(`./util`);
const Fastly = require(`fastly`);

program
  .version(require(`../package.json`).version);

program
  .command(`purge-all`)
  .description(`Purge all Fastly content.`)
  .alias(`pa`)
  .option(util.apiKeyOption, `${util.apiKeyDescription}.`)
  .option(util.serviceIdOption, `${util.serviceIdDescription}.`)
  .action((options) => { require(`./commands/purge-all`)(options, Fastly, util); });

program
  .command(`purge`)
  .description(`Purge content at specified URL.`)
  .option(util.apiKeyOption, `${util.apiKeyDescription}.`)
  .option(util.serviceIdOption, `${util.serviceIdDescription}.`)
  .option(util.hardPurgeOption, util.hardPurgeDescription)
  .arguments(`<url>`)
  .action((url, options) => { require(`./commands/purge`)(options, Fastly, util, url); });

program
  .command(`purge-key`)
  .description(`Purge content with specified cache key.`)
  .alias(`pk`)
  .option(util.apiKeyOption, `${util.apiKeyDescription}.`)
  .option(util.serviceIdOption, `${util.serviceIdDescription}.`)
  .option(util.hardPurgeOption, util.hardPurgeDescription)
  .arguments(`<key>`)
  .action((key, options) => { require(`./commands/purge-key`)(options, Fastly, util, key); });

program
  .command(`datacenters`)
  .description(`List Fastly datacenters.`)
  .alias(`dcs`)
  .option(util.apiKeyOption, `${util.apiKeyDescription}.`)
  .action((options) => { require(`./commands/datacenters`)(options, Fastly, util); });

program
  .command(`ip-list`)
  .description(`List Fastly public IPs.`)
  .alias(`ipl`)
  .action((options) => { require(`./commands/ip-list`)(options, Fastly, util); });

program
  .command(`edge-check`)
  .description(`Check edge status of content at specified URL.`)
  .alias(`ec`)
  .option(util.apiKeyOption, `${util.apiKeyDescription}.`)
  .arguments(`<url>`)
  .action((url, options) => { require(`./commands/edge-check`)(options, Fastly, util, url); });

program.parse(process.argv);
