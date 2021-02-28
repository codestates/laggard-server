import {
    Sequelize, 
    DataTypes, 
    Model, 
    Optional,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Association
} from 'sequelize';
import {sequelize} from './index';
import { Scores } from './scores';

// These are all the attributes in the User model
interface UsersAttributes {
    id: number | null;
    email : string,
    password : string | null,
    nickname : string,
    age : number,
    sex : boolean
}


export class Users extends Model<UsersAttributes>{
    public readonly id! : number;   //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.
    public email! : string;
    public password! : string;
    public nickname! : string;
    public age! : number;
    public sex! : boolean;

    // timestamps!
    public readonly createdAt!: Date;   //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.
    public readonly updatedAt!: Date;   //굳이 안넣어줘도 될 것 같지만 공식문서에 있으니깐 일단 넣어줌.

    // // Since TS cannot determine model association at compile time
    // // we have to declare them here purely virtually
    // // these will not exist until `Model.init` was called.
    public getScores!: HasManyGetAssociationsMixin<Scores>; // Note the null assertions!
    public addScores!: HasManyAddAssociationMixin<Scores, number>;
    public hasScores!: HasManyHasAssociationMixin<Scores, number>;
    public countScores!: HasManyCountAssociationsMixin;
    public createScores!: HasManyCreateAssociationMixin<Scores>;

    // // You can also pre-declare possible inclusions, these will only be populated if you
    // // actively include a relation.
    // public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code

    public static associations: {
        userHasManyScores: Association<Users, Scores>;
    };
}

Users.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        email : {
            type : DataTypes.STRING(45),
            allowNull: false
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull : true
        },
        nickname : {
            type : DataTypes.STRING(45),
            allowNull : false
        },
        age : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        sex : {
            type : DataTypes.BOOLEAN,
            allowNull : false
        }
    },
    {
        modelName : 'Users',
        tableName : 'Users',
        sequelize,
        freezeTableName : true,
        timestamps : true,
        updatedAt : 'updateTimestamp'
    }
)

Users.hasMany(Scores, {
    sourceKey : "id",
    foreignKey : "user_id",
    as : 'userHasManyScores'
});