import { sequelize } from './index';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Tests } from './tests';

interface tests_and_periodsAttributes {
  id: number | null;
  tests_id: number;
  periods_id: number;
  correct: number; // 맞힌 문제 수
  total: number; // 총 푼 문제 수
  correct_answer_rate: number; // 정답률
}

export class Tests_and_periods extends Model<tests_and_periodsAttributes> {
  public readonly id!: number;
  public tests_id!: number;
  public periods_id!: number;
  public correct!: number;
  public total!: number;
  public correct_answer_rate!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Tests_and_periods.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tests_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Tests',
        key: 'id',
      },
    },
    periods_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Periods',
        key: 'id',
      },
    },
    correct: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correct_answer_rate: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Tests_and_periods',
    modelName: 'Tests_and_periods',
    freezeTableName: true,
    timestamps: true,
    updatedAt: 'updateTimestamp',
  },
);

Tests_and_periods.hasMany(Tests, {
  sourceKey: 'tests_id',
  foreignKey: 'id',
  as: 'Tests_and_periodsHasManyTests_id',
});

Tests_and_periods.hasMany(Tests, {
  sourceKey: 'periods_id',
  foreignKey: 'id',
  as: 'Tests_and_periodsHasManyPeriods_id',
});
