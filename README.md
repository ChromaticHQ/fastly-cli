# fastly-cli
[![dependencies Status](https://david-dm.org/ChromaticHQ/fastly-cli/status.svg)](https://david-dm.org/ChromaticHQ/fastly-cli)

Command line interface for interacting with the [Fastly](http://www.fastly.com/) API written in NodeJS.

### Installation

`$ npm install -g fastly-cli`

### Basic Usage
#### Purge All Content
`fastly purge-all -k YOUR-API-KEY -s YOUR-SERVICE-ID`

#### Purge URL
`fastly purge -k YOUR-API-KEY -s YOUR-SERVICE-ID https://your-url-to-purge.com/path`

#### Purge Key
`fastly purge-key -k YOUR-API-KEY -s YOUR-SERVICE-ID YOUR-KEY-TO-PURGE`

### License
MIT
