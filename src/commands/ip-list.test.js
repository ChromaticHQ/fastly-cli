const should = require(`should`);
const sinon = require(`sinon`);
require(`should-sinon`);

const util = require(`./../util`);
const testSubject = require(`./ip-list`);

// Scope vars that we’ll redefine on each test.
let options, publicIpListStub, Fastly;

// Begin testing.
describe(`ip-list`, () => {
  // Before and after each test, we reset some stuff
  // to ensure a fresh set of arguments. See .beforeEach()
  // and .afterEach() near the bottom of this file.

  it(`should instantiate Fastly`, (done) => {
    testSubject(options, Fastly, util);
    Fastly.should.be.calledOnce();
    done();
  });

  it(`should instantiate ResponseHandler`, (done) => {
    testSubject(options, Fastly, util);
    util.ResponseHandler.should.be.calledOnce();
    done();
  });

  it(`should invoke .publicIpList()`, (done) => {
    testSubject(options, Fastly, util);
    publicIpListStub.should.be.calledOnce();
    done();
  });

  beforeEach(() => {
    // Mock fastly dependency’s methods.
    let publicIpListMock = function (callback) {}
    let fastly_return = {
      publicIpList: publicIpListMock,
    }

    // Create fresh spies.
    sinon.spy(util, `ResponseHandler`);
    publicIpListStub = sinon.stub(fastly_return, `publicIpList`);

    // Make fastly itself a stub.
    Fastly = sinon.stub().returns(fastly_return);

    // Refresh options object.
    options = {
      apikey: `a key`
    }
  });

  afterEach(() => {
    // Decomission spies and stubs.
    util.ResponseHandler.restore();
    publicIpListStub.restore();
  });
});
