import express, { Request, Response, NextFunction } from 'express';
import { is } from 'sequelize/types/lib/operators';
import { Songs } from '../../model/songs';
import { Genres } from '../../model/genres';
import { Tests_and_genres } from '../../model/tests_and_genres';
import { Periods } from '../../model/periods';
import { Types } from '../../model/types';
import { Tests_and_periods } from '../../model/tests_and_periods';

export const getTestResult = async (req: Request, res: Response) => {
  try {
    console.log('========getTestResult=========');
    console.log(req.body);
    //tests_id, songs_id, genre, year, right_or_wrong

    if (!req.body.answerSheet) {
      let typeInfo = await Types.findOne({
        where: { id: 1 },
        attributes: ['id', 'title', 'subtitle', 'description', 'image'],
      });
      if (typeInfo) {
        res.status(201).send({ result: typeInfo });
      }
    }

    let genreScoreTable = {
      OST: 0,
      dance: 0,
      ballad: 0,
      hiphop: 0,
      soul: 0,
      indie: 0,
      rock: 0,
      etc: 0,
    };

    let periodScoreTable = {
      before2000: 0,
      2000: 0,
      2010: 0,
    };
  } catch {
    res.sendStatus(500);
  }
};

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
