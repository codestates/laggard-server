import { sequelize } from './index';
import { Sequelize, Model, DataTypes } from 'sequelize';


interface genresAttributes{
    id : number | null;
    classification : string;
}

export class Genres extends Model<genresAttributes>{
    public readonly id !: number;
    public classification !: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date; 
}

Genres.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        classification : {
            type : DataTypes.STRING(45),
            allowNull : false
        }
    },{
        sequelize,
        tableName : "Genres",
        modelName : "Genres",
        freezeTableName : true,
        timestamps : true,
        updatedAt : "updateTimestamp"
    }
)