module.exports = (options, Fastly, util) => {
  if (!util.apiKeyPresent(options)) {
    return;
  }
  const fastly = Fastly(options.apikey);

  fastly.datacenters(util.ResponseHandler(null));
};
