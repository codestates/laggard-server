import { load } from 'cheerio';
import express, { Request, Response } from 'express';
import { Sequelize } from 'sequelize/types';
import { TupleType } from 'typescript';
import { sequelize } from '../../model';
import { Songs } from '../../model/songs';
import { Tests } from '../../model/tests';
import { Users } from '../../model/users';
const { QueryTypes, Op } = require('sequelize');

// console.log(Op);

const loadQuestion = async (year: number, numOfSongs: number) => {
  console.log('loadQuestion');
  let focusYear: [number, number];
  if (year + 13 > 2020) {
    return null;
  } else if (year < 1968) {
    focusYear = [1980, 1996];
  } else {
    focusYear = [year + 13, year + 28 < 2021 ? year + 28 : 2021];
  }
  console.log('**************focusYear****************');
  console.log(focusYear);
  console.log('***************************************');
  let songData1 = await Songs.findAll({
    where: {
      year: {
        [Op.between]: focusYear,
      },
    },
    limit: numOfSongs - 3,
    attributes: ['id', 'title', 'artist', 'year', 'genre', 'lyrics'], // 'title', 'artist',
    order: sequelize.random(),
  });
  let songData2 = await Songs.findAll({
    where: {
      year: {
        [Op.notBetween]: focusYear,
      },
    },
    limit: 3,
    attributes: ['id', 'title', 'artist', 'year', 'genre', 'lyrics'], // 'title', 'artist',
    order: sequelize.random(),
  });
  // console.log(`songData1: ${songData1}`);
  // console.log(`songData2: ${songData2}`);
  let songData: Array<object> = songData1.concat(songData2);
  console.log(`songData: ${songData}`);

  return songData;
};

export const getTestSheet = async (req: Request, res: Response) => {
  console.log('getTestSheet');
  console.log(req.query);

  const birth_year: number = Number(req.query.birth_year);
  console.log(birth_year);
  const sex: boolean = Boolean(req.query.sex);

  if (!birth_year || !sex) {
    res.sendStatus(400);
  }
  //* tests 테이블에 기록

  let testInfo = await Tests.create({
    id: null,
    types_id: null,
    birth_year,
    sex,
  });
  console.log(`testInfo: ${testInfo}`);

  let testData = await loadQuestion(birth_year, 12);
  if (testData) {
    // for(let question of testData) {
    //   question['answer'] = '';
    // }
    res
      .status(200)
      .send({ data: { id: testInfo.id, testData: testData }, message: 'Ok' });
  } else {
    res.status(404).send({ message: "There's no data" });
  }
  // console.log(testSheet[0]);
  // let songInfo = await Songs.findAll({
  //   where: { year: 2020 },
  //   attributes: ['id', 'title', 'artist', 'genre', 'lyrics'],
  //   limit: 5,
  //   order: sequelize.random(),
  // });
  // console.log(songInfo);
};

// 배열 만들자 ([80년대, 90년대, 00년대, 10~14, 15~])
