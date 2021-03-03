import {app} from '../src/index';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('연결 테스트',() => {
  it('연결 테스트!', (done) => {
    chai.request(app).get('/')
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res.body.message).to.deep.equal('Hello! Laggard-Project!');
      done();
    })
  })
})