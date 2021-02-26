import {QueryInterface, Sequelize, ModelAttributes, ModelAttributeColumnOptions, Model, DataType, ModelAttributeColumnReferencesOptions, ModelValidateOptions, DataTypes} from 'sequelize';
import { sequelize } from "../model";
import { config } from '../config/config';
export const createDB = {
    up : async (queryInterface : QueryInterface, sequelize : Sequelize) => {
        queryInterface.createDatabase(config.development.database);
    },
    down : async(queryInterface : QueryInterface, sequelize : Sequelize) => {
        queryInterface.dropDatabase(config.development.database);
    }
}