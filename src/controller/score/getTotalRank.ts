import express, { Request, Response } from 'express';
// import { Sequelize } from 'sequelize/types';
import { sequelize } from '../../model';
import { Scores } from '../../model/scores';
import { Users } from '../../model/users';
import { Sequelize, QueryTypes, Op } from 'sequelize';

export const getTotalRank = async (req: Request, res: Response) => {
  try {
    console.log('getTotalRank');
    console.log(req.query);
    console.log(Users);

    // let scoreData = await Scores.findAll({
    //   attributes: [
    //     'user_id',
    //     [Sequelize.fn('sum', Sequelize.col('score')), 'total'],
    //   ],
    //   group: ['user_id'],
    //   limit: 10,
    //   order: [[Sequelize.fn('max', Sequelize.col('total')), 'DESC']],
    //   // group: 'user_id',
    //   raw: true,
    // });
    let rankData = await sequelize.query(
      'SELECT `user_id`, sum(`score`) AS `total`, Users.nickname FROM `Scores` AS `Scores` LEFT JOIN `Users` on Users.id=Scores.user_id GROUP BY `user_id` ORDER BY max(`total`) DESC LIMIT 10;',
    );
    console.log(rankData[0]);
    res.status(200).send(rankData[0]);
  } catch {}
};
