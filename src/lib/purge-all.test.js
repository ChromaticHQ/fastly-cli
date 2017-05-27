const should = require(`should`);
const sinon = require(`sinon`);
require(`should-sinon`);

const util = require(`./util`);
const testSubject = require(`./purge-all`);

// Mock fastly dependency’s methods.
let purgeAllMock = function (serviceid, callback) {}
let softPurgeAllMock = function (serviceid, callback) {}
let fastly_return = {
  purgeAll: purgeAllMock,
  softPurgeAll: softPurgeAllMock,
}

// Scope vars that we’ll redefine on each test.
let program, purgeAllStub, softPurgeAllStub, Fastly;

// Begin testing.
describe(`purge-all`, () => {
  // Before and after each test, we reset some stuff
  // to ensure a fresh set of arguments. See .beforeEach()
  // and .afterEach() near the bottom of this file.

  it(`should stop without an API key`, (done) => {
    delete program.apikey;
    testSubject(program, Fastly, util);
    util.apiKeyPresent.should.be.calledOnce();
    Fastly.should.not.be.called();
    done();
  });

  it(`should stop without a Service ID`, (done) => {
    delete program.serviceid;
    testSubject(program, Fastly, util);
    util.serviceIdPresent.should.be.calledOnce();
    Fastly.should.not.be.called();
    done();
  });

  it(`should instantiate Fastly with API key`, (done) => {
    testSubject(program, Fastly, util);
    Fastly.getCalls(0)[0].args.should.deepEqual([program.apikey]);
    done();
  });

  it(`should instantiate ResponseHandler with message`, (done) => {
    testSubject(program, Fastly, util);
    util.ResponseHandler.should.be.calledOnce();
    util.ResponseHandler.getCalls()[0].args[0].should.equal(`All content purged.`);
    done();
  });

  it(`should invoke .purgeAll()`, (done) => {
    program.hardpurge = true;
    testSubject(program, Fastly, util);
    purgeAllStub.should.be.calledOnce();
    purgeAllStub.getCalls(0)[0].args[0].should.equal(program.serviceid);
    done();
  });

  it(`should invoke .softPurgeAll()`, (done) => {
    testSubject(program, Fastly, util);
    softPurgeAllStub.should.be.calledOnce();
    softPurgeAllStub.getCalls()[0].args[0].should.equal(program.serviceid);
    done();
  });

  beforeEach(() => {
    // Create fresh spies.
    sinon.spy(util, `apiKeyPresent`);
    sinon.spy(util, `serviceIdPresent`);
    sinon.spy(util, `ResponseHandler`);
    purgeAllStub = sinon.stub(fastly_return, `purgeAll`);
    softPurgeAllStub = sinon.stub(fastly_return, `softPurgeAll`);

    // Make fastly itself a stub.
    Fastly = sinon.stub().returns(fastly_return);

    // Refresh program object.
    program = {
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
