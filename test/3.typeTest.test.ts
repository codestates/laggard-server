// import * as request from 'supertest';
import { app } from '../src/index';
import { QueryInterface, Sequelize, Options } from 'sequelize';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { config } from '../src/config/config';
import { Songs } from '../src/model/songs';
import { Tests } from '../src/model/tests';
import user from '../src/controller/user';
import func from '../src/controller/test/processFuncs';

chai.use(chaiHttp);
const expect = chai.expect;

interface TestData {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre: string;
  lyrics: string;
}

const query = {
  birth_year: 1999,
  sex: true,
};

let accessToken: string;

describe('Type Test Test', () => {
  context('getTestSheet.ts', () => {
    it('출생연도나 성별 정보가 없이 테스트 문제 요청을 하면 400 응답을 반환한다', (done) => {
      chai
        .request(app)
        .get('/tests')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        });
    });

    it('테스트 문제 요청 시 15문제를 불러온다.', (done) => {
      const sex = false;
      const birth_year = 1996;
      chai
        .request(app)
        .get(`/tests?sex=${sex}&birth_year=${birth_year}`)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          const resData = JSON.parse(res.text);
          expect(resData).to.have.property('id');
          expect(resData).to.have.property('testData').with.lengthOf(15);
          done();
        });
    });

    it('총 문제 중 집중 출제 기간(focusYear)에 해당되는 문제가 전체 문제의 60%를 넘는다.', (done) => {
      const sex = false;
      const birth_year = 1988;
      let fy = func.setFocusYear(birth_year);
      chai
        .request(app)
        .get(`/tests?sex=${sex}&birth_year=${birth_year}`)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(err).to.be.null;
          let testData: TestData[] = JSON.parse(res.text).testData;
          let ox: boolean =
            testData.filter((q) => q.year >= fy[1] && q.year <= fy[2]).length /
              15 >
            0.6;
          expect(ox).to.be.true;
          done();
        });
    });
  });

  context('getTestResult.ts', () => {
    const answer = [
      {
        tests_id: 12,
        id: 253,
        title: 'YES or YES',
        year: 2018,
        genre: '가요 / 댄스',
        userAnswer: '',
        right_or_wrong: true,
      },
      {
        tests_id: 12,
        id: 1,
        title: '있어줘요',
        year: 2020,
        genre: '가요 / 인디',
        userAnswer: '',
        right_or_wrong: false,
      },
      {
        tests_id: 12,
        id: 611,
        title: '답이 없었어',
        year: 2014,
        genre: '가요 / 발라드',
        userAnswer: '',
        right_or_wrong: false,
      },
      {
        tests_id: 12,
        id: 999,
        title: '사랑이 술을 가르쳐 (Feat. 백찬 From 8eight)',
        year: 2010,
        genre: '발라드',
        userAnswer: '사랑이술을가르쳐',
        right_or_wrong: true,
      },
      {
        tests_id: 12,
        id: 15,
        title: 'When We Disco (Duet With 선미)',
        year: 2020,
        genre: '댄스',
        userAnswer: 'whenwedisco',
        right_or_wrong: true,
      },
      {
        tests_id: 12,
        id: 923,
        title: '정류장',
        year: 2011,
        genre: '가요 / 발라드',
        userAnswer: '정류장',
        right_or_wrong: true,
      },
      {
        tests_id: 12,
        id: 765,
        title: '첫사랑',
        year: 2013,
        genre: '가요 / 댄스',
        userAnswer: '첫사랑',
        right_or_wrong: true,
      },
      {
        tests_id: 12,
        id: 841,
        title: 'DAY BY DAY',
        year: 2012,
        genre: '가요 / 댄스',
        userAnswer: '',
        right_or_wrong: false,
      },
      {
        tests_id: 12,
        id: 640,
        title: '노래가 늘었어',
        year: 2014,
        genre: '가요 / R&B/소울',
        userAnswer: '노래가늘었어',
        right_or_wrong: false,
      },
      {
        tests_id: 12,
        id: 398,
        title: '신사 ($insa)',
        year: 2016,
        genre: '가요 / 랩/힙합',
        userAnswer: '신사',
        right_or_wrong: true,
      },
      {
        tests_id: 12,
        id: 27,
        title: '돌덩이',
        year: 2020,
        genre: 'OST / 드라마',
        userAnswer: '',
        right_or_wrong: false,
      },
      {
        tests_id: 12,
        id: 185,
        title: 'Love Shot',
        year: 2019,
        genre: '가요 / 댄스',
        userAnswer: '',
        right_or_wrong: true,
      },
      {
        tests_id: 12,
        id: 2834,
        title: '친구에게',
        year: 1989,
        genre: '가요 / 블루스/포크',
        userAnswer: '',
        right_or_wrong: false,
      },
      {
        tests_id: 12,
        id: 2609,
        title: 'Pilot',
        year: 1993,
        genre: 'OST / 드라마',
        userAnswer: '',
        right_or_wrong: false,
      },
      {
        tests_id: 12,
        id: 1408,
        title: '태양의 눈물',
        year: 2006,
        genre: '가요 / 발라드',
        userAnswer: '',
        right_or_wrong: false,
      },
    ];

    it('알맞은 양식의 결과를 제출하면 201 응답을 받는다', (done) => {
      chai
        .request(app)
        .post('/tests/result')
        .send(answer)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(err).to.be.null;
          expect(res).have.status(201);
          done();
        });
    });

    it('결과를 제출하면 제목, 부제, 설명이 있는 객체를 응답 받는다.', (done) => {
      chai
        .request(app)
        .post('/tests/result')
        .send(answer)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(err).to.be.null;
          const resData = JSON.parse(res.text).result;
          expect(resData).to.have.property('title');
          expect(resData).to.have.property('subtitle');
          expect(resData).to.have.property('description');
          done();
        });
    });
  });
});
