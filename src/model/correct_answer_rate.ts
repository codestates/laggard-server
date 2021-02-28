import { sequelize } from './index';
import { Sequelize,
        Model,
        DataTypes,
        HasManyGetAssociationsMixin,
        HasManyAddAssociationMixin,
        HasManyHasAssociationMixin,
        HasManyCountAssociationsMixin,
        HasManyCreateAssociationMixin
    } from 'sequelize';
import { Songs } from './songs';

interface Correct_answer_rateAttributes{
    id : number | null;
    songs_id : number;
    age : number;
    sex : boolean;
    correct_answer : number;
    wrong_answer : number;
}

export class Correct_answer_rate extends Model<Correct_answer_rateAttributes>{
    public readonly id!: number;
    public songs_id! : number;
    public age! : number;
    public sex! : boolean;
    public correct_answer! : number;
    public wrong_answer! : number;

    public readonly createdAt! : Date;
    public readonly updatedAt! : Date; 

    public getSongs!: HasManyGetAssociationsMixin<Songs>; // Note the null assertions!
    public addSongs!: HasManyAddAssociationMixin<Songs, number>;
    public hasSongs!: HasManyHasAssociationMixin<Songs, number>;
    public countSongs!: HasManyCountAssociationsMixin;
    public createSongs!: HasManyCreateAssociationMixin<Songs>;

}

Correct_answer_rate.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        songs_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : "Songs",
                key : "id"
            },
            onDelete : "CASCADE"
        },
        age : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        sex : {
            type : DataTypes.BOOLEAN,
            allowNull : false
        },
        correct_answer : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        wrong_answer : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
    },{
        sequelize,
        modelName : 'Correct_answer_rate',
        tableName : "Correct_answer_rate",
        freezeTableName : true,
        timestamps : true,
        updatedAt : 'updateTimestamp'
    }
)

Correct_answer_rate.hasMany(Songs);