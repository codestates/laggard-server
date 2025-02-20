import { Songs } from '../../model/songs';
import { Genres } from '../../model/genres';
import { Periods } from '../../model/periods';
import {
  AnswerSheet,
  TestData,
  GenreScoreTable,
  ScoreSheet,
} from './interface';
import { QueryTypes, Op } from 'sequelize';
import { sequelize } from '../../model';
import e from 'express';
import { totalmem } from 'node:os';
import { TupleType } from 'typescript';

export default {
  processGenre: async (str: string) => {
    let result: string;
    if (/OST./gi.test(str)) {
      result = 'OST';
    } else if (/댄스/gi.test(str)) {
      result = 'dance';
    } else if (/발라드/gi.test(str)) {
      result = 'ballad';
    } else if (/힙합/gi.test(str)) {
      result = 'hiphop';
    } else if (/소울/gi.test(str)) {
      result = 'soul';
    } else if (/인디/gi.test(str)) {
      result = 'indie';
    } else if (/락/gi.test(str)) {
      result = 'rock';
    } else if (/트로트/gi.test(str)) {
      result = 'trot';
    } else {
      result = 'etc';
    }
    // return result;
    let genreData = await Genres.findOne({
      where: { classification: result },
      attributes: ['id'],
    });
    if (genreData) {
      const id: number | null = genreData.getDataValue('id');
      if (id) {
        return id;
      }
    }
  },
  processPeriod: async (num: number) => {
    let result: number;
    let count: number = 0;
    if (num >= 2000) {
      if (num < 2005) result = 2000;
      else if (num < 2010) result = 2005;
      else if (num < 2015) result = 2010;
      else result = 2015;
    } else {
      if (num >= 1990) result = 1990;
      else result = 1980;
    }
    let periodData = await Periods.findOne({
      where: { start_year: result },
      attributes: ['id', 'start_year'],
    });
    if (periodData) {
      const id: number | null = periodData.getDataValue('id');
      if (id) {
        return id;
      }
    }
  },
  setFocusYear: (yr: number) => {
    let result: [number, number, number];
    if (yr + 13 > 2020) {
      result = [2018, 2019, 2020];
    } else if (yr < 1976) {
      result = [1980, 1989, 2004];
    } else {
      result = [yr + 4, yr + 13, yr + 28 < 2021 ? yr + 28 : 2020];
    }
    return result;
  },
  quota: (yr: number) => {
    let result: [number, number, number];
    if (yr >= 1992) {
      result = [13, 0, 2];
    } else if (yr > 1982) {
      result = [11, 3, 1];
    } else {
      result = [10, 3, 2];
    }
    return result;
  },
  loadQuestion: async (
    yearArr: [number, number, number],
    quotaArr: [number, number, number],
  ) => {
    try {
      console.log('loadQuestion');
      let songData1 = await Songs.findAll({
        where: {
          year: {
            [Op.between]: [yearArr[1], yearArr[2]],
          },
          rank: {
            [Op.lte]: 30, //30위 이내
          },
        },
        limit: quotaArr[0],
        attributes: ['id', 'title', 'artist', 'year', 'genre', 'lyrics'], // 'title', 'artist',
        order: sequelize.random(),
      });
      let songData2 = await Songs.findAll({
        where: {
          year: {
            [Op.gt]: yearArr[2],
          },
          rank: {
            [Op.lte]: 30, //30위 이내
          },
        },
        limit: quotaArr[1],
        attributes: ['id', 'title', 'artist', 'year', 'genre', 'lyrics'], // 'title', 'artist',
        order: sequelize.random(),
      });
      let songData3 = await Songs.findAll({
        where: {
          year: {
            [Op.between]: [yearArr[0], yearArr[1] - 1],
          },
          rank: {
            [Op.lte]: 30, //30위 이내
          },
        },
        limit: quotaArr[2],
        attributes: ['id', 'title', 'artist', 'year', 'genre', 'lyrics'], // 'title', 'artist',
        order: sequelize.random(),
      });
      let songData: TestData[] = songData1.concat(songData2).concat(songData3);

      return songData;
    } catch {}
  },
  calculateTotalRate: (arr: AnswerSheet[]) => {
    let correct = arr.filter((q) => q.right_or_wrong === true).length;
    return correct / arr.length;
  },
  classifyScoreType: (num: number) => {
    //* Best, Excellent, Hard work, Laggard
    if (num >= 0.75) return ['B', 0.8];
    else if (num >= 0.55) return ['E', 0.65];
    else if (num >= 0.3) return ['H', 0.45];
    else return ['L', 0.25];
  },
  classifyGenreType: (arr: AnswerSheet[], scoreType: [string, number]) => {
    //* Neutral, OST, Dance, Ballad, Hiphop
    let D: AnswerSheet[] = arr.filter((answer) => answer.genre === 'dance');
    let O: AnswerSheet[] = arr.filter((answer) => answer.genre === 'OST');
    let H: AnswerSheet[] = arr.filter((answer) => answer.genre === 'hiphop');
    let B: AnswerSheet[] = arr.filter((answer) => answer.genre === 'ballad');
    // let totalArr = [D, O, H, B];
    let table: GenreScoreTable = {
      D: {},
      O: {},
      H: {},
      B: {},
    };
    table.D.total = D.length;
    table.D.correct = D.filter((el) => el.right_or_wrong === true).length;
    table.D.correct_answer_rate = table.D.correct / table.D.total;
    table.O.total = O.length;
    table.O.correct = O.filter((el) => el.right_or_wrong === true).length;
    table.O.correct_answer_rate = table.O.correct / table.O.total;
    table.H.total = H.length;
    table.H.correct = H.filter((el) => el.right_or_wrong === true).length;
    table.H.correct_answer_rate = table.H.correct / table.H.total;
    table.B.total = B.length;
    table.B.correct = B.filter((el) => el.right_or_wrong === true).length;
    table.B.correct_answer_rate = table.B.correct / table.B.total;
    console.table(table);
  },
  isTrendy: (arr: AnswerSheet[], yr: number, grade: string) => {
    let benchmark: number;
    let result: number | null;
    if (yr >= 1992) {
      benchmark = 2016;
    } else if (yr > 1982) {
      benchmark = 2013;
    } else {
      benchmark = 2010;
    }

    let correct = arr.filter(
      (el) => el.year >= benchmark && el.right_or_wrong === true,
    ).length;
    let length = arr.filter((el) => el.year >= benchmark).length;
    if (length > 0) {
      result = correct / length;
    } else {
      result = null;
    }

    if (!result) return false;
    else if (grade === 'E') return result >= 0.6;
    else if (grade === 'H') return result >= 0.4;
    else if (grade === 'L') return result >= 0.2;
    else return false;
  },
  processResultType: (str: string) => {
    let first: string = str[0];
    let second: string = str[1];
    let third: string = str[2];
    if (first === 'B') {
      if (second === 'O' || second === 'H') {
        second = 'N';
      }
    } else if (first === 'E') {
      if (second === 'O' || third === 'B') {
        second = 'N';
      }
    } else if (first === 'H') {
      if (second !== 'O') {
        second = 'N';
      }
    } else {
      second = 'N';
      third = 'B';
    }
    let result = first + second + third;
    return result;
  },
};
