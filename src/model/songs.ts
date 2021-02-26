import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {sequelize} from './index';

// These are all the attributes in the User model
interface SongsAttributes {
    // id: number | null;
    artist : string ,
    title : string,
    album_title : string,
    lyrics : string,
    publishedAt : string,
    g_songId : number,
    genre : string,
    rank : number,
    idol_index : string | null;
}

export class Songs extends Model<SongsAttributes>{
    public readonly id! : number;
    public title! : string;
    public artist! : string;
    public album_title! : string;
    public lyrics! : string;
    public publishedAt! : string;
    public g_songId! : number;
    public genre! : string;
    public rank! : number;
    public idol_index? : string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // // Since TS cannot determine model association at compile time
    // // we have to declare them here purely virtually
    // // these will not exist until `Model.init` was called.
    // public getProjects!: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
    // public addProject!: HasManyAddAssociationMixin<Project, number>;
    // public hasProject!: HasManyHasAssociationMixin<Project, number>;
    // public countProjects!: HasManyCountAssociationsMixin;
    // public createProject!: HasManyCreateAssociationMixin<Project>;

    // // You can also pre-declare possible inclusions, these will only be populated if you
    // // actively include a relation.
    // public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code

    // public static associations: {
    //     projects: Association<User, Project>;
    // };
}

Songs.init(
    {
        artist : {
            type : DataTypes.STRING,
            allowNull : false
        },
        title : {
            type : DataTypes.STRING,
            allowNull: false
        },
        album_title : {
            type : DataTypes.STRING,
            allowNull : false
        },
        lyrics : {
            type : DataTypes.STRING,
            allowNull : false
        },
        publishedAt : {
            type : DataTypes.STRING,
            allowNull : false
        },
        g_songId : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        genre : {
            type : DataTypes.STRING,
            allowNull : false
        },
        rank : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        idol_index : {
            type : DataTypes.STRING,
            allowNull : true
        }
    },
    {
        modelName : 'Songs',
        tableName : 'Songs',
        sequelize,
        freezeTableName : true,
        timestamps : true,
        updatedAt : 'updateTimestamp'
    }
)