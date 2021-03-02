import {Sequelize} from 'sequelize';
import {config} from '../config/config'

// export const sequelize = new Sequelize('typescript_test', 'root','Jaehyeon2!',{
//     host : 'localhost',
//     dialect : 'mysql',
// })

// export const sequelize = new Sequelize(
//     config.development.database,
//     config.development.username,
//     config.development.password,
//     {
//         host: config.development.host,
//         dialect: 'mysql'
//     }
// )

const env = process.env.NODE_ENV || 'development';
let dbEnv = config[env];

export const sequelize = new Sequelize(
    dbEnv
)