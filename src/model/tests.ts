import { sequelize } from './index';
import { Sequelize, Model, DataTypes } from 'sequelize';

interface testsAttributes {
  id: number | null;
  types_id: number | null; // or null 부분 추가했습니다.
  birth_year: number;
  sex: boolean;
  questions_set?: string;
  answer_set?: string;
}

export class Tests extends Model<testsAttributes> {
  public readonly id!: number;
  public types_id!: number;
  public birth_year!: number;
  public sex!: boolean;
  public questions_set!: string;
  public answer_set!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tests.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    types_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      references: {
        model: 'Types',
        key: 'id',
      },
    },
    birth_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sex: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    questions_set: {
      type: DataTypes.STRING(255),
    },
    answer_set: {
      type: DataTypes.STRING(55),
    },
  },
  {
    sequelize,
    tableName: 'Tests',
    modelName: 'Tests',
    freezeTableName: true,
    timestamps: true,
    updatedAt: 'updateTimestamp',
  },
);
