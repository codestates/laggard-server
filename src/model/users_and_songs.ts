import { Sequelize, 
        Model,
        DataTypes,
        BelongsToManyAddAssociationMixin, 
        HasManyGetAssociationsMixin,
        HasManyAddAssociationMixin,
        HasManyHasAssociationMixin,
        HasManyCountAssociationsMixin,
        HasManyCreateAssociationMixin
    } from 'sequelize';
import { sequelize } from './index';
import { Songs } from './songs';
import { Users } from './users';

interface Users_and_songsAttributes{
    users_id : number;
    songs_id : number;
    right_answer : number;
}

export class Users_and_songs extends Model<Users_and_songsAttributes>{
    public readonly id!: number;
    public users_id!: number;
    public songs_id!: number;
    public right_answer!: number;

    //timestamp
    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;

    // // Since TS cannot determine model association at compile time
    // // we have to declare them here purely virtually
    // // these will not exist until `Model.init` was called.
    public getUsers!: HasManyGetAssociationsMixin<Users>; // Note the null assertions!
    public addUsers!: HasManyAddAssociationMixin<Users, number>;
    public hasUsers!: HasManyHasAssociationMixin<Users, number>;
    public countUsers!: HasManyCountAssociationsMixin;
    public createUsers!: HasManyCreateAssociationMixin<Users>;

    public getSongs!: HasManyGetAssociationsMixin<Songs>; // Note the null assertions!
    public addSongs!: HasManyAddAssociationMixin<Songs, number>;
    public hasSongs!: HasManyHasAssociationMixin<Songs, number>;
    public countSongs!: HasManyCountAssociationsMixin;
    public createSongs!: HasManyCreateAssociationMixin<Songs>;

    // // You can also pre-declare possible inclusions, these will only be populated if you
    // // actively include a relation.
    // public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code

    // public static associations: {
    //     projects: Association<User, Project>;
    // };
}

Users_and_songs.init(
    {
        users_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : "Users",
                key : "id"
            },
            onDelete : 'CASCADE'
        },
        songs_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : "Songs",
                key : "id"
            },
            onDelete : 'CASCADE'
        },
        right_answer : {
            type : DataTypes.BOOLEAN
        }
    },{
        modelName : 'Users_and_songs',
        tableName : 'Users_and_songs',
        sequelize,
        freezeTableName : true,
        timestamps : true,
        updatedAt : 'updateTimestamp'
    }
)

Users_and_songs.hasMany(Users);
Users_and_songs.hasMany(Songs);
