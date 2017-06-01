'use strict';

module.exports = (options, Fastly, util) => {
  if (!util.apiKeyPresent(options) || !util.serviceIdPresent(options)) {
    return;
  }
  const fastly = Fastly(options.apikey);
  const responseHandler = util.ResponseHandler(`All content purged.`);

  if (options.hardpurge) {
    fastly.purgeAll(options.serviceid, responseHandler);
  }
  else {
    fastly.softPurgeAll(options.serviceid, responseHandler);
  }
};
