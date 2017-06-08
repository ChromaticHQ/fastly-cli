module.exports = (options, Fastly, util) => {
  const fastly = Fastly();

  fastly.publicIpList(util.ResponseHandler(null));
};
