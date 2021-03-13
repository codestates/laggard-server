// import * as request from 'supertest'; 
import { app } from '../src/index'
import { QueryInterface, Sequelize, Options } from "sequelize";
import chai from 'chai';
import chaiHttp from 'chai-http';
import {config} from '../src/config/config';
import {Users} from '../src/model/users'
import { Correct_answer_rate } from '../src/model/correct_answer_rate';
import { Users_and_songs } from '../src/model/users_and_songs';
import { Scores } from '../src/model/scores';


chai.use(chaiHttp);
const expect = chai.expect;

const newUser = {
  email : 'testUser@test.com',
  password : 'email',
  nickname : 'test',
  birth_year : 2000,
  sex : true
}

let accessTokenLoginUser : string;
let accessTokenWithoutLoginUser : string;
let userId : number;

describe('Quiz Test',() => {
  it('get Song info - quizAge가 queryString으로 주어졌을 때 노래에 대한 정보를 가져올 수 있어야 한다.',(done) => {
    chai.request(app).get('/quiz/songInfo?quizAge=2010')
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.have.include.keys(['songId','title','year','rank','album_title','lyrics','artist']);
      done();
    })
  })

  it('get Song info - quizAge가 queryString으로 주어지지 않으면 노래에 대한 정보를 가져오지 못한다.',(done) => {
    chai.request(app).get('/quiz/songInfo')
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      done();
    })
  })

  //오디오 버퍼 데이터 받아오는 부분은 생략
  it('로그인하지않고 퀴즈풀기를 누른 유저는 guest accessToken을 받는다.', (done) => {
    chai.request(app).post("/users/signin/withoutLogin")
    .send({sex : true, birth_year : 1992})
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.have.include.keys(['message', 'accessToken']);
      accessTokenWithoutLoginUser = res.body.accessToken;
      done();
    })
  })

  it('성별과 나이에 따른 정답여부를 디비에 저장해준다. 로그인을 안한 유저(guest AccessToken을 가지고 있는 유저)는 유저에 따른 각 노래의 정답여부는 저장되지 않는다.', (done) => {
    chai.request(app).get('/quiz/recordResult?songs_id=100&correct=true')
    .set({"Authorization" : `Bearer ${accessTokenWithoutLoginUser}`})
    .end(async (err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      //correct_answer_rate에 제대로 저장됬나 검사
      let saveAnswerRateTest = await Correct_answer_rate.findOne({
        where : {songs_id : 100, sex : true, birth_year : 1992}
      })
      expect(saveAnswerRateTest).to.not.be.null;
      // console.log("^^^ : ",saveAnswerRateTest?.correct_answer);
      expect(saveAnswerRateTest?.correct_answer).to.deep.equal(1);
      //Users_and_songs에는 데이터가 들어가면 안된다.
      let saveUsersAndSongs = await Users_and_songs.findAll();
      // console.log("$$$ : ", saveUsersAndSongs);
      expect(saveUsersAndSongs).to.deep.equal([]);

      await Correct_answer_rate.destroy({
        where : {songs_id : 100, sex : true, birth_year : 1992}
      })
      done();      
    })
  })

  it('최종 스코어를 디비에 저장해준다. 로그인을 안한 유저(guest AccessToken을 가지고 있는 유저)는 스코어를 저장할 수 없다.',(done) => {
    chai.request(app).get('/quiz/submitScore?totalScore=15&songs_year=2010')
    .set({"Authorization"  : `Bearer ${accessTokenWithoutLoginUser}`})
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      done();
    })
  })

  it('정답여부를 저장할 수 있어야 한다. - 로그인한 유저',(done) => {
    //회원가입
    chai.request(app).post('/users/signup/basic')
    .send(newUser)
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);

      //로그인
    chai.request(app).post('/users/signin/basic')
    .send({
      email : newUser.email,
      password : newUser.password
    })
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.have.include.keys(['message', 'data']);
      accessTokenLoginUser = res.body.data;

      //로그인 유저 아이디 가져오기
    chai.request(app).get('/users/userinfo')
    .set({"Authorization" : `Bearer ${accessTokenLoginUser}`})
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      console.log("!@#$%^^&res : ", res.body);
      
      expect(res).to.have.status(200);
      userId = res.body.data.userInfo.id;
      //정답여부 저장
    chai.request(app).get('/quiz/recordResult?songs_id=101&correct=true')
    .set({"Authorization" : `Bearer ${accessTokenLoginUser}`})
    .end(async (err, res) => {
      if(err){
        done(err);
        return;
      }
      let saveAnswerRateTest = await Correct_answer_rate.findOne({where : {sex : true, birth_year : 2000, songs_id : 101}});
      expect(saveAnswerRateTest).to.not.be.null;
      expect(saveAnswerRateTest?.correct_answer).to.deep.equal(1);

      await Correct_answer_rate.destroy({where : {sex : true, birth_year : 2000, songs_id : 101}})
      done();
    })
    })
    })

    })


    
  })

  it('문제에 따른 정답여부를 알 수 있어야한다. - 로그인 한 유저',(done) => {    //여기 (done)이부분에 async가 붙으면 안된다. mocha규칙
    Users_and_songs.findOne({
      where : {user_id : userId}
    }).then(async result => {
      expect(result).to.not.be.null;
      expect(result?.right_or_wrong).to.deep.equal(true);
      
      done();
    })
    
  })

  it('로그인 한 유저는 점수를 기록할 수 있어야 한다.',(done) => {
    chai.request(app).get('/quiz/submitScore?totalScore=25&songs_year=2000')
    .set({"Authorization" : `Bearer ${accessTokenLoginUser}`})
    .end(async (err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      let userScore = await Scores.findOne({
        where : {user_id : userId, songs_year : 2000, score : 25}
      })

      expect(userScore).to.be.not.null;
      expect(userScore?.score).to.deep.equal(25);

      done();
    })
  })

  after(() => {
    Users.destroy({
      where : {id : userId}
    }).then(result => {
      console.log("성공");
    }).catch(err => {
      console.log("err : ", err);
      
    })

  })
})