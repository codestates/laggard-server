import * as dotenv from 'dotenv';
dotenv.config();

// export const config = {
//     development : {
//         username : process.env.DB_USERNAME || 'root',
//         password : process.env.DB_PASSWORD,
//         database : process.env.DB_DBNAME || 'typescript_test',
//         host : process.env.DB_HOST || 'localhost',
//         port : process.env.DB_PORT || 3306,
//         dialect : "mysql"
//     },
//     test : {
//         username : process.env.DB_USERNAME || 'root',
//         password : process.env.DB_PASSWORD,
//         database : process.env.DB_DBNAME || 'typescript_test',
//         host : process.env.DB_HOST || 'localhost',
//         port : process.env.DB_PORT || 3306,
//         dialect : "mysql"
//     }
// }

export const config : {[index:string] : {}} = {
    development : {
        username : process.env.DB_USERNAME || 'root',
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DBNAME || 'typescript_test',
        host : process.env.DB_HOST || 'localhost',
        port : process.env.DB_PORT || 3306,
        dialect : "mysql"
    },
    test : {
        username : process.env.DB_USERNAME || 'root',
        password : process.env.DB_PASSWORD,
        database : 'testDB',
        host : process.env.DB_HOST || 'localhost',
        port : process.env.DB_PORT || 3306,
        dialect : "mysql"
    }
}