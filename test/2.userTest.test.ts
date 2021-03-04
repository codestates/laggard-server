// import * as request from 'supertest'; 
import { app } from '../src/index'
import { QueryInterface, Sequelize, Options } from "sequelize";
import chai from 'chai';
import chaiHttp from 'chai-http';
import {config} from '../src/config/config';
import {Users} from '../src/model/users'
import user from '../src/controller/user';

chai.use(chaiHttp);
const expect = chai.expect;

// describe('User Test', () => {
//     class options implements Options{
//       dialect!: 'mysql';
//       username!: string;
//       password!: string;
//     }    
//     const createDBOptions = new options();
//     createDBOptions.username = process.env.DB_USERNAME || 'root';
//     createDBOptions.password = process.env.DB_PASSWORD || 'your password';
//     createDBOptions.dialect = 'mysql';
    
//     let db_name = '@@@@testDB@@@';
    
//     const dbCreateSequelize = new Sequelize(createDBOptions);
  

//   it('DB가 제대로 생성되는 지 확인한다.', async () => {
//     try{
//       await dbCreateSequelize.getQueryInterface().createDatabase(db_name);
//       chai.expect(true).to.be.true;
//     }catch(error){
//       console.log("DB 생성 에러");
//     }
//   })

//   // const sequelize = new Sequelize(
//   //   config.test.database,
//   //   config.test.username,
//   //   config.test.password,
//   //   {
//   //       host: config.test.host,
//   //       dialect: 'mysql'
//   //   }

// })

const newUser = {
  email : 'testUser@test.com',
  password : 'email',
  nickname : 'test',
  birth_year : 20,
  sex : true
}

let accessToken : string;

describe('User Test', () => {
  it('회원가입 - 회원가입을 할 수 있어야 한다.', (done) => {

    // Users.truncate({cascade : true})
    // .then(() => {
    //   console.log("ok");
    // })
    // .catch((e) => {
    //   console.log("err : ", e);
    // })

    // Users.destroy({
    //   where : {email : 'test5User@test.com'}
    // })
    // .then((result) => {
    //   console.log("성공 : ", result);
    // })
    // .catch((err) => {
    //   console.log("err : ", err);
    // })

    
    chai.request(app).post('/users/signup/basic')
    .send(newUser)
    .end((err,res) => {
      // if(err) {
      //   done(err);
      //   return;
      // }
      // console.log("err : ", err);
      
      // console.log("res : ", res);
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })

  })

  it('이메일 중복검사 - 중복된 이메일확인을 하면 409status를 반환한다.',(done) => {
    chai.request(app).post('/users/signup/emailCheck')
    .send({email : 'testUser@test.com'})
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(409);
      done();
    })
  })

  it('이메일 중복검사 - 중복되지 않은 이메일 확인을 하면 200status를 반환한다.', (done) => {
    chai.request(app).post('/users/signup/emailCheck')
    .send({email : '2testUser2@test.com'})
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({message : "You can use this email"});
      done();
    })
  })

  it('회원가입 - 중복된 이메일은 회원가입이 되지 않는다',(done) => {
    chai.request(app).post('/users/signup/basic')
    .send(newUser)
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(409);
      expect(res.body).to.deep.equal({message : "This email is already registered"});
      done();
    })
  })

  it('로그인 - 올바르지 않은 정보는 로그인 되지 않는다. - 비밀번호', (done) => {
    chai.request(app).post('/users/signin/basic')
    .send({
      email : newUser.email,
      password : 'miss'
    })
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(403);
      expect(res.body).to.deep.equal({message : "Invalid user id or password"});
      done();
    })
  })

  it('로그인 - 올바르지 않은 정보는 로그인 되지 않는다. - 아이디', (done) => {
    chai.request(app).post('/users/signin/basic')
    .send({
      email : 'miss',
      password : newUser.password
    })
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(403);
      expect(res.body).to.deep.equal({message : "Invalid user id or password"});
      done();
    })
  })

  it('로그인 - 올바른 정보를 입력하면 로그인되고 액세스토큰을 받는다.',(done) => {
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
      accessToken = res.body.data;
      done();
    })
  })

  it('Get User Info - 올바른 액세스 토큰이 있으면 유저 정보를 가져온다',(done) => {
    chai.request(app).get('/users/userinfo')
    .set({"Authorization" : `Bearer ${accessToken}`})
    .end((err, res) => {
      if(err){
        console.log("####ERR : ", err);
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body.data.userInfo).to.have.include.keys(['id','email','nickname','birth_year','sex'])
      // console.log("#####res : " , res);
      done();
    })
  })

  it('Get User Info - 올바른 액세스 토큰이 없으면 유저 정보를 가져오지 못한다.', (done) => {
    chai.request(app).get('/users/userinfo')
    .set({"Authorization" : 'Bearer invalidToken'})
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(403);
      expect(res.body).to.deep.equal({message : "Invalid access token"});
      done();
    })
  })

  it('유저 정보 수정 - 올바른 액세스 토큰이 없으면 유저 정보를 수정하지 못한다.', (done) => {
    chai.request(app).put('/users/userinfo')
    .set({"Authorization" : 'Bearer invalidToken'})
    .send({
      nickname : "modifyNickName",
      password : "modifyPassword"
    })
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(403);
      expect(res.body).to.deep.equal({message : "Invalid Access Token"});
      done();
    })
  })

  it('유저 정보 수정 - 올바른 액세스 토큰 - 닉네임만 수정',(done) => {
    chai.request(app).put('/users/userinfo')
    .set({"Authorization" : `Bearer ${accessToken}`})
    .send({
      nickname : "modifyNickName"
    })
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      
      expect(res.body).to.have.include.keys(['id', 'message']);
      done();
    })
  })

  it('유저 정보 수정 - 바뀐 닉네임 확인 (get User로 확인)',(done) => {
    chai.request(app).get('/users/userinfo')
    .set({"Authorization" : `Bearer ${accessToken}`})
    .end((err,res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body.data.userInfo.nickname).to.deep.equal("modifyNickName");
      done();
    })
  })

  it('유저 정보 수정 - 비밀번호 변경',(done) => {
    chai.request(app).put('/users/userinfo')
    .set({"Authorization" : `Bearer ${accessToken}`})
    .send({
      password : 'modifyPassword'
    })
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.have.include.keys(['id', 'message']);
      done();
    })
  })

  it('유저정보 수정 - 변경된 비밀번호로 로그인',(done) => {
    chai.request(app).post('/users/signin/basic')
    .send({
      email : newUser.email,
      password : 'modifyPassword'
    })
    .end((err, res) => {
      if(err){
        done(err);
        return;
      }
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })
  })

  it('유저 정보 수정 - 기존 비밀번호로는 로그인 불가', (done) => {
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
      expect(res).to.have.status(403);
      done();
    })
  })


  after(() => {
    Users.destroy({
      where : {email : 'testUser@test.com'}
    })
    .then((result) => {
      console.log("성공 : ", result);
    })
    .catch((err) => {
      console.log("err : ", err);
    })
  })

})



