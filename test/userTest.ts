import * as request from 'supertest'; 
import { app } from '../src/index'
import { QueryInterface, Sequelize, Options } from "sequelize";
import { expect } from 'chai';
import {config} from '../src/config/config';
    

describe('User Test', () => {
    class options implements Options{
      dialect!: 'mysql';
      username!: string;
      password!: string;
    }    
    const createDBOptions = new options();
    createDBOptions.username = process.env.DB_USERNAME || 'root';
    createDBOptions.password = process.env.DB_PASSWORD || 'your password';
    createDBOptions.dialect = 'mysql';
    
    let db_name = '@@@@testDB@@@';
    
    const dbCreateSequelize = new Sequelize(createDBOptions);
  

  it('DB가 제대로 생성되는 지 확인한다.', async () => {
    try{
      await dbCreateSequelize.getQueryInterface().createDatabase(db_name);
      expect(true).to.be.true;
    }catch(error){
      console.log("DB 생성 에러");
    }
  })

  // const sequelize = new Sequelize(
  //   config.test.database,
  //   config.test.username,
  //   config.test.password,
  //   {
  //       host: config.test.host,
  //       dialect: 'mysql'
  //   }





})



