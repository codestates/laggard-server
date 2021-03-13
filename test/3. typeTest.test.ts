import { app } from '../src/index';
import { QueryInterface, Sequelize, Options } from 'sequelize';

import chai from 'chai';
import chaiHttp from 'chai-http';
import { config } from '../src/config/config';
import { Users } from '../src/model/users';
import user from '../src/controller/user';
import func from '../src/controller/test/processFuncs';
import { doesNotMatch } from 'node:assert';

const expect = chai.expect;

describe('Type Test', () => {
  // before(() => {

  // });
  context('Get Test Sheet', () => {
    it('1992년 이전 출생자의 경우 문제 출제 집중 기간은 15년이다.', (done) => {
      const fy = func.setFocusYear(1989);
      const ox = fy[2] - fy[1] === 15;
      expect(ox).to.be.true;
      done();
    }),
      it('1992년 이후 출생자의 경우 출제 집중 기간의 마지막 해는 2020년입니다.', (done) => {
        const fy = func.setFocusYear(1995);
        expect(fy[2]).to.be.equal(2020);
        done();
      });
    it('1992년 포함 이후 출생자들의 집중 출제 기간 문제는 13문제이다.', (done) => {
      const quota = func.quota(1993);
      expect(quota[0]).to.be.equal(13);
      done();
    });
    it('1982년 이후 1992년 이전 출생자들의 집중 출제 기간 문제는 11문제이다.', (done) => {
      const quota = func.quota(1984);
      expect(quota[0]).to.be.equal(11);
      done();
    });
    it('1991년 이후 출생자의 경우 제2집중 기간(5~13세)에 해당되는 문제는 없다.', (done) => {
      const quota = func.quota(1996);
      expect(quota[1]).to.be.equal(0);
      done();
    });
    it('제1, 제2 집중 기간을 제외한 문제를 1문제 이상 할당한다.', (done) => {
      const quota1 = func.quota(1996);
      const quota2 = func.quota(1986);
      const quota3 = func.quota(1986);
      expect(quota1[2] > 0).to.be.true;
      expect(quota2[2] > 0).to.be.true;
      expect(quota3[2] > 0).to.be.true;
      done();
    });
  });

  context('Get Test Result', () => {
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
        right_or_wrong: true,
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
        right_or_wrong: true,
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
        right_or_wrong: true,
      },
    ];
    it('정답률은 총 문제 중 정답을 맞힌 문제의 비율로 계산한다.', (done) => {
      const score = func.calculateTotalRate(answer);
      expect(score).to.be.equal(2 / 3);
      done();
    });
    it('정답률에 따라 학생 유형을 B,E,H,L로 구분한다.', (done) => {
      const grade1 = func.classifyScoreType(0.85);
      const grade2 = func.classifyScoreType(0.68);
      const grade3 = func.classifyScoreType(0.45);
      const grade4 = func.classifyScoreType(0.1);
      expect(grade1[0]).to.be.equal('B');
      expect(grade2[0]).to.be.equal('E');
      expect(grade3[0]).to.be.equal('H');
      expect(grade4[0]).to.be.equal('L');
      done();
    });
    it('유저가 제출한 정답에 따라 트렌디한지 여부를 나눈다.', (done) => {
      const ab = func.isTrendy(answer, 1998, 'E');
      expect(ab).to.be.equal(true);
      done();
    });
    it('검사 결과를 준비된 type 리스트에 맞게 보정한다', (done) => {
      const result1 = func.processResultType('BDA');
      const result2 = func.processResultType('BOA');
      const result3 = func.processResultType('EOA');
      const result4 = func.processResultType('EBB');
      const result5 = func.processResultType('HDA');
      const result6 = func.processResultType('LHA');
      expect(result1).to.be.equal('BDA');
      expect(result2).to.be.equal('BNA');
      expect(result3).to.be.equal('ENA');
      expect(result4).to.be.equal('ENB');
      expect(result5).to.be.equal('HNA');
      expect(result6).to.be.equal('LNB');
      done();
    });
  });
});
