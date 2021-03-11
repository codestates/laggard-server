import express, { Request, Response, NextFunction } from 'express';
import { is } from 'sequelize/types/lib/operators';
import { Songs } from '../../model/songs';
import { Genres } from '../../model/genres';
import { Tests_and_genres } from '../../model/tests_and_genres';
import { Periods } from '../../model/periods';
import { Types } from '../../model/types';
import { Tests_and_periods } from '../../model/tests_and_periods';
import { isIntersectionTypeNode, ModuleResolutionKind } from 'typescript';
import { QueryTypes, Op } from 'sequelize';
import { Test } from 'mocha';
import { count } from 'node:console';
// const func = require('./processFuncs');
import func from './processFuncs';
import { AnswerSheet } from './interface';
import { Tests } from '../../model/tests';
import { getAttributes } from 'sequelize-typescript';
import { sequelize } from '../../model';

type GenreData = {
  id: number;
};

export const getTestResult = async (req: Request, res: Response) => {
  try {
    console.log('========getTestResult=========');
    // console.log(req.body);

    if (req.body.length > 0) {
      let answerArr: AnswerSheet[] = req.body;
      let tests_id = req.body[0].tests_id;
      console.log(`tests_id: ${tests_id}`);

      for (let answer of answerArr) {
        //* 장르 조인 테이블에 기록
        let {
          // id,
          // title,
          year,
          // userAnswer,
          right_or_wrong,
        } = answer;
        console.log(tests_id, year, right_or_wrong);
        let genres_id: number | undefined = await func.processGenre(
          answer.genre,
        );
        // console.log(`genres_id: ${genres_id}`);
        let periods_id: number | undefined = await func.processPeriod(year);
        console.log(`periods_id: ${periods_id}`);
        let genreData = await Tests_and_genres.findOne({
          where: { tests_id, genres_id },
          attributes: ['id', 'correct', 'total', 'correct_answer_rate'],
        }).catch();
        console.log(genreData);

        let periodData = await Tests_and_periods.findOne({
          where: { tests_id, periods_id },
          attributes: ['id', 'correct', 'total', 'correct_answer_rate'],
        }).catch();
        console.log(periodData);

        //! 장르별 테이블 기록
        if (typeof genres_id === 'number') {
          console.log('장르 테이블에 기록하기');
          if (!genreData) {
            console.log('테스트-장르 새 컬럼 생성');
            let correct: number = 0;
            let total: number = 1;
            if (right_or_wrong === true) {
              correct = 1;
            }
            let created = await Tests_and_genres.create({
              id: null,
              tests_id,
              genres_id,
              correct,
              total,
              correct_answer_rate: correct / total,
            });
            console.log(created);
          } else {
            let id = genreData.getDataValue('id');
            let correct = genreData.getDataValue('correct');
            let total = genreData.getDataValue('total');
            let correct_answer_rate: number;
            total++;
            if (right_or_wrong === true) {
              correct++;
            }
            correct_answer_rate = correct / total;
            console.log(correct, total, correct_answer_rate);

            let created = await genreData.update({
              id,
              tests_id,
              genres_id,
              correct,
              total,
              correct_answer_rate,
            });
            console.log(created);
          }
        }

        //! 연대별 테이블 기록
        if (typeof periods_id === 'number') {
          console.log('연대 정보 테이블에 기록하기');
          if (!periodData) {
            console.log('시대 데이터 없으면');
            let correct: number = 0;
            let total: number = 1;
            if (right_or_wrong === true) {
              correct = 1;
            }
            let created = await Tests_and_periods.create({
              id: null,
              tests_id,
              periods_id,
              correct,
              total,
              correct_answer_rate: correct / total,
            });
            console.log(created);
          } else {
            console.log('시대 데이터 있으면');
            let id = periodData.getDataValue('id');
            let correct = periodData.getDataValue('correct');
            let total = periodData.getDataValue('total');
            let correct_answer_rate: number;
            total++;
            if (right_or_wrong === true) {
              correct++;
            }
            correct_answer_rate = correct / total;
            console.log(correct, total, correct_answer_rate);

            let created = await periodData.update({
              id,
              tests_id,
              genres_id,
              correct,
              total,
              correct_answer_rate,
            });
            console.log(created);
          }
        }
      }

      //* type 찾기
      //*
      let totalScore = func.calculateTotalRate(answerArr);

      let scoreType = func.classifyScoreType(totalScore);
      let grade = scoreType[0];
      let criteria = scoreType[1];
      let genreIndex: string = 'N';
      console.log(grade);
      let birthYear: number;
      let trendIdx: string = 'A';
      let testDataForYear = await Tests.findOne({
        where: { id: tests_id },
        attributes: ['id', 'birth_year'],
      });
      console.log(testDataForYear);
      if (testDataForYear) {
        birthYear = testDataForYear.getDataValue('birth_year');
        if (grade !== 'B' && typeof grade === 'string') {
          let ox = func.isTrendy(answerArr, birthYear, grade);
          trendIdx = ox ? 'A' : 'B';
        }
      }
      console.log('==============================================');
      console.log(totalScore, scoreType, grade, trendIdx);
      console.log('==============================================');

      //* 장르 지표 찾자
      let genreDataForIdx = await Tests_and_genres.findAll({
        where: {
          tests_id,
          total: { [Op.gte]: 4 },
          correct_answer_rate: { [Op.gt]: criteria },
        },
        attributes: [
          'id',
          'tests_id',
          'genres_id',
          'total',
          'correct_answer_rate',
        ],
        order: [
          ['correct_answer_rate', 'DESC'],
          ['total', 'DESC'],
        ],
      });
      if (genreDataForIdx.length > 0) {
        console.log(genreDataForIdx);
        let id = genreDataForIdx[0].getDataValue('genres_id');
        let temp = await Genres.findOne({
          where: { id },
          attributes: ['id', 'classification'],
        });
        if (temp) {
          let genre = temp.getDataValue('classification');
          if (genre === 'dance') genreIndex = 'D';
          else if (genre === 'OST') genreIndex = 'O';
          else if (genre === 'ballad') genreIndex = 'B';
          else if (genre === 'hiphop') genreIndex = 'H';
        }
      }
      let type = grade + genreIndex + trendIdx;
      console.log(`type: ${type}`);
      let adjustedType = func.processResultType(type);
      console.log(`adjusted type: ${adjustedType}`);

      let typeInfo = await Types.findOne({
        where: { type: adjustedType },
        attributes: ['id', 'title', 'subtitle', 'description', 'image'],
      });
      console.log(typeInfo);
      if (typeInfo) {
        let typeId = typeInfo.getDataValue('id');
        await Tests.update({ types_id: typeId }, { where: { id: tests_id } });
        res.status(201).send({ result: typeInfo });
      } else {
        res.status(404).send('There is no type.');
      }
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(500);
  }
};
