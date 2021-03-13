import { QueryInterface, Sequelize, Options } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();

class options implements Options{
    dialect!: 'mysql';
    username!: string;
    password!: string;
    host!: string;
    port!: number;
    database!: string;
}        

const createDBOptions = new options();
createDBOptions.username = process.env.DB_USERNAME || 'root';
createDBOptions.password = process.env.DB_PASSWORD || 'your password';
createDBOptions.host = process.env.DB_HOST || 'localhost'
createDBOptions.port = Number(process.env.DB_PORT) || 3306;

createDBOptions.dialect = 'mysql';

let db_name = process.env.DB_DBNAME || 'new DataBase';

const dbCreateSequelize = new Sequelize(createDBOptions);

console.log(`======Create DataBase : ${db_name}======`);

dbCreateSequelize.getQueryInterface().createDatabase(db_name)
.then(() => {
    console.log("✅db create success!");
})
.catch((e) => {
    console.log("❗️error in create db : ", e);
})

// let newDB = await createDB.up(dbCreateSequelize.getQueryInterface(),dbCreateSequelize)
// .then(() => {
//     console.log("db create success");
// })
// .catch(e => {
//     console.log("db e : ", e);
// })