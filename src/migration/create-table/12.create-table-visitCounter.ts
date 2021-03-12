import { VisitCounter } from '../../model/visitCounter';

console.log("======Create Tests_and_periods Table======");

VisitCounter.sync({force : true})
.then(() => {
    console.log("✅Success Create VisitCounter Table");
})
.catch(err => {
    console.error("❗️Error in Create VisitCounter Table", err);
})
