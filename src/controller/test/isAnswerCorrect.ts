import express, { Request, Response, NextFunction } from 'express';
import { Songs } from '../../model/songs';
const { QueryTypes, Op } = require('sequelize');

export const isAnswerCorrect = async (req: Request, res: Response) => {
  console.log('isAnswerCorrect')
  console.log(req.body)
  
  const id: number = req.body.songs_id;
  const submittedAnswer: string = req.body.answer;

  if (id === undefined || submittedAnswer === undefined) {
    res.sendStatus(400);
  }

  let songInfo = await Songs.findOne({ where: { id }, attributes: ['id', 'title', 'year', 'genre']})
  console.log(songInfo)
  let title = songInfo.dataValues.title; // 'Frank Ocean (feat. SOLE)'
  title = title.match(/.+(?=\()/)[0].replace(/\s/gi, "") // 'FrankOcean'
  let re = new RegExp(title, 'i')
  let isCorrect = re.test(submittedAnswer);
  if(isCorrect) {
    //점수 올리기
    //장르별 점수 기록
  } else {
    //장르별 문제 푼 점수?
  }

  res.status(200).send({ data: isCorrect, message: "Created."})
}