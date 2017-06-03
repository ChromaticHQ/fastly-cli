module.exports = (options, Fastly, util, url) => {
  if (!util.apiKeyPresent(options) || !util.serviceIdPresent(options)) {
    return;
  }
  const fastly = Fastly(options.apikey);
  const responseHandler = util.ResponseHandler(`Purged URL: ${url}`);

  if (options.hardpurge) {
    fastly.purge(options.serviceid, url, responseHandler);
  }
  else {
    fastly.softPurge(options.serviceid, url, responseHandler);
  }
};
