import * as fs from 'fs';
import * as path from 'path'
import {exec, execFile} from 'child_process';
import { stdout } from 'process';
import * as util from 'util';
console.log("migration-all-table");

try{
    //**************** */ exec로 실행
    //버전 1(상대경로)
    // exec('./node_modules/.bin/ts-node "./src/migration/create-db-test.ts"', (error, stdout, stderr) => {
    //     if(error){
    //         console.log(`exec drror : ${error}`);
    //         return;
    //     }
    //     if(stdout) console.log(`${stdout}`);
    //     if(stderr) console.log(`err : ${stderr}`);
    // });
    //버전 2(절대경로)
    // exec(`./node_modules/.bin/ts-node "${__dirname}/create-db-test.ts"`, (error, stdout, stderr) => {
    //         if(error){
    //             console.log(`exec drror : ${error}`);
    //             return;
    //         }
    //         if(stdout) console.log(`${stdout}`);
    //         if(stderr) console.log(`err : ${stderr}`);
    //     });
    //******************* */

    ///******* */ execFile로 실행
    //버전 1 (상대경로)
    // execFile('./node_modules/.bin/ts-node',['./src/migration/create-db-test.ts'], (error, stdout, stderr) => {
    //     if(error){
    //         console.log(`exec error : ${error}`);
    //         return;
    //     }
    //     if(stdout) console.log(`${stdout}`);
    //     if(stderr) console.log(`err : ${stderr}`);
    // })

    //버전 2 (절대경로)
    // execFile('./node_modules/.bin/ts-node',[`${__dirname}/create-db-test.ts`], (error, stdout, stderr) => {
    //     if(error){
    //         console.log(`exec error : ${error}`);
    //         return;
    //     }
    //     if(stdout) console.log(`${stdout}`);
    //     if(stderr) console.log(`err : ${stderr}`);
    // })
    ///******************** */


    // let migrationFiles : string[] = []
    // fs.readdir(path.join(__dirname,"/"),(err,files) => {
    //     if(err) console.log("err : ", err);
    //     if(files) {
    //         console.log("files : ", files);
    //         files.forEach(el=> {
    //             console.log(el.substring(0,9));
    //             if(el.substring(0,9) === 'create-db'){
    //                 console.log('okok');
    //                 migrationFiles.push(el);
    //             }
    //         })
    //     }
    // })

    

    // fs.readdir(path.join(__dirname,"/","create-table"),(err,files) => {
    //     if(err) console.log("err : ", err);
    //     if(files) {
    //         console.log("files : ", files);
    //         files.forEach(el=> {
    //             console.log(el.substring(0,14));
    //             if(el.substring(0,14) === 'create-table'){
    //                 console.log('okok');
    //                 migrationFiles.push(el);
    //             }
    //         })
    //     }
    // })
    

    // console.log("migrationFiles : ",migrationFiles);
    
    
}catch(e){
    console.log("error : ", e);
    
}
const asyncExec = util.promisify(exec)      //!!!!!중요!!!

console.log(`
    --------------------------------------
    +++Laggard Project Migration Start+++
    --------------------------------------
`);


let migrationAllTable = async () => {
    let migrationFiles : string[] = []

    fs.readdir(path.join(__dirname,"/","create-table"),async (err,files) => {
        if(err) console.log("err : ", err);
        if(files) {
            // console.log("files : ", files);
            files.forEach(el=> {
                // console.log(el.substr(el.indexOf('.')+1,12));
                if(el.substr(el.indexOf('.')+1,12) === 'create-table'){
                    migrationFiles.push(el);
                }
            })
            // console.log("migrationFiles : ",migrationFiles);   
            // migrationFiles.forEach(async el => {
            //     console.log(el);
                
            //     // await exec(`./node_modules/.bin/ts-node "${__dirname}/create-table/${el}"`, (error, stdout, stderr) => {
            //     //         if(error){
            //     //             console.log(`exec drror : ${error}`);
            //     //             return;
            //     //         }
            //     //         if(stdout) console.log(`std out : ${stdout}`);
            //     //         if(stderr) console.log(`std err : ${stderr}`);
            //     //     })


            //     // try{
            //     //     const result = exec(`./node_modules/.bin/ts-node "${__dirname}/create-table/${el}"`);
            //     //     console.log(result);
                    
            //     //     // if(stdout) console.log("stdout : ", stdout);
            //     //     // if(stderr) console.log("stderr : ", stderr);
            //     // }catch(e){
            //     //     console.log("Err : ", e);
            //     // }
            // })
            migrationFiles.sort((a,b) => {
                return Number(a.substr(0,a.indexOf('.'))) - Number(b.substr(0,b.indexOf('.')))
            });
            console.log("migrationFiles : ", migrationFiles);
            
            for(let el of migrationFiles){
                console.log("Migration File Name : ", el);
                // let result =  await exec(`./node_modules/.bin/ts-node "${__dirname}/create-table/${el}"`)
                // console.log(result);
                /////
                const { stdout, stderr } = await asyncExec(`./node_modules/.bin/ts-node "${__dirname}/create-table/${el}"`)
                if(stdout) console.log(stdout);
                if(stderr) console.error("Std Err : ",stderr);
            }
        }
    })

    
}



migrationAllTable()



