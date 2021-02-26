import {Users_and_songs} from '../../model/users_and_songs';

console.log("======Create Table Users_and_songs======");

const create_table_users_and_songs = async() => {
    Users_and_songs.sync({force : true})
    .then(() => {
        console.log("✅Succes Create Table Users_and_songs");
    })
    .catch(err => {
        console.log("❗️Err in Create Table Users_and_songs : ", err);    
    })
}

create_table_users_and_songs();
