import { Tests_and_genres } from '../../model/tests_and_genres';

console.log("======Create Tests_and_genres Table");

Tests_and_genres.sync({force : true})
.then(() => {
    console.log("✅Success Create Tests_and_genres Table");
})
.catch(err => {
    console.error("❗️Error in Create Tests_and_genres Table")
})
