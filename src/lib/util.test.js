const should = require(`should`);
const sinon = require(`sinon`);
require(`should-sinon`);

const util = require(`./util`);

describe(`util`, () => {
  it(`should return true when API key present`, (done) => {
    let program = { apikey: 'some string' }
    let result = util.apiKeyPresent(program);

    console.error.should.not.be.called();
    result.should.equal(true);
    done();
  });

  it(`should detect missing API key`, (done) => {
    let program = {}
    let result = util.apiKeyPresent(program);

    console.error.should.be.calledOnce();
    result.should.equal(false);
    done();
  });

  it(`should return true when Service ID present`, (done) => {
    let program = { serviceid: 'some string' }
    let result = util.serviceIdPresent(program);

    console.error.should.not.be.called();
    result.should.equal(true);
    done();
  });

  it(`should detect missing Service ID`, (done) => {
    let program = {}
    let result = util.serviceIdPresent(program);

    console.error.should.be.calledOnce();
    result.should.equal(false);
    done();
  });

  before(() => {
    sinon.stub(console, `error`).returns(null);
  });

  after(() => {
    console.error.restore();
  });

  afterEach(() => {
    console.error.resetHistory();
  });
});
