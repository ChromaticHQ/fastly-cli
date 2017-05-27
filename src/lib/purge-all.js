module.exports = (program, Fastly, util) => {
  if (!util.apiKeyPresent(program) || !util.serviceIdPresent(program)) {
    return;
  }
  const fastly = Fastly(program.apikey);
  const responseHandler = util.ResponseHandler(`All content purged.`);

  if (program.hardpurge) {
    fastly.purgeAll(program.serviceid, responseHandler);
  }
  else {
    fastly.softPurgeAll(program.serviceid, responseHandler);
  }
};
