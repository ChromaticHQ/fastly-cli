# fastly-cli
[![Build Status](https://travis-ci.org/ChromaticHQ/fastly-cli.svg?branch=master)](https://travis-ci.org/ChromaticHQ/fastly-cli) [![dependencies Status](https://david-dm.org/ChromaticHQ/fastly-cli/status.svg)](https://david-dm.org/ChromaticHQ/fastly-cli)

Command line interface for interacting with the [Fastly](http://www.fastly.com/) API written in NodeJS.

### Installation

#### via yarn
`$ yarn global add fastly-cli`

#### via npm
`$ npm install -g fastly-cli`

### Basic Usage
#### Purge All Content
`fastly purge-all -k YOUR-API-KEY -s YOUR-SERVICE-ID`

#### Purge URL
`fastly purge -k YOUR-API-KEY -s YOUR-SERVICE-ID https://your-url-to-purge.com/path`

#### Purge Key
`fastly purge-key -k YOUR-API-KEY -s YOUR-SERVICE-ID YOUR-KEY-TO-PURGE`

#### List Datacenters
`fastly datacenters -k YOUR-API-KEY`

#### List Public IPs
List public IP addresses for Fastly network.

`fastly ip-list`

#### Edge Check
Retrieve headers and associated data of the content for a particular URL from each Fastly edge server.

`fastly edge-check -k YOUR-API-KEY https://your-url-to-check.com/path`

### License
MIT
