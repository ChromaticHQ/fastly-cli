const should = require(`should`);
const sinon = require(`sinon`);
require(`should-sinon`);

const util = require(`./../util`);
const testData = require(`./../test.data`)
const testSubject = require(`./purge`);

const testUrl = `https://example.com`;

// Scope vars that we’ll redefine on each test.
let options, purgeStub, softPurgeStub, Fastly;

// Begin testing.
describe(`purge`, () => {
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
    testSubject(options, Fastly, util, testUrl);
    util.ResponseHandler.should.be.calledOnce();
    util.ResponseHandler.getCalls()[0].args.should.deepEqual([`Purged URL: ${testUrl}`]);
    done();
  });

  it(`should invoke .purge()`, (done) => {
    options.hardpurge = true;
    testSubject(options, Fastly, util, testUrl);
    purgeStub.should.be.calledOnce();
    purgeStub.getCalls()[0].args[testData.argPositionOptions].should.equal(options.serviceid);
    purgeStub.getCalls()[0].args[testData.argPositionUrl].should.equal(testUrl);
    done();
  });

  it(`should invoke .softpurge()`, (done) => {
    testSubject(options, Fastly, util, testUrl);
    softPurgeStub.should.be.calledOnce();
    softPurgeStub.getCalls()[0].args[testData.argPositionOptions].should.equal(options.serviceid);
    softPurgeStub.getCalls()[0].args[testData.argPositionUrl].should.equal(testUrl);
    done();
  });

  beforeEach(() => {
    // Mock fastly dependency’s methods.
    let purgeMock = function (serviceid, callback) {}
    let softpurgeMock = function (serviceid, callback) {}
    let fastly_return = {
      purge: purgeMock,
      softPurge: softpurgeMock,
    }

    // Create fresh spies.
    sinon.spy(util, `apiKeyPresent`);
    sinon.spy(util, `serviceIdPresent`);
    sinon.spy(util, `ResponseHandler`);
    purgeStub = sinon.stub(fastly_return, `purge`);
    softPurgeStub = sinon.stub(fastly_return, `softPurge`);

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
    purgeStub.restore();
    softPurgeStub.restore();
  });
});
