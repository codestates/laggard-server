import { load } from 'cheerio';
import express, { Request, Response } from 'express';
import { Sequelize } from 'sequelize/types';
import { TupleType } from 'typescript';
import { sequelize } from '../../model';
import { Songs } from '../../model/songs';
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
    limit: numOfSongs - 6,
    attributes: ['id', 'year', 'genre', 'lyrics'], // 'title', 'artist',
    order: sequelize.random(),
  });
  let songData2 = await Songs.findAll({
    where: {
      year: {
        [Op.notBetween]: focusYear,
      },
    },
    limit: 6,
    attributes: ['id', 'year', 'genre', 'lyrics'], // 'title', 'artist',
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
  let testData = await loadQuestion(birth_year, 20);
  console.log(Array.isArray(testData));
  if (testData) {
    res.send({ data: testData, message: 'Ok' });
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
