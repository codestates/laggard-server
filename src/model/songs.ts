import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Correct_answer_rate } from './correct_answer_rate';
import { sequelize } from './index';

// These are all the attributes in the User model
interface SongsAttributes {
  id: number | null;
  artist: string;
  title: string;
  album_title: string;
  lyrics: string;
  year: number;
  g_songId: number;
  genre: string;
  rank: number;
  idol_index: string | null;
}

export class Songs extends Model<SongsAttributes> {
  public readonly id!: number;
  public title!: string;
  public artist!: string;
  public album_title!: string;
  public lyrics!: string;
  public year!: number;
  public g_songId!: number;
  public genre!: string;
  public rank!: number;
  public idol_index?: string;

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
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    artist: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    album_title: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    lyrics: {
      type: DataTypes.STRING(12000),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    g_songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idol_index: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    modelName: 'Songs',
    tableName: 'Songs',
    sequelize,
    freezeTableName: true,
    timestamps: true,
    updatedAt: 'updateTimestamp',
  },
);

Songs.hasMany(Correct_answer_rate,{
  sourceKey : "id",
  foreignKey : "songs_id",
  as : 'songsHasManyCorrect_answer_rate'
})
