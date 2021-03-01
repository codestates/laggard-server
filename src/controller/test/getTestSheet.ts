import express, { Request, Response } from 'express';
import { Sequelize } from 'sequelize/types';
import { Songs } from '../../model/songs';
import { Users } from '../../model/users';
const { QueryTypes } = require('sequelize');

// const loadQuestion = async (period : string, numOfSongs : number) => {
//   console.log("loadQuestion");
//   let songData = await Songs.findAll({limit: numOfSongs});
// }

export const getTestSheet = async (req: Request, res: Response) => {
  console.log('getTestSheet');
  console.log(req.query);
  // loadQuestion('2020', 5);
  // let songData = await Songs.findAll({
  //   where: { artist: '노을' },
  //   attributes: ['id', 'g_songId', 'title', 'artist', 'lyrics'],
  //   // order: Sequelize.fn('RAND'),
  //   limit: 5,
  // });
  let userInfo = await Users.findOne({
    where: { id: 1 },
  });
  console.log(userInfo);
};

// 배열 만들자 ([80년대, 90년대, 00년대, 10~14, 15~])
