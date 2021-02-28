import { sequelize } from './index';
import { Sequelize, Model, DataTypes } from 'sequelize';


interface testsAttributes {
    id : number | null;
    types_id : number;
    age : number;
    sex : boolean;
}


export class Tests extends Model<testsAttributes> {
    public readonly id! : number;
    public types_id! : number;
    public age! : number;
    public sex! : boolean;

    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
}

Tests.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        types_id : {
            type : DataTypes.BIGINT.UNSIGNED,
            references : {
                model: "Types",
                key : "id"
            },
        },
        age : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        sex : {
            type : DataTypes.BOOLEAN,
            allowNull : false
        }
    },{
        sequelize,
        tableName : 'Tests',
        modelName : 'Tests',
        freezeTableName : true,
        timestamps : true,
        updatedAt : 'updateTimestamp'
    }
)