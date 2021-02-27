import { Genres } from '../../model/genres';

console.log("======Create Genres Table======");

Genres.sync({force : true})
.then(() => {
    console.log("✅Success Create Genres Tables");
})
.catch(err => {
    console.log("❗️Error in Create Genres Tables : ", err);
})
