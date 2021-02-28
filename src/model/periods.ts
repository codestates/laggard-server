import { sequelize } from '../model/index';
import { Sequelize, Model, DataTypes } from 'sequelize';


interface periodsAttributes{
    id : number | null;
    start_year : number;
}

export class Periods extends Model<periodsAttributes>{
    public readonly id !: number;
    public start_year !:number;

    public readonly createdAt !: Date;
    public readonly updatedAt !: Date; 
}

Periods.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        start_year : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
    },{
        sequelize,
        modelName : "Periods",
        tableName : "Periods",
        freezeTableName : true,
        timestamps : true,
        updatedAt : "updateTimestamp"
    }
)