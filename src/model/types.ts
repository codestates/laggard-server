import { sequelize } from './index';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Tests } from './tests';

interface typesAttributes {
    id : number | null;
    title : string;
    subtitle : string;
    description : string;
    image : string;
}

export class Types extends Model<typesAttributes>{
    
    public readonly id! : number;
    public subtitle! : string;
    public description! : string;
    public image! : string;

    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
}

Types.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        title : {
            type : DataTypes.STRING(45),
            allowNull : false
        },
        subtitle : {
            type : DataTypes.STRING(45)
        },
        description : {
            type : DataTypes.STRING(510)
        },
        image : {
            type : DataTypes.STRING
        }
    },{
        sequelize,
        tableName : "Types",
        modelName : "Types",
        freezeTableName : true,
        timestamps : true,
        updatedAt : "updateTimestamp"
    }
)

Types.hasMany(Tests,{
    sourceKey : 'id',
    foreignKey : 'types_id',
    as : 'types has many tests'
})