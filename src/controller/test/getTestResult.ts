import express, { Request, Response, NextFunction } from 'express';
import { is } from 'sequelize/types/lib/operators';
import { Songs } from '../../model/songs';
import { Genres } from '../../model/genres';
import { Tests_and_genres } from '../../model/tests_and_genres';
import { Periods } from '../../model/periods';
import { Types } from '../../model/types';
import { Tests_and_periods } from '../../model/tests_and_periods';
import { ModuleResolutionKind } from 'typescript';
import { QueryTypes, Op } from 'sequelize';
import { Test } from 'mocha';
import { count } from 'node:console';
// const func = require('./processFuncs');
import func from './processFuncs';
import { AnswerSheet } from './interface';

type GenreData = {
  id: number;
};

export const getTestResult = async (req: Request, res: Response) => {
  try {
    console.log('========getTestResult=========');
    console.log(req.body);

    if (req.body.length > 0) {
      let answerArr: AnswerSheet[] = req.body;

      for (let answer of answerArr) {
        //* 장르 조인 테이블에 기록
        let {
          tests_id,
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

        let periodData = await Tests_and_periods.findOne({
          where: { tests_id, periods_id },
          attributes: ['id', 'correct', 'total', 'correct_answer_rate'],
        }).catch();
        console.log(periodData);

        //! 장르별 테이블 기록
        if (typeof genres_id === 'number') {
          if (!genreData) {
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

      let typeInfo = await Types.findOne({
        where: { id: 1 },
        attributes: ['id', 'title', 'subtitle', 'description', 'image'],
      });
      if (typeInfo) {
        res.status(201).send({ result: typeInfo });
      }
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(500);
  }
};
