// import * as request from 'supertest'; 
import { app } from '../src/index'
import { QueryInterface, Sequelize, Options } from "sequelize";
import chai from 'chai';
import chaiHttp from 'chai-http';
import {config} from '../src/config/config';
import {Users} from '../src/model/users'


chai.use(chaiHttp);
const expect = chai.expect;

