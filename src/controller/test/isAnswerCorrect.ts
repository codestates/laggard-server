import express, { Request, Response, NextFunction } from 'express';
import { is } from 'sequelize/types/lib/operators';
import { Songs } from '../../model/songs';
import { Genres } from '../../model/genres';
import { Tests_and_genres } from '../../model/tests_and_genres';
import { Periods } from '../../model/periods';
import { Tests_and_periods } from '../../model/tests_and_periods';
const { QueryTypes, Op } = require('sequelize');

const processGenre = (str: string) => {
  if (/OST./gi.test(str)) {
    console.log('OST');
    return 'OST';
  } else if (/.댄스/gi.test(str)) {
    console.log('댄스');
    return 'dance';
  } else if (/.발라드/gi.test(str)) {
    console.log('발라드');
    return 'ballad';
  } else if (/.힙합/gi.test(str)) {
    console.log('힙합');
    return 'hiphop';
  } else if (/.소울/gi.test(str)) {
    return 'soul';
  } else if (/.인디/gi.test(str)) {
    return 'indie';
  } else if (/락/gi.test(str)) {
    return 'rock';
  } else {
    console.log('장르없음');
    return 'etc';
  }
};

export const isAnswerCorrect = async (req: Request, res: Response) => {
  try {
    console.log('isAnswerCorrect');
    console.log(req.body);

    const tests_id: number = req.body.tests_id;
    const songs_id: number = req.body.songs_id;
    const submittedAnswer: string = req.body.answer;

    if (songs_id === undefined || submittedAnswer === undefined) {
      res.sendStatus(400);
    }

    let songData = await Songs.findOne({
      where: { id: songs_id },
      attributes: ['id', 'title', 'year', 'genre'],
    });
    console.log(`songData: ${songData}`);

    if (songData) {
      let genre: string = songData.getDataValue('genre');
      let year: number = songData.getDataValue('year');

      //* 장르 판별
      genre = processGenre(genre);
      console.log(genre);

      //* 정답 판별
      let title: any = songData.getDataValue('title');
      if (/\(/g.test(title)) {
        title = title.match(/.+(?=\()/g)[0];
      }
      title = title.replace(/\s/gi, '');
      console.log(title);
      let re = new RegExp(title, 'i');
      //!submittedAnswer도 띄어쓰기 가공해줘야함
      let isCorrect: boolean = re.test(submittedAnswer);
      console.log(isCorrect);

      //* 장르 점수 넣기
      let genreInfo = await Genres.findOne({
        where: { classification: genre },
        attributes: ['id'],
      });
      if (genreInfo) {
        let genres_id = genreInfo.id;
        let TGInfo = await Tests_and_genres.create({
          id: null,
          tests_id,
          genres_id,
          right_or_wrong: isCorrect,
        });
      }

      //* 시대 점수 넣기
      let start_year: number;
      if (year < 1990) {
        start_year = 1980;
      } else if (year < 2000) {
        start_year = 1990;
      } else if (year < 2010) {
        start_year = 2000;
      } else if (year < 2020) {
        start_year = 2010;
      } else {
        start_year = 2020;
      }

      let periodInfo = await Periods.findOne({
        where: { start_year },
        attributes: ['id'],
      });
      if (periodInfo) {
        let periods_id = periodInfo.id;
        let TPInfo = await Tests_and_periods.create({
          id: null,
          tests_id,
          periods_id,
        });
      }
      res.status(201).send({ data: isCorrect, message: 'Created.' });
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(500);
  }
};
