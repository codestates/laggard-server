import express, { Request, Response } from 'express';
// import { Sequelize } from 'sequelize/types';
import { sequelize } from '../../model';
import { Scores } from '../../model/scores';
import { Users } from '../../model/users';
import { Sequelize, QueryTypes, Op } from 'sequelize';

interface Rank {
  user_id: number;
  total: string;
  nickname: string;
}

export const getTotalRank = async (req: Request, res: Response) => {
  try {
    let rankData: any = await sequelize.query(
      'SELECT `user_id`, sum(`score`) AS `total`, Users.nickname FROM `Scores` AS `Scores` LEFT JOIN `Users` on Users.id=Scores.user_id GROUP BY `user_id` ORDER BY max(`total`) DESC LIMIT 10;',
      { type: QueryTypes.SELECT },
    );
    if (rankData) {
      rankData.sort((a: any, b: any) => b.total - a.total);
    }
    res.status(200).send(rankData);
  } catch {
    res.sendStatus(500);
  }
};
