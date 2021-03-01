import { sequelize } from './index';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Tests } from './tests';
import { Genres } from './genres';

interface tests_and_genresAttributes{
    id : number | null;
    tests_id : number;
    genres_id : number;
    right_or_wrong : boolean;
}

export class Tests_and_genres extends Model<tests_and_genresAttributes>{
    public readonly id !: number;
    public tests_id !: number;
    public genres_id !: number;
    public right_or_wrong !: boolean;
}

Tests_and_genres.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        tests_id : {
            type : DataTypes.BIGINT.UNSIGNED,
            allowNull : false,
            references : {
                model : "Tests",
                key : "id"
            },
            onDelete : "CASCADE"
        },
        genres_id : {
            type : DataTypes.BIGINT.UNSIGNED,
            allowNull : false,
            references : {
                model : "Genres",
                key : "id"
            },
            onDelete : "CASCADE"
        },
        right_or_wrong : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
        }
    },{
        sequelize,
        tableName : "Tests_and_genres",
        modelName : "Tests_and_genres",
        freezeTableName : true,
        timestamps : true,
        updatedAt : "updateTimestamp"
    }
)

Tests_and_genres.hasMany(Tests,{
    sourceKey : "tests_id",
    foreignKey : "id",
    as : "Tests_and_genresHasManyTests_id"
})

Tests_and_genres.hasMany(Genres, {
    sourceKey : "genres_id",
    foreignKey : "id",
    as : "tests_and_genresHasManyGenres_id"
})
