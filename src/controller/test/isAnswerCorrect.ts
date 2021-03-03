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
    return '힙합';
  } else {
    console.log('장르없음');
    return '';
  }
};

export const isAnswerCorrect = async (req: Request, res: Response) => {
  console.log('isAnswerCorrect');
  console.log(req.body);

  const id: number = req.body.songs_id;
  const submittedAnswer: string = req.body.answer;

  if (id === undefined || submittedAnswer === undefined) {
    res.sendStatus(400);
  }

  // type _songData = {
  //   id: number,
  //   title: string,
  //   year: number,
  //   genre: string
  // }
  let songData = await Songs.findOne({
    where: { id },
    attributes: ['id', 'title', 'year', 'genre'],
  });
  console.log(songData);

  if (songData) {
    //* 장르 판별
    let genre: string = songData.getDataValue('genre');
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
    let isCorrect: boolean = re.test(submittedAnswer);
    console.log(isCorrect);

    //* 장르 점수 넣기
    // isCorrect ?

    res.status(201).send({ data: isCorrect, message: 'Created.' });
  }

  // let title = songData.; // 'Frank Ocean (feat. SOLE)'
  // console.log(title);
  // title = title.match(/.+(?=\()/)[0].replace(/\s/gi, "") // 'FrankOcean'
  // let re = new RegExp(title, 'i')
  // let isCorrect = re.test(submittedAnswer);
  // if (isCorrect) {
  // 점수 올리기
  //장르별 점수 기록
  // } else {
  //장르별 문제 푼 점수?
  // }

  // res.status(200).send({ data: isCorrect, message: 'Created.' });
};
