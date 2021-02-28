import { sequelize } from './index';
import { Sequelize,
        Model,
        DataTypes,
        BelongsToGetAssociationMixin,
        BelongsToCreateAssociationMixin,
        BelongsToSetAssociationMixin
     } from 'sequelize';
import { Users } from './users';

interface ScoresAttributes{
    id : number | null;
    user_id : number;
    songs_year : Date;
    score : number;
}

export class Scores extends Model<ScoresAttributes>{
    public readonly id!: number;
    public user_id!: number;
    public songs_year!: Date;
    public score ! : number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: BelongsToGetAssociationMixin<Users>;
    public setUser! : BelongsToSetAssociationMixin<Users,number>;
    public createUser! : BelongsToCreateAssociationMixin<Users>;
}

Scores.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        user_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model: "Users",
                key : "id"
            },
            onDelete : 'CASCADE'
        },
        songs_year : {
            type : DataTypes.DATE,
            allowNull : false
        },
        score : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
    },{
        sequelize,
        modelName : 'Scores',
        tableName : 'Scores',
        freezeTableName : true,
        timestamps : true,
        updatedAt : 'updateTimestamp'
    }
)

// Scores.belongsTo(Users, {targetKey : 'id'}); 설정안해도 됨. https://stackoverflow.com/questions/44070808/hasmany-called-with-something-thats-not-an-instance-of-sequelize-model