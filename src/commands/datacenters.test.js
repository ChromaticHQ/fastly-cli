const should = require(`should`);
const sinon = require(`sinon`);
require(`should-sinon`);

const util = require(`./../util`);
const testSubject = require(`./datacenters`);

// Scope vars that we’ll redefine on each test.
let options, datacentersStub, Fastly;

// Begin testing.
describe(`datacenters`, () => {
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

  it(`should instantiate Fastly with API key`, (done) => {
    testSubject(options, Fastly, util);
    Fastly.should.be.calledOnce();
    Fastly.getCalls()[0].args.should.deepEqual([options.apikey]);
    done();
  });

  it(`should instantiate ResponseHandler`, (done) => {
    testSubject(options, Fastly, util);
    util.ResponseHandler.should.be.calledOnce();
    done();
  });

  it(`should invoke .datacenters()`, (done) => {
    testSubject(options, Fastly, util);
    datacentersStub.should.be.calledOnce();
    Fastly.getCalls()[0].args.should.deepEqual([options.apikey]);
    done();
  });

  beforeEach(() => {
    // Mock fastly dependency’s methods.
    let datacentersMock = function (callback) {}
    let fastly_return = {
      datacenters: datacentersMock,
    }

    // Create fresh spies.
    sinon.spy(util, `apiKeyPresent`);
    sinon.spy(util, `ResponseHandler`);
    datacentersStub = sinon.stub(fastly_return, `datacenters`);

    // Make fastly itself a stub.
    Fastly = sinon.stub().returns(fastly_return);

    // Refresh options object.
    options = {
      apikey: `a key`
    }
  });

  afterEach(() => {
    // Decomission spies and stubs.
    util.apiKeyPresent.restore();
    util.ResponseHandler.restore();
    datacentersStub.restore();
  });
});
