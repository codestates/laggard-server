import { sequelize } from './index';
import { Model, DataTypes } from 'sequelize';


interface visitCounterProps {
  id : number;
  counter : number;
}

export class VisitCounter extends Model<visitCounterProps>{
  public readonly id! :string;
  public counter!: number;
}

VisitCounter.init({
  id : {
    type : DataTypes.BIGINT,
    primaryKey : true,
    autoIncrement : true
  },
  counter : {
    type : DataTypes.BIGINT
  }
},{
  sequelize,
  modelName : "VisitCounter",
  tableName : "VisitCounter",
  freezeTableName : true,
  timestamps : true,
  updatedAt : 'updateTimestamp'
})