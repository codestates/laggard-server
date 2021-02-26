import { Tests_and_periods } from '../../model/tests_and_periods';

console.log("======Create Tests_and_periods Table======");

Tests_and_periods.sync({force : true})
.then(() => {
    console.log("✅Success Create Tests_and_periods Table");
})
.catch(err => {
    console.error("❗️Error in Create Tests_and_periods Table", err);
})
