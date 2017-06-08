module.exports = (options, Fastly, util, url) => {
  if (!util.apiKeyPresent(options)) {
    return;
  }
  const fastly = Fastly(options.apikey);

  fastly.edgeCheck(url, util.ResponseHandler(null));
};
