import {Songs} from '../../model/songs';

console.log("======Create Songs Table======");


const create_table_songs = async () => {
    await Songs.sync({force : true})
    .then(() => {
        console.log("✅Success Create Songs Table");
    })
    .catch((err) => {
        console.log("❗️Err Create Songs Table : ", err);
    })
}

create_table_songs();
