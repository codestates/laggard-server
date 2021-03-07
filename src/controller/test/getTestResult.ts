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

type AnswerSheet = {
  tests_id: number;
  id: number;
  title: string;
  year: number;
  genre: string;
  userAnswer: string;
  right_or_wrong: boolean;
};

type GenreData = {
  id: number;
};

export const getTestResult = async (req: Request, res: Response) => {
  try {
    console.log('========getTestResult=========');
    console.log(req.body);

    if (req.body) {
      let answerArr: AnswerSheet[] = req.body;
      for (let answer of answerArr) {
        //* 장르 조인 테이블에 기록
        const {
          tests_id,
          id,
          title,
          year,
          userAnswer,
          right_or_wrong,
        } = answer;
        let genres_id: number | null | undefined = await processGenre(
          answer.genre,
        );

        let genreData = await Tests_and_genres.findOne({
          where: { [Op.and]: [{ tests_id }, { genres_id }] },
        });
        if (typeof genres_id === 'number') {
          if (!genreData) {
            let correct: number;
            let wrong: number;
            if (right_or_wrong === true) {
              correct = 1;
              wrong = 0;
            } else {
              correct = 0;
              wrong = 1;
            }
            await Tests_and_genres.create({
              id: null,
              tests_id,
              genres_id,
              correct: 1,
              wrong: 0,
              correct_answer_rate: correct / (correct + wrong),
            });
          } else {
            let { correct, wrong } = genreData;
            let correct_answer_rate: number;
            if (right_or_wrong === true) {
              correct++;
            } else {
              wrong++;
            }
            correct_answer_rate = correct / (correct + wrong);
            await genreData.update({
              correct,
              wrong,
              correct_answer_rate,
            });
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
    }
  } catch {
    res.sendStatus(500);
  }
};

const processGenre = async (str: string) => {
  let result: string = 'etc';
  if (/OST./gi.test(str)) {
    console.log('OST');
    result = 'OST';
  } else if (/.댄스/gi.test(str)) {
    console.log('댄스');
    result = 'dance';
  } else if (/.발라드/gi.test(str)) {
    console.log('발라드');
    result = 'ballad';
  } else if (/.힙합/gi.test(str)) {
    console.log('힙합');
    result = 'hiphop';
  } else if (/.소울/gi.test(str)) {
    result = 'soul';
  } else if (/.인디/gi.test(str)) {
    result = 'indie';
  } else if (/락/gi.test(str)) {
    result = 'rock';
  } else if (/.트로트/gi.test(str)) {
    result = 'trot';
  } else {
    console.log('장르없음');
    result = 'etc';
  }
  // return result;
  let genreData = await Genres.findOne({
    where: { classification: result },
    attributes: ['id'],
  });
  if (genreData) {
    const id: number | null = genreData.getDataValue('id');
    console.log(result, id);
    return id;
  }
};

// 재료
// const temp = [
//   {
//     tests_id: 1,
//     id: 119,
//     title: '이 노래가 클럽에서 나온다면',
//     year: 2019,
//     genre: '가요 / 인디',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 22,
//     title: '봄날',
//     year: 2020,
//     genre: '가요 / 댄스',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 560,
//     title: '모르나봐',
//     year: 2015,
//     genre: 'OST / 드라마',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 828,
//     title: 'Pandora',
//     year: 2012,
//     genre: '가요 / 댄스',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 130,
//     title: '술이 달다 (Feat. Crush)',
//     year: 2019,
//     genre: '힙합',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 1025,
//     title: 'Bad Girl Good Girl',
//     year: 2010,
//     genre: '가요 / 댄스',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 28,
//     title: '밤편지',
//     year: 2020,
//     genre: '가요 / 발라드',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 299,
//     title: 'BLUE MOON (Prod. by GroovyRoom)',
//     year: 2017,
//     genre: '가요 / 댄스',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 514,
//     title: '오빠차',
//     year: 2015,
//     genre: '가요 / 랩/힙합',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 735,
//     title: '갖고놀래 (Feat. 다이나믹 듀오)',
//     year: 2013,
//     genre: '소울',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 76,
//     title: '작은 것들을 위한 시 (Boy With Luv) (Feat. Halsey)',
//     year: 2020,
//     genre: '댄스',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 316,
//     title: '남이 될 수 있을까',
//     year: 2017,
//     genre: '가요 / 인디',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 2709,
//     title: '그대가 나에게',
//     year: 1991,
//     genre: '가요 / 발라드',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 2785,
//     title: '그녀를 만나는 곳 100m 전',
//     year: 1990,
//     genre: '가요 / 전체',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
//   {
//     tests_id: 1,
//     id: 2852,
//     title: '눈물나는 날에는',
//     year: 1989,
//     genre: '가요 / 발라드',
//     userAnswer: '',
//     right_or_wrong: false,
//   },
// ];
