const should = require(`should`);
const sinon = require(`sinon`);
require(`should-sinon`);

const util = require(`./../util`);
const testSubject = require(`./purge-all`);

// Scope vars that we’ll redefine on each test.
let options, purgeAllStub, softPurgeAllStub, Fastly;

// Begin testing.
describe(`purge-all`, () => {
  // Before and after each test, we reset some stuff
  // to ensure a fresh set of arguments. See .beforeEach()
  // and .afterEach() near the bottom of this file.

  it(`should stop without an API key`, (done) => {
    delete options.apikey;
    testSubject(options, Fastly, util);
    util.apiKeyPresent.should.be.calledOnce();
    Fastly.should.not.be.called();
    done();
  });

  it(`should stop without a Service ID`, (done) => {
    delete options.serviceid;
    testSubject(options, Fastly, util);
    util.serviceIdPresent.should.be.calledOnce();
    Fastly.should.not.be.called();
    done();
  });

  it(`should instantiate Fastly with API key`, (done) => {
    testSubject(options, Fastly, util);
    Fastly.should.be.calledOnce();
    Fastly.getCalls()[0].args.should.deepEqual([options.apikey]);
    done();
  });

  it(`should instantiate ResponseHandler with message`, (done) => {
    testSubject(options, Fastly, util);
    util.ResponseHandler.should.be.calledOnce();
    util.ResponseHandler.getCalls()[0].args[0].should.equal(`All content purged.`);
    done();
  });

  it(`should invoke .purgeAll()`, (done) => {
    options.hardpurge = true;
    testSubject(options, Fastly, util);
    purgeAllStub.should.be.calledOnce();
    purgeAllStub.getCalls()[0].args[0].should.equal(options.serviceid);
    done();
  });

  it(`should invoke .softPurgeAll()`, (done) => {
    testSubject(options, Fastly, util);
    softPurgeAllStub.should.be.calledOnce();
    softPurgeAllStub.getCalls()[0].args[0].should.equal(options.serviceid);
    done();
  });

  beforeEach(() => {
    // Mock fastly dependency’s methods.
    let purgeAllMock = function (serviceid, callback) {}
    let softPurgeAllMock = function (serviceid, callback) {}
    let fastly_return = {
      purgeAll: purgeAllMock,
      softPurgeAll: softPurgeAllMock,
    }

    // Create fresh spies.
    sinon.spy(util, `apiKeyPresent`);
    sinon.spy(util, `serviceIdPresent`);
    sinon.spy(util, `ResponseHandler`);
    purgeAllStub = sinon.stub(fastly_return, `purgeAll`);
    softPurgeAllStub = sinon.stub(fastly_return, `softPurgeAll`);

    // Make fastly itself a stub.
    Fastly = sinon.stub().returns(fastly_return);

    // Refresh options object.
    options = {
      apikey: `a key`,
      serviceid: `an id`
    }
  });

  afterEach(() => {
    // Decomission spies and stubs.
    util.apiKeyPresent.restore();
    util.serviceIdPresent.restore();
    util.ResponseHandler.restore();
    purgeAllStub.restore();
    softPurgeAllStub.restore();
  });
});
