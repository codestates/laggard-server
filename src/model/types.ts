import { sequelize } from './index';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Tests } from './tests';

interface typesAttributes {
    title : string;
    subtitle : string;
    description : string;
}

export class Types extends Model<typesAttributes>{
    
    public readonly id! : number;
    public subtitle! : string;
    public description! : string;

    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
}

Types.init(
    {
        title : {
            type : DataTypes.STRING(45),
            allowNull : false
        },
        subtitle : {
            type : DataTypes.STRING(45)
        },
        description : {
            type : DataTypes.STRING(510)
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