module.exports = (options, Fastly, util, cacheKey) => {
  if (!util.apiKeyPresent(options) || !util.serviceIdPresent(options)) {
    return;
  }
  const fastly = Fastly(options.apikey);
  const responseHandler = util.ResponseHandler(`Purged key: ${cacheKey}`);

  if (options.hardpurge) {
    fastly.purgeKey(options.serviceid, cacheKey, responseHandler);
  }
  else {
    fastly.softPurgeKey(options.serviceid, cacheKey, responseHandler);
  }
};
