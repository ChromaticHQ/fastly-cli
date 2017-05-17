#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const co = require('co');
const prompt = require('co-prompt');

const fastlyApiKeyDescription = 'Fastly API key';
const fastlyServiceIdDescription = 'Fastly service ID';

program
  .version('0.1.0')
  .option('-k, --apikey <apikey>', `${fastlyApiKeyDescription}.`)
  .option('-s, --serviceid <serviceid>', `${fastlyServiceIdDescription}.`)
  .option('-h, --hardpurge', 'Hard purge immediately; do not use soft purge option.')
  .option('-d, --debug', 'Debug mode. Do not execute Fastly API calls.')

program
  .command('purge-all')
  .description('Purge all fastly content.')
  .action(() => {
    co(function *() {
      if (!program.apikey) {
        program.apikey = yield prompt(`${fastlyApiKeyDescription}: `);
      }
      if (!program.serviceid) {
        program.serviceid = yield prompt(`${fastlyServiceIdDescription}: `);
      }
      const fastly = require('fastly')(program.apikey);

      if (program.debug) {
        printDebug(program, null, null);
        return;
      }

      if (program.hardpurge) {
        fastly.purgeAll(program.serviceid, handleFastlyResponse(`All content purged.`));
      }
      else {
        fastly.softPurgeAll(program.serviceid, handleFastlyResponse(`All content purged.`));
      }
    });
  });

program
  .command('purge')
  .description('Purge content at specified specified URL.')
  .arguments('<url>')
  .action((url) => {
    co(function *() {
      if (!program.apikey) {
        program.apikey = yield prompt(`${fastlyApiKeyDescription}: `);
      }
      if (!program.serviceid) {
        program.serviceid = yield prompt(`${fastlyServiceIdDescription}: `);
      }
      const fastly = require('fastly')(program.apikey);

      if (program.debug) {
        printDebug(program, url, null);
        return;
      }

      if (program.hardpurge) {
        fastly.purge(program.serviceid, url, handleFastlyResponse(`Purged URL: ${url}`));
      }
      else {
        fastly.softPurge(program.serviceid, url, handleFastlyResponse(`Purged URL: ${url}`));
      }
    });
  });

program
  .command('purge-key')
  .description('Purge content with specified key.')
  .arguments('<key>')
  .action((key) => {
    co(function *() {
      if (!program.apikey) {
        program.apikey = yield prompt(`${fastlyApiKeyDescription}: `);
      }
      if (!program.serviceid) {
        program.serviceid = yield prompt(`${fastlyServiceIdDescription}: `);
      }
      const fastly = require('fastly')(program.apikey);

      if (program.debug) {
        printDebug(program, null, key);
        return;
      }

      fastly.softPurgeKey(program.serviceid, key, handleFastlyResponse(`Purged key: ${key}`));
    });
  });

program.parse(process.argv);

function handleFastlyResponse(successMessage) {
  return (err, obj) => {
    if (err) {
      return console.dir(err);
    }
    console.dir(obj); // Response body from the Fastly API.
    console.log(chalk.bold.green(successMessage));
    process.stdin.pause();
  }
}

function printDebug(program, url, key) {
  console.log(chalk.bold.cyan(`API key: ${program.apikey}`));
  console.log(chalk.bold.cyan(`Service ID: ${program.serviceid}`));
  console.log(chalk.bold.cyan(`Hard purge: ${program.hardpurge || "false"}`));
  if (url) {
    console.log(chalk.bold.cyan(`URL: ${url}`));
  }
  if (key) {
    console.log(chalk.bold.cyan(`Key: ${key}`));
  }
  process.stdin.pause();
}
