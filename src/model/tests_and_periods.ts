import { sequelize } from './index';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Tests } from './tests';


interface tests_and_periodsAttributes{
    id : number | null;
    tests_id : number;
    periods_id : number;
}

export class Tests_and_periods extends Model<tests_and_periodsAttributes>{
    public readonly id !: number;
    public tests_id !: number;
    public periods_id !: number;

    public readonly created_at !: Date;
    public readonly updated_at !: Date;
}

Tests_and_periods.init(
    {
        id : {
            type : DataTypes.BIGINT.UNSIGNED,
            autoIncrement : true,
            primaryKey : true
        },
        tests_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model: "Tests",
                key : "id"
            }
        },
        periods_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : "Periods",
                key : "id"
            }
        }
    },
    {
        sequelize
    }
)

Tests_and_periods.hasMany(Tests,{
    sourceKey : "tests_id",
    foreignKey : "id",
    as : "Tests_and_periodsHasManyTests_id"
})

Tests_and_periods.hasMany(Tests,{
    sourceKey : "periods_id",
    foreignKey : "id",
    as : "Tests_and_periodsHasManyPeriods_id"
})