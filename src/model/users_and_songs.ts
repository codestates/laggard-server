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
    id : number | null;
    user_id : number;
    song_id : number;
    right_or_wrong : boolean;
}

export class Users_and_songs extends Model<Users_and_songsAttributes>{
    public readonly id!: number;
    public user_id!: number;
    public song_id!: number;
    public right_or_wrong!: boolean;

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
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        user_id : {
            type : DataTypes.BIGINT.UNSIGNED,
            allowNull : false,
            references : {
                model : "Users",
                key : "id"
            },
            onDelete : 'CASCADE'
        },
        song_id : {
            type : DataTypes.BIGINT.UNSIGNED,
            allowNull : false,
            references : {
                model : "Songs",
                key : "id"
            },
            onDelete : 'CASCADE'
        },
        right_or_wrong : {
            type : DataTypes.BOOLEAN,
            allowNull : false
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

// Users_and_songs.hasMany(Users);
// Users_and_songs.hasMany(Songs);

Users_and_songs.hasMany(Users,{
    sourceKey : "user_id",
    foreignKey : "id",
    as : "Users_and_songsHasManyUser_id",
    onDelete : 'CASCADE'
})

Users_and_songs.hasMany(Songs,{
    sourceKey : "song_id",
    foreignKey : "id",
    as : "Users_and_songsHasManySong_id",
    onDelete : 'CASCADE'
})

//혹시 안되면 아래껄로
// Users.belongsToMany(Songs,{through : "Users_and_songs"});
// Songs.belongsToMany(Users,{through : "Users_and_songs"});