const should = require(`should`);
const sinon = require(`sinon`);
require(`should-sinon`);

const util = require(`./../util`);
const testData = require(`./../test.data`)
const testSubject = require(`./purge-key`);

const testCacheKey = `5812587d-1407-4a60-930f-ce39e2b7e6f7`;

// Scope vars that we’ll redefine on each test.
let options, purgeKeyStub, softPurgeKeyStub, Fastly;

// Begin testing.
describe(`purge-key`, () => {
  // Before and after each test, we reset some stuff
  // to ensure a fresh set of arguments. See .beforeEach()
  // and .afterEach() near the bottom of this file.

  it(`should stop without an API key`, (done) => {
    delete options.apikey;
    testSubject(options, Fastly, util, testCacheKey);
    util.apiKeyPresent.should.be.calledOnce();
    Fastly.should.not.be.called();
    done();
  });

  it(`should stop without a Service ID`, (done) => {
    delete options.serviceid;
    testSubject(options, Fastly, util, testCacheKey);
    util.serviceIdPresent.should.be.calledOnce();
    Fastly.should.not.be.called();
    done();
  });

  it(`should instantiate Fastly with API key`, (done) => {
    testSubject(options, Fastly, util, testCacheKey);
    Fastly.should.be.calledOnce();
    Fastly.getCalls()[0].args.should.deepEqual([options.apikey]);
    done();
  });

  it(`should instantiate ResponseHandler with message`, (done) => {
    testSubject(options, Fastly, util, testCacheKey);
    util.ResponseHandler.should.be.calledOnce();
    util.ResponseHandler.getCalls()[0].args.should.deepEqual([`Purged key: ${testCacheKey}`]);
    done();
  });

  it(`should invoke .purgeKey()`, (done) => {
    options.hardpurge = true;
    testSubject(options, Fastly, util, testCacheKey);
    purgeKeyStub.should.be.calledOnce();
    purgeKeyStub.getCalls()[0].args[testData.argPositionOptions].should.equal(options.serviceid);
    purgeKeyStub.getCalls()[0].args[testData.argPositionUrl].should.equal(testCacheKey);
    done();
  });

  it(`should invoke .softPurgeKey()`, (done) => {
    testSubject(options, Fastly, util, testCacheKey);
    softPurgeKeyStub.should.be.calledOnce();
    softPurgeKeyStub.getCalls()[0].args[testData.argPositionOptions].should.equal(options.serviceid);
    softPurgeKeyStub.getCalls()[0].args[testData.argPositionUrl].should.equal(testCacheKey);
    done();
  });

  beforeEach(() => {
    // Mock fastly dependency’s methods.
    let purgeKeyMock = function (serviceid, key, callback) {}
    let softPurgeKeyMock = function (serviceid, key, callback) {}
    let fastly_return = {
      purgeKey: purgeKeyMock,
      softPurgeKey: softPurgeKeyMock,
    }

    // Create fresh spies.
    sinon.spy(util, `apiKeyPresent`);
    sinon.spy(util, `serviceIdPresent`);
    sinon.spy(util, `ResponseHandler`);
    purgeKeyStub = sinon.stub(fastly_return, `purgeKey`);
    softPurgeKeyStub = sinon.stub(fastly_return, `softPurgeKey`);

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
    purgeKeyStub.restore();
    softPurgeKeyStub.restore();
  });
});
