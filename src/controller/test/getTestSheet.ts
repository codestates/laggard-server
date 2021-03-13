import { load } from 'cheerio';
import express, { Request, Response } from 'express';
import { Sequelize } from 'sequelize/types';
import { TupleType } from 'typescript';
import { sequelize } from '../../model';
import { Songs } from '../../model/songs';
import { Tests } from '../../model/tests';
import { Users } from '../../model/users';
import { QueryTypes, Op } from 'sequelize';
// const func = require('./processFuncs');
import func from './processFuncs';
import { TestData } from './interface';

// console.log(Op);

export const getTestSheet = async (req: Request, res: Response) => {
  try {
    const birth_year: number = Number(req.query.birth_year);
    const sex: boolean = Boolean(req.query.sex);

    if (!birth_year || !sex) {
      res.sendStatus(400);
    }
    //* tests 테이블에 기록
    let focusYear = func.setFocusYear(birth_year);
    let quota = func.quota(birth_year);
    let testData = await func.loadQuestion(focusYear, quota);
    if (testData) {
      let questions_set = testData.reduce((acc: string, cur: TestData) => {
        return acc === '' ? String(cur.id) : acc + ',' + String(cur.id);
      }, '');
      let testInfo = await Tests.create({
        id: null,
        types_id: null,
        birth_year,
        sex,
        questions_set,
      });
      res.status(200).send({ id: testInfo.id, testData: testData });
    } else {
      res.status(404).send({ message: "There's no data" });
    }
  } catch {
    res.sendStatus(500);
  }
};
